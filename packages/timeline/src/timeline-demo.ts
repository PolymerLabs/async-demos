import { LitElement, property, html, customElement, repeat } from '@polymer/lazy-lit-element';
import './list-item.js';

@customElement('timeline-demo' as any)
export class TimelineDemo extends LitElement {

  @property()
  query?: string;

  @property()
  data?: any;

  render() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h1>TV Search Demo</h1>
      <header>
        <label>
          Search:
          <input @input=${this._onInput}></input>
      </header>
    `;
  }

  async _onInput(e: Event) {
    this.query = (e.target as HTMLInputElement).value;
  }

  // renderData() {
  //   if (this.data === undefined) {
  //     return html``
  //   }
  //   console.log(`rendering ${this.data.data.children.length} items`);
  //   return html`
  //     ${repeat(this.data.data.children, (c: any) => c.id, (c: any) => html`
  //       <list-item .data=${c}></list-item>
  //     `)}
  //   `;
  // }
}

declare global {
  interface ImportMeta {
    url: string;
  }
}
