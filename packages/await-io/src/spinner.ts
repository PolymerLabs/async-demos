import { LitElement, property, html, customElement, PropertyValues } from '@polymer/lazy-lit-element';

@customElement('md-spinner' as any)
export class MaterialSpinner extends LitElement {

  @property({
    type: Boolean,
    reflect: true,
  })
  active: boolean = false;

  @property({type: Boolean})
  __coolingDown: boolean = false;

  update(changedProperties: PropertyValues) {
    this.__coolingDown = this.active === false && changedProperties.get('active') === true;
    super.update(changedProperties);
  }

  render() {
    return html`
      <style>
        /*
        /**************************/
        /* STYLES FOR THE SPINNER */
        /**************************/
        /*
        * Constants:
        *      ARCSIZE     = 270 degrees (amount of circle the arc takes up)
        *      ARCTIME     = 1333ms (time it takes to expand and contract arc)
        *      ARCSTARTROT = 216 degrees (how much the start location of the arc
        *                                should rotate each time, 216 gives us a
        *                                5 pointed star shape (it's 360/5 * 3).
        *                                For a 7 pointed star, we might do
        *                                360/7 * 3 = 154.286)
        *      SHRINK_TIME = 400ms
        */
        :host {
          display: inline-block;
          position: relative;
          width: 28px;
          height: 28px;
          /* 360 * ARCTIME / (ARCSTARTROT + (360-ARCSIZE)) */
          --paper-spinner-container-rotation-duration: 1568ms;
          /* ARCTIME */
          --paper-spinner-expand-contract-duration: 1333ms;
          /* 4 * ARCTIME */
          --paper-spinner-full-cycle-duration: 5332ms;
          /* SHRINK_TIME */
          --paper-spinner-cooldown-duration: 400ms;
          --google-red-500: #db4437;
          --google-blue-500: #4285f4;
          --google-yellow-500: #f4b400;
          --google-green-500: #0f9d58;
        }
        #spinnerContainer {
          width: 100%;
          height: 100%;
          /* The spinner does not have any contents that would have to be
          * flipped if the direction changes. Always use ltr so that the
          * style works out correctly in both cases. */
          direction: ltr;
        }
        #spinnerContainer.active {
          animation: container-rotate var(--paper-spinner-container-rotation-duration) linear infinite;
        }
        @keyframes container-rotate {
          to { transform: rotate(360deg) }
        }
        .spinner-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          white-space: nowrap;
          color: var(--paper-spinner-color, var(--google-blue-500));
        }
        .layer-1 {
          color: var(--paper-spinner-layer-1-color, var(--google-blue-500));
        }
        .layer-2 {
          color: var(--paper-spinner-layer-2-color, var(--google-red-500));
        }
        .layer-3 {
          color: var(--paper-spinner-layer-3-color, var(--google-yellow-500));
        }
        .layer-4 {
          color: var(--paper-spinner-layer-4-color, var(--google-green-500));
        }
        /**
        * IMPORTANT NOTE ABOUT CSS ANIMATION PROPERTIES (keanulee):
        *
        * iOS Safari (tested on iOS 8.1) does not handle animation-delay very well - it doesn't
        * guarantee that the animation will start _exactly_ after that value. So we avoid using
        * animation-delay and instead set custom keyframes for each color (as layer-2undant as it
        * seems).
        */
        .active .spinner-layer {
          animation-name: fill-unfill-rotate;
          animation-duration: var(--paper-spinner-full-cycle-duration);
          animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
          animation-iteration-count: infinite;
          opacity: 1;
        }
        .active .spinner-layer.layer-1 {
          animation-name: fill-unfill-rotate, layer-1-fade-in-out;
        }
        .active .spinner-layer.layer-2 {
          animation-name: fill-unfill-rotate, layer-2-fade-in-out;
        }
        .active .spinner-layer.layer-3 {
          animation-name: fill-unfill-rotate, layer-3-fade-in-out;
        }
        .active .spinner-layer.layer-4 {
          animation-name: fill-unfill-rotate, layer-4-fade-in-out;
        }
        @keyframes fill-unfill-rotate {
          12.5% { transform: rotate(135deg) } /* 0.5 * ARCSIZE */
          25%   { transform: rotate(270deg) } /* 1   * ARCSIZE */
          37.5% { transform: rotate(405deg) } /* 1.5 * ARCSIZE */
          50%   { transform: rotate(540deg) } /* 2   * ARCSIZE */
          62.5% { transform: rotate(675deg) } /* 2.5 * ARCSIZE */
          75%   { transform: rotate(810deg) } /* 3   * ARCSIZE */
          87.5% { transform: rotate(945deg) } /* 3.5 * ARCSIZE */
          to    { transform: rotate(1080deg) } /* 4   * ARCSIZE */
        }
        @keyframes layer-1-fade-in-out {
          0% { opacity: 1 }
          25% { opacity: 1 }
          26% { opacity: 0 }
          89% { opacity: 0 }
          90% { opacity: 1 }
          to { opacity: 1 }
        }
        @keyframes layer-2-fade-in-out {
          0% { opacity: 0 }
          15% { opacity: 0 }
          25% { opacity: 1 }
          50% { opacity: 1 }
          51% { opacity: 0 }
          to { opacity: 0 }
        }
        @keyframes layer-3-fade-in-out {
          0% { opacity: 0 }
          40% { opacity: 0 }
          50% { opacity: 1 }
          75% { opacity: 1 }
          76% { opacity: 0 }
          to { opacity: 0 }
        }
        @keyframes layer-4-fade-in-out {
          0% { opacity: 0 }
          65% { opacity: 0 }
          75% { opacity: 1 }
          90% { opacity: 1 }
          to { opacity: 0 }
        }
        .circle-clipper {
          display: inline-block;
          position: relative;
          width: 50%;
          height: 100%;
          overflow: hidden;
        }
        /**
        * Patch the gap that appear between the two adjacent div.circle-clipper while the
        * spinner is rotating (appears on Chrome 50, Safari 9.1.1, and Edge).
        */
        .spinner-layer::after {
          left: 45%;
          width: 10%;
          border-top-style: solid;
        }
        .spinner-layer::after,
        .circle-clipper::after {
          content: '';
          box-sizing: border-box;
          position: absolute;
          top: 0;
          border-width: var(--paper-spinner-stroke-width, 3px);
          border-radius: 50%;
        }
        .circle-clipper::after {
          bottom: 0;
          width: 200%;
          border-style: solid;
          border-bottom-color: transparent !important;
        }
        .circle-clipper.left::after {
          left: 0;
          border-right-color: transparent !important;
          transform: rotate(129deg);
        }
        .circle-clipper.right::after {
          left: -100%;
          border-left-color: transparent !important;
          transform: rotate(-129deg);
        }
        .active .gap-patch::after,
        .active .circle-clipper::after {
          animation-duration: var(--paper-spinner-expand-contract-duration);
          animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
          animation-iteration-count: infinite;
        }
        .active .circle-clipper.left::after {
          animation-name: left-spin;
        }
        .active .circle-clipper.right::after {
          animation-name: right-spin;
        }
        @keyframes left-spin {
          0% { transform: rotate(130deg) }
          50% { transform: rotate(-5deg) }
          to { transform: rotate(130deg) }
        }
        @keyframes right-spin {
          0% { transform: rotate(-130deg) }
          50% { transform: rotate(5deg) }
          to { transform: rotate(-130deg) }
        }
        #spinnerContainer.cooldown {
          animation: container-rotate var(--paper-spinner-container-rotation-duration) linear infinite, fade-out var(--paper-spinner-cooldown-duration) cubic-bezier(0.4, 0.0, 0.2, 1);
        }
        @keyframes fade-out {
          0% { opacity: 1 }
          to { opacity: 0 }
        }
      </style>
      <div id="spinnerContainer" class=${this.__computeContainerClasses()} @animationend=${this.__reset}><!--
      --><div class="spinner-layer"><!--
          --><div class="circle-clipper left"></div><!--
          --><div class="circle-clipper right"></div><!--
        --></div><!--
      --></div>
    `;
  }

  __reset() {
    this.active = false;
    this.__coolingDown = false;
  }

  __computeContainerClasses() {
    return [
      this.active || this.__coolingDown ? 'active' : '',
      this.__coolingDown ? 'cooldown' : ''
    ].join(' ');
  }
}
