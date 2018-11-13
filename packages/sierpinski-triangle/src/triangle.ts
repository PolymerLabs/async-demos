import { LazyLitElement, property, html, customElement } from '@polymer/lazy-lit-element';
import './dot.js';

const targetSize = 25;

@customElement('s-triangle' as any)
export class SierpinskiTriangle extends LazyLitElement {
  @property()
  x!: number;

  @property()
  y!: number;

  @property()
  s!: number;

  @property()
  label?: number;

  defer = true;

  render() {
    let {s, x, y, label} = this;
    if (s <= targetSize) {
      return html`
        <s-dot
            x="${x - (targetSize / 2)}"
            y="${y - (targetSize / 2)}"
            size="${targetSize}">
          ${label}
        </s-dot>
      `;
    }

    const slowDown = true;
    if (slowDown) {
      const e = performance.now() + 1.8;
      while (performance.now() < e) {
        // Artificially long execution time.
      }
    }

    s /= 2;

    return html`
      <s-triangle .x="${x}" .y="${y - (s / 2)}" .s="${s}" .label="${label}"></s-triangle>
      <s-triangle .x="${x - s}" .y="${y + (s / 2)}" .s="${s}" .label="${label}"></s-triangle>
      <s-triangle .x="${x + s}" .y="${y + (s / 2)}" .s="${s}" .label="${label}"></s-triangle>
    `;
  }
}
