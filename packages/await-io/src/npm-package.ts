import { LitElement, property, html, customElement } from '@polymer/lazy-lit-element';
import { runAsync, InitialStateError } from './run-async.js';

@customElement('npm-package' as any)
export class NpmPackage extends LitElement {

  @property()
  name?: string;

  render() {
    return html`
      <style>
        :host {
          display: block;
          width: 640px;
          border-radius: 5px;
          border: solid 1px #aaa;
          padding: 20px;
        }
        header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
        #logo {
          height: 38px;
          width: auto;
        }
      </style>
      <header>
        <h1>${this.name}</h1>
        <a>${npmLogo}</a>
      </header>
      <div>
        ${fetchNpmPackage(this.name,
          {
            success: (pkg) => html`
              <h3>${pkg.description}</h3>
              <h4>dist-tags:</h4>
              <ul>
                ${Array.from(Object.entries(pkg['dist-tags'])).map(
                  ([tag, version]) => html`<li><pre>${tag}: ${version}</pre></li>`)}
              </ul>
            `,
            pending: () => 'Loading...',
            initial: () => 'Enter a Package Name',
            failure: (e) => `Error ${e.message}`
          })
        }
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

const npmLogo = html`
  <svg id="logo" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="540px" height="210px" viewBox="0 0 18 7">
    <path fill="#CB3837" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/>
    <polygon fill="#fff" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 "/>
    <path fill="#fff" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z"/>
    <polygon fill="#fff" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 "/>
  </svg>
`;
