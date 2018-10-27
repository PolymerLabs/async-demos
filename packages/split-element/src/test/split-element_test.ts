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

const assert = chai.assert;

suite('SplitElement', () => {

  test.only('Loads an element on demand', async () => {
    const el = new TestElementStub();
    el.foo = 'bar';
    document.body.appendChild(el);
    await TestElementStub.loaded();
    assert.equal(el.constructor.name, 'TestElement');
    assert.isTrue((el as any).implConstructorRan);

    // Test that the upgraded element renders. Do this in the same test because
    // we only have one chance to async load an element definition.
    // Wait a microtask for rendering. We need more tests with more element
    // definitions to tes more loading scenarios.
    await 0;
    assert.equal(el.shadowRoot!.textContent, 'Upgraded! bar');
  });

  test('Upgrades an element synchronously after loaded', async () => {
    // This test must run after "Loads an element on demand"
    const el = new TestElementStub();
    assert.equal(el.constructor.name, 'TestElement');
    assert.isTrue((el as any).implConstructorRan);
  });

  test('Upgrades an element created via HTML', async () => {
    // This test must run after "Loads an element on demand"
    const container = document.createElement('div');
    container.innerHTML = `<test-element></test-element>`;
    const el = container.querySelector('test-element')!;
    assert.equal(el.constructor.name, 'TestElement');
    assert.isTrue((el as any).implConstructorRan);
  });

  test('Upgraded elements render', async () => {
    // This test must run after "Loads an element on demand"
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = `<test-element></test-element>`;
    const el = container.querySelector('test-element')!;
    assert.equal(el.constructor.name, 'TestElement');
    assert.isTrue((el as any).implConstructorRan);
  });

});
