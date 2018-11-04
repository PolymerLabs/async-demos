import { LitElement, property, html, customElement, repeat } from '@polymer/lazy-lit-element';
import './npm-package.js';
import './spinner.js';
import { runAsync, InitialStateError } from './run-async.js';

@customElement('search-demo' as any)
export class SearchDemo extends LitElement {

  @property()
  query?: string;

  @property()
  pending: boolean = false;

  pendingCount = 0;


  constructor() {
    super();
    this.addEventListener('pending-state', async (e: Event) => {
      const promise = (e as CustomEvent).detail.promise;
      if (promise) {
        this.pending = true;
        this.pendingCount++;
        try {
          await promise;
        } catch(e) {
        } finally {
          this.pendingCount--;
          if (this.pendingCount === 0) {
            this.pending = false;
          }
        }
      }
    });
  }

  render() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
        }
        header {
          /* flex: 0 0 8em; */
          padding: 1em;
          display: flex;
          align-items: baseline;
        }
        #input-container {
          flex: 1;
          padding: 1em;
        }
        input {
          margin-bottom: 20px;
        }
        #results {
          display: grid;
          grid-template-columns: repeat(auto-fill, 400px);
          grid-template-rows: repeat(auto-fill);
          grid-gap: 20px;
          padding: 1em;
        }
        input {
          padding: .25em;
          font-size: 1.5em;
          background: #333;
          color: white;
          width: 100%;
          border: none;
          outline: none;
        }
      </style>
      <header>
        <h1>NPM Search Demo</h1>
        <md-spinner .active=${this.pending}></md-spinner>
        <div id="input-container">
          <input
            .value=${this.query === undefined ? '' : this.query}
            placeholder="Search"
            @input=${this._onInput}>
        </div>
      </header>
      ${searchPackages(this.query,
        (data) => html`
        <div id="results">
          ${repeat(data.objects,
              (i: any) => i.package.name,
              (i: any) => html`<search-item .package=${i.package}></search-item>`)}
        </div>`,
        () => html`<md-spinner active></md-spinner>`,
        () => html`Enter a Search Term`)}
    `;
  }

  _onInput(e: Event) {
    this.query = (e.target as HTMLInputElement).value;
  }
}

const searchPackages = runAsync(async (query?: string, options: {signal?: AbortSignal} = {}) => {
  if (query === undefined || query === '') {
    throw new InitialStateError();
  }
  const {signal} = options;
  const response = await fetch(getSearchUrl(query), {signal});
  // const response = await fetch('./data/npm-search.json', {signal});
  if (response.status === 200) {
    return response.json();
  } else {
    throw response.text();
  }
});

const getSearchUrl = (query: string) => `https://registry.npmjs.org/-/v1/search?text=${query}`;

@customElement('search-item' as any)
export class SearchItem extends LitElement {

  @property()
  package?: any;

  render() {
    return html`
      <style>
        :host {
          display: block;
          /* border-radius: 5px; */
          /* border: solid 1px #aaa; */
          padding: 1em;
          background: #333;
        }
        header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
        h1 {
          font-weight: normal;
          font-size: 1.5em;
          margin: 0 0 .5em 0;
        }
        #logo {
          height: 38px;
          width: auto;
        }
      </style>
      <header>
        <h1>${this.package.name}</h1>
      </header>
      <div>
      <p>${this.package.description}</p>
        <div>Version: ${this.package.version}</div>
      </div>
    `;
  }
}
