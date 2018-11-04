import { LitElement, property, html, customElement } from '@polymer/lazy-lit-element';
import './npm-package.js';

@customElement('async-io-demo' as any)
export class AsyncIoDemo extends LitElement {

  @property()
  name?: string;

  render() {
    return html`
      <style>
        :host {
          display: block;
        }
        input {
          margin-bottom: 20px;
        }
      </style>
      <h1>Async I/O Demo</h1>
      <label>
        Package Name:
        <input .value=${this.name === undefined ? '' : this.name} @change=${this._onChange}>
      </label>
      <npm-package .name=${this.name}></npm-package>
    `;
  }

  _onChange(e: Event) {
    this.name = (e.target as HTMLInputElement).value;
  }
}
