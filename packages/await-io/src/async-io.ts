import { LitElement, property, html, customElement, until } from '@polymer/lazy-lit-element';

@customElement('async-io-demo' as any)
export class AsyncIoDemo extends LitElement {

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
        ${until(fetchPackage(this.name).then((pkg) => {
          if (pkg === undefined) {
            return html``;
          }
          return html`
            <h2>${pkg.description}</h2>
            <ul>
              ${Array.from(Object.entries(pkg['dist-tags'])).map(
                ([tag, version]) => html`<li>${tag}: ${version}</li>`)}
            </ul>
          `;
        }), 'Loading...')}
      </div>
    `;
  }
}

const fetchPackage = async (name?: string): Promise<any> => {
  if (name === undefined) {
    return undefined;
  }
  const response = await fetch(`https://cors-anywhere.herokuapp.com/registry.npmjs.org/${name}`);
  if (response.status === 200) {
    return await response.json();
  } else {
    throw response.text();
  }
}

const npmLogo = html`
  <svg id="logo" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="540px" height="210px" viewBox="0 0 18 7">
    <path fill="#CB3837" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/>
    <polygon fill="#fff" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 "/>
    <path fill="#fff" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z"/>
    <polygon fill="#fff" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 "/>
  </svg>
`;
