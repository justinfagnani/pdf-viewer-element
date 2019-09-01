import {LitElement, html, customElement, property, css} from 'lit-element';
import {TextField} from '@material/mwc-textfield';
import '@material/mwc-textfield';
import '@material/mwc-top-app-bar-fixed';
import '../pdf-viewer.js';

import '@material/mwc-switch';
import {Switch} from '@material/mwc-switch';

@customElement('pdf-viewer-demo')
export class PDFViewerDemo extends LitElement {
  @property() src: string = './f1040.pdf';
  @property({attribute: 'multi-page', type: Boolean}) multiPage = false;
  @property({type: Number}) page = 1;

  static styles = css`
    #controls {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      padding: 16px;
    }
  `;

  render() {
    console.log('demo render', this.multiPage);
    return html`
      <mwc-top-app-bar-fixed>
        <div slot="title">&lt;pdf-viewer> Demo</div>
        <div>
          <div id="controls">
            <mwc-textfield
              outlined
              label="src"
              helper="URL to display"
              .value=${this.src}
              @change=${this._srcChanged}
            ></mwc-textfield>

            <mwc-switch
              .checked=${this.multiPage}
              @change=${this._multiPageChanged}
            >multi-page</mwc-switch>

            <mwc-textfield
              outlined
              label="page"
              helper="1-based page number"
              .value=${String(this.page)}
              @change=${this._pageChanged}
            ></mwc-textfield>
          </div>
          <pdf-viewer
              src="./f1040.pdf"
              .page=${this.page}
              .multiPage=${this.multiPage}
          ></pdf-viewer>
        </div>
      </mwc-top-app-bar-fixed>
    `;
  }

  _srcChanged(e: Event) {
    this.src = (e.target as TextField).value;
  }

  _pageChanged(e: Event) {
    this.page = Number((e.target as TextField).value);
  }

  _multiPageChanged(e: Event) {
    this.multiPage = (e.target as Switch).checked;
  }

}
