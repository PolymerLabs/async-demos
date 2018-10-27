import { LitElement } from '@polymer/lit-element';
import {
  AnimationFrameQueueScheduler,
  Scheduler,
} from '@polymer/scheduler';
export * from '@polymer/lit-element';
export {customElement} from '@polymer/lit-element/lib/decorators.js';
export {styleString} from '@polymer/lit-element/lib/render-helpers';

const scheduler = new Scheduler();
scheduler.addLocalQueue('animation', new AnimationFrameQueueScheduler(8));

export abstract class LazyLitElement extends LitElement {
  _scheduleUpdate() {
    // console.log('_scheduleUpdate');
    // console.log('LazyLitElement._scheduleUpdate');
    // return new Promise((r) => setTimeout(r));
    return scheduler.scheduleTask('animation', () => {
      // console.log('task run');
      (this as any)._validate();
    });
  }
}
