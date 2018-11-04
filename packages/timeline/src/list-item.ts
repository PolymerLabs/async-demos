import { LitElement, property, html, customElement } from '@polymer/lazy-lit-element';

@customElement('list-item' as any)
export class ListItem extends LitElement {

  @property()
  data?: any;

  render() {
    console.log('list-item render()');
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <header>
        <h1>${this.data.data.title}</h1>
        author: ${this.data.data.author_fullname}
        in ${this.data.data.subreddit_name_prefixed}
      </header>
    `;
  }
}
