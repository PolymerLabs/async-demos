/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {LitElement} from '@polymer/lit-element';
import {render} from './node_modules/lit-html/lib/shady-render.js';
import {TemplateProcessor} from './node_modules/lit-html/lib/template-processor.js';
export {html} from './node_modules/lit-html';

const MAX_CHUNK_TIME = 8;
const microtask = Promise.resolve();
let elementsRendered = 0;
const chunkQueue = new Map();
let chunkScheduled = false;
function flushChunkQueue() {
  chunkScheduled = false;
  let lastChunkTime = performance.now();
  for (const [el, flush] of chunkQueue) {
    let now = performance.now();
    if (now - lastChunkTime < MAX_CHUNK_TIME) {
      elementsRendered++;
      chunkQueue.delete(el);
      flush();
    } else {
      chunkScheduled = true;
      requestAnimationFrame(flushChunkQueue);
      break;
    }
  }
  // console.log(`${elementsRendered} els in ${(performance.now() - lastChunkTime).toFixed(2)} ms (${chunkQueue.size} queued)`);
  elementsRendered = 0;
}
function scheduleRender(el, flush) {
  chunkQueue.set(el, flush);
  if (!chunkScheduled) {
    chunkScheduled = true;
    microtask.then(flushChunkQueue);
  }
}

export class DeferredLitElement extends LitElement {
  static render(...args) {
    return render(...args);
  }
  _flush() {
    if (this.defer) {
      scheduleRender(this, () => super._flush());
    } else {
      super._flush();
    }
  }
}

/////////////////////////

let queue = window.queue = new Set();
const flushQueue = window.flushQueue = () => {
  const q = queue;
  queue = new Set();
  q.forEach(p => p._deferredCommit());
}
//TODO(kschaaf): wire flushQueue in to the system, to be called when
// some heuristic of "a full tree's worth of deferred updates has flushed"
setInterval(flushQueue, 1000);

function deferPart(part) {
  part._committedOnce = false;
  part._deferredCommit = part.commit;
  part.commit = function() {
    if (this._committedOnce) {
      queue.add(this);
    } else {
      this._committedOnce = true;
      this._deferredCommit();
    }
  }
  return part;
}

class DeferredTemplateProcessor extends TemplateProcessor {
  handleAttributeExpressions(...args) {
    return super.handleAttributeExpressions(...args).map(p => deferPart(p));
  }
  handleTextExpression(...args) {
    return deferPart(super.handleTextExpression(...args));
  }
}

const deferredProcessor = new DeferredTemplateProcessor();

export const deferredHtml = (strings, ...values) =>
  new TemplateResult(strings, values, 'html', deferredProcessor);