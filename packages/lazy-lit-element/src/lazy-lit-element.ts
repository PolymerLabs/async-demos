import { LitElement } from '@polymer/lit-element';
import {
  AnimationFrameQueueScheduler,
  Scheduler,
} from '@polymer/scheduler';
export * from '@polymer/lit-element';
export {customElement} from '@polymer/lit-element/lib/decorators.js';
// export {until} from 'lit-html/directives/until.js';
export {until} from '../node_modules/@polymer/lit-element/node_modules/lit-html/directives/until.js';
export {styleString} from '@polymer/lit-element/lib/render-helpers';

const scheduler = new Scheduler();
scheduler.addLocalQueue('animation', new AnimationFrameQueueScheduler(8));

const resolveUrgentUpdate = Symbol();

export abstract class LazyLitElement extends LitElement {
  [resolveUrgentUpdate]?: () => void;

  requestUrgenUpdate() {
    this.requestUpdate();
    if (this[resolveUrgentUpdate] !== undefined) {
      this[resolveUrgentUpdate]!();
    }
  }

  async _scheduleUpdate() {
    await Promise.race([
      new Promise((res) => {
        this[resolveUrgentUpdate] = res;
      }),
      scheduler.scheduleTask('animation', () => {})
    ]);
    this[resolveUrgentUpdate] = undefined;
    (this as any)._validate();
  }
}
