
import { LitElement, property, html, customElement, PropertyValues } from '@polymer/lazy-lit-element';

@customElement('raf-radar' as any)
export class RAFRadar extends LitElement {

  private _rafSlice?: HTMLElement;
  private _animationStartTime!: number;

  _onRAF = (time: number) => {
    if (this._rafSlice !== undefined) {
      this._rafSlice.style.cssText = `transform: rotate(${(time - this._animationStartTime) * 360/2000}deg)`;
    }
    requestAnimationFrame(this._onRAF);
  };

  _onAnimationStart(_e: AnimationEvent) {
    this._animationStartTime = performance.now();
    requestAnimationFrame(this._onRAF);
  }

  firstUpdated() {
    this._rafSlice = this.shadowRoot!.querySelector('#raf-slice') as HTMLElement;
  }

  render() {
    return html`
      <style>
        :host {
          display: inline-block;
          position: relative;
          width: 28px;
          height: 28px;
        }
        .slice {
          position: absolute;
          width: 100%;
          height: 100%;
          direction: ltr;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-size: 50% 50%;
        }
        #css-slice {
          animation: container-rotate 2000ms linear infinite;
          background: linear-gradient(36deg, #fa4 42.34%, transparent 42.34%) 0 0;
          background-repeat: no-repeat;
          background-size: 50% 50%;
        }
        #raf-slice {
          background: linear-gradient(36deg, #f04 42.34%, transparent 42.34%) 0 0;
          background-repeat: no-repeat;
          background-size: 50% 50%;
        }
        @keyframes container-rotate {
          to { transform: rotate(360deg) }
        }
      </style>
      <div id="raf-slice" class="slice"></div>
      <div id="css-slice" class="slice" @animationstart=${this._onAnimationStart}></div>
    `;
  }
}
