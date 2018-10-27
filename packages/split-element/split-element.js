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
import { LitElement, html } from '@polymer/lit-element';
export * from '@polymer/lit-element';
export class SplitElement extends LitElement {
    static loaded() {
        if (!this.hasOwnProperty('_loadedPromise')) {
            this._loadedPromise = new Promise((resolve, reject) => {
                this._resolveLoaded = resolve;
                this._rejectLoaded = reject;
            });
        }
        return this._loadedPromise;
    }
    static _upgrade(element, klass) {
        SplitElement._upgradingElement = element;
        Object.setPrototypeOf(element, klass.prototype);
        new klass();
        SplitElement._upgradingElement = undefined;
        element.requestUpdate();
        if (element.isConnected) {
            element.connectedCallback();
        }
    }
    constructor() {
        if (SplitElement._upgradingElement !== undefined) {
            return SplitElement._upgradingElement;
        }
        super();
        const ctor = this.constructor;
        if (ctor.hasOwnProperty('implClass')) {
            // Implementation already loaded, do the upgrade immediately
            ctor._upgrade(this, ctor.implClass);
        }
        else {
            // Implementation not loaded
            if (typeof ctor.load !== 'function') {
                throw new Error('A SplitElement must have a static `load` method');
            }
            (async () => {
                ctor.implClass = await ctor.load();
                ctor._upgrade(this, ctor.implClass);
                ctor._resolveLoaded();
            })();
        }
    }
    // So that stubs don't have to implement render
    render() {
        return html ``;
    }
}
