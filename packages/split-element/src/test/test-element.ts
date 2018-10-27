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

import {TestElementStub} from './test-element-stub.js';
import { html } from '../split-element.js';

export class TestElement extends TestElementStub {
  implConstructorRan: boolean;

  constructor() {
    super();
    this.implConstructorRan = true;
  }

  render() {
    console.log('TestElement.render');
    return html`<h1>Upgraded! ${this.foo}</h1>`;
  }

  connectedCallback() {
    console.log('TestElement.connectedCallback');
    super.connectedCallback();
  }
}
