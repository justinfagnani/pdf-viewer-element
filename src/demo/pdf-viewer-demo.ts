import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {TextField} from '@material/mwc-textfield';
import '@material/mwc-textfield';
import {TopAppBarFixed} from '@material/mwc-top-app-bar-fixed';
import '../components/pdf-viewer.js';

import '@material/mwc-switch';
import type {Switch} from '@material/mwc-switch';
import '@material/mwc-formfield';

@customElement('pdf-viewer-app-bar')
export class TopAppBar extends TopAppBarFixed {
  static styles = [TopAppBarFixed.styles, css`
    .mdc-top-app-bar--fixed-adjust {
      height: 100%;
      box-sizing: border-box;
    }
  `] as any;
}

@customElement('pdf-viewer-demo')
export class PDFViewerDemo extends LitElement {
  @property() src: string = './f1040.pdf';
  @property({attribute: 'multi-page', type: Boolean}) multiPage = false;
  @property({type: Number}) page = 1;
  @property({type: Boolean}) hideToolbar = false;

  static styles = css`
    pdf-viewer-app-bar {
      height: 100vh;
      background: #efefef;
    }
    #content {
      display: flex;
      flex-direction: row;
      height: 100%;
    }
    #controls {
      background: white;
      display: flex;
      gap: 8px;
      flex-direction: column;
      align-items: baseline;
      padding: 16px;
    }
    #demo-container {
      flex: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    pdf-viewer {
      width: 800px;
      height: 800px;
    }
  `;

  render() {
    console.log('demo render', this.multiPage);
    return html`
      <pdf-viewer-app-bar>
        <div slot="title">&lt;pdf-viewer> Demo</div>
        <div id="content">
          <div id="controls">
            <mwc-textfield
              outlined
              label="src"
              helper="URL to display"
              .value=${this.src}
              @change=${this._srcChanged}
            ></mwc-textfield>
            <mwc-formfield label="Multipage">
              <mwc-switch
                .selected=${this.multiPage}
                @click=${this._multiPageChanged}
              ></mwc-switch>
            </mwc-formfield>
            <mwc-textfield
              outlined
              label="page"
              helper="1-based page number"
              .value=${String(this.page)}
              @change=${this._pageChanged}
            ></mwc-textfield>
            <mwc-formfield label="Hide Toolbar">
              <mwc-switch
                .selected=${this.hideToolbar}
                @click=${this._hideToolbarChanged}
              ></mwc-switch>
            </mwc-formfield>
          </div>
          <div id="demo-container">
            <pdf-viewer
                .hideToolbar=${this.hideToolbar}
                src="./f1040.pdf"
                .page=${this.page}
                .multiPage=${this.multiPage}
            ></pdf-viewer>
          </div>
        </div>
      </pdf-viewer-app-bar>
    `;
  }

  _srcChanged(e: Event) {
    this.src = (e.target as TextField).value;
  }

  _pageChanged(e: Event) {
    this.page = Number((e.target as TextField).value);
  }

  _multiPageChanged(e: Event) {
    this.multiPage = (e.target as Switch).selected;
  }

  _hideToolbarChanged(e: Event) {
    console.log('_hideToolbarChanged', (e.target as Switch).selected);
    this.hideToolbar = (e.target as Switch).selected;
  }
}
