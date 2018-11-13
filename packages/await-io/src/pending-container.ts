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
import { property as litProperty} from '@polymer/lazy-lit-element';

// export const onPendingState = Symbol();
// export const hasPendingChildren = Symbol();
// const pendingCount = Symbol();

type Constructor<T> = {new(...args: any[]): T};

interface CustomElement extends HTMLElement {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
}

// See: https://github.com/Polymer/lit-element/issues/288
const property = litProperty as () => (proto: Object, name: string|Symbol) => void;

export const PendingContainer = <C extends Constructor<CustomElement>>(base: C) => {
  class PendingContainerMixin extends base {
    @property()
    /* protected */ __hasPendingChildren: boolean = false;

    /* private */ __pendingCount = 0;

    connectedCallback() {
      this.addEventListener('pending-state', this.__onPendingState);
      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }

    disconnectedCallback() {
      this.addEventListener('pending-state', this.__onPendingState);
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }

    /* private */ async __onPendingState(e: Event) {
      const promise = (e as CustomEvent).detail.promise;
      if (promise) {
        this.__hasPendingChildren = true;
        this.__pendingCount++;
        try {
          await promise;
        } catch(e) {
          // to supress uncaught exception logs
        } finally {
          this.__pendingCount--;
          if (this.__pendingCount === 0) {
            this.__hasPendingChildren = false;
          }
        }
      }
    }
  }
  return PendingContainerMixin;
};
// PendingContainer.onPendingState = onPendingState;
// PendingContainer.hasPendingChildren = hasPendingChildren;
