import { LitElement } from '@polymer/lit-element';
import {
  AnimationFrameQueueScheduler,
  Scheduler,
} from '@polymer/scheduler';
export * from '@polymer/lit-element';
export {customElement} from '@polymer/lit-element/lib/decorators.js';
// export {until} from 'lit-html/directives/until.js';
export {until} from '../node_modules/@polymer/lit-element/node_modules/lit-html/directives/until.js';
export {repeat} from '../node_modules/@polymer/lit-element/node_modules/lit-html/directives/repeat.js';
export * from '../node_modules/@polymer/lit-element/node_modules/lit-html/lit-html.js';
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
  //   await new Promise((res) => {
  //     setTimeout(res);
  //     this[resolveUrgentUpdate] = res;
  //   });
  //   (this as any)._validate();
  // }
    let validated = false;
    const validate = () => {
      if (!validated) {
        (this as any)._validate();
        validated = true;
      }
    };
    const urgentPromise = new Promise((res) => {
      this[resolveUrgentUpdate] = res;
    });
    urgentPromise.then(() => {
      validate();
      this[resolveUrgentUpdate] = undefined;
    });
    return Promise.race([
      urgentPromise,
      scheduler.scheduleTask('animation', validate)
    ]);
  }
}
