# split-element
Lazy-loaded LitElements

## Overview

This is an experiment in lazy loading element definitions, on demand when the first instance of the element class is created.

## Why?

This technique might be useful if you don't know ahead of time what elements might appear on a page, like with a content management system where custom elements can appear in the content.

## How does it work?

To make a SplitElement, you write two element definitions in two modules.

One is the "stub", which defines the eagerly loaded parts of an element: usually the name and the properties, but it could be more. The properties must be defined with the stub so that LitElement can generate `observedAttributes` in time for the `customElements.define()` call.

The stub also must have a static async `load` method which returns the implementation class.

The other class is the "implementation", which contains everything else.

The `SplitElement` constructor loads the implementation class and performs an
"upgrade" of the stub to the implementation once it's loaded.

## Example

_Note, the examples use TypeScript_

my-element.ts:
```ts
import {SplitElement, property} from '../split-element.js';

export class MyElement extends SplitElement {
  static async load() {
    return (await import('./my-element-impl.js')).TestElement;
  }

  @property() message?: string;
}
customElements.define('test-element', TestElementStub);
```

my-element-impl.ts:
```ts
import {MyElement} from './my-element.js';
import { html } from '../split-element.js';

export class MyElementImpl extends MyElement {
  render() {
    return html`
      <h1>I've been upgraded</h1>
      My message is ${this.message}.
    `;
  }
}
```

## Status: 🚧 Super experimental 🚧
