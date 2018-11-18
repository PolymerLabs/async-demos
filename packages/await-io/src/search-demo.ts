import { LitElement, property, html, customElement, repeat, LazyLitElement } from '@polymer/lazy-lit-element';
import './npm-package.js';
import './spinner.js';
import './raf-radar.js';
import { runAsync, InitialStateError } from './run-async.js';
import {PendingContainer} from './pending-container.js';

@customElement('search-demo' as any)
export class SearchDemo extends PendingContainer(LitElement) {

  @property()
  query?: string;

  render() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
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
        #spinner-container {
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
        p {
          flex: auto;
          text-align: center;
        }
      </style>
      <header>
        <h1>NPM Search Demo</h1>
        <div id="spinner-container">
          <md-spinner .active=${this.__hasPendingChildren}></md-spinner>
        </div>
        <!-- <div id="spinner-container">
          <raf-radar></raf-radar>
        </div> -->
        <div id="input-container">
          <input
            .value=${this.query === undefined ? '' : this.query}
            placeholder="Search"
            @input=${this._onInput}>
        </div>
      </header>
      ${searchPackages(this.query, {
        success: (data) => html`
        <div id="results">
          ${repeat(data.objects.slice(10),
              (i: any) => i.package.name,
              (i: any) => html`<search-item .package=${i.package}></search-item>`)}
        </div>`,
        // pending: () => html`<md-spinner active></md-spinner>`,
        pending: () => html`<p>Loading...</p>`,
        initial: () => html`<p>Enter a Search Term</p>`,
        failure: (e) => html`<p>${e.message}</p>`,
      })}
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
  if (query.match(/^(\.|_)/)) {
    throw new Error(`Bad package name: ${query}`);
  }
  const {signal} = options;
  await new Promise(res => setTimeout(res, 1000));
  const response = await fetch(getSearchUrl(query), {signal});
  if (response.status === 200) {
    return response.json();
  } else {
    throw response.text();
  }
});

const getSearchUrl = (query: string) => `https://registry.npmjs.org/-/v1/search?text=${query}`;

@customElement('search-item' as any)
export class SearchItem extends LazyLitElement {

  @property({
    hasChanged(value: any, oldValue: any) {
      return value !== oldValue;
    }
  })
  package?: any;

  render() {
    // const start = performance.now();
    // while (performance.now() - start < 100) {
    //   // spin!
    // }
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
          ${fetchNpmPackage(this.package.name,
            {
              success: (pkg) => html`
                <h4>dist-tags:</h4>
                <ul>
                  ${Array.from(Object.entries(pkg['dist-tags'])).map(
                    ([tag, version]) => html`<li><pre>${tag}: ${version}</pre></li>`
                    )}
                </ul>
              `,
              // pending: () => html`<md-spinner active></md-spinner>`
            })}
      </div>
    `;
  }
}

const fetchNpmPackage = runAsync(async (name?: string) => {
  if (name === undefined || name === '') {
    throw new InitialStateError();
  }
  const response = await fetch(getPackageUrl(name));
  if (response.status === 200) {
    return response.json();
  } else {
    throw response.text();
  }
});

const getPackageUrl = (name: string) => `https://cors-anywhere.herokuapp.com/registry.npmjs.org/${name}`;
