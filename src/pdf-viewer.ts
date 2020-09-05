/**
 * Copyright 2019 Justin Fagnani <justin@fagnani.com>
 */
import {LitElement, html, css, property, customElement, query} from 'lit-element';
import './pdf-viewer-display.js';
import '@material/mwc-fab';
import '@material/mwc-icon-button';
import { PDFViewerDisplayElement } from './pdf-viewer-display.js';

/**
 * A web component that displays PDFs
 * 
 * @cssprop [--pdf-viewer-top-bar-height=48px]
 * @cssprop [--pdf-viewer-page-shadow=2px 2px 2px 1px rgba(0, 0, 0, 0.2)]
 * @cssprop [--pdf-viewer-background=gray]
 */
@customElement('pdf-viewer')
export class PDFViewerElement extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      position: relative;
      --mdc-theme-primary: var(--mdc-theme-primary, #37474f);
      --mdc-theme-on-primary: var(--mdc-theme-on-primary, white);
      --mdc-theme-secondary: white;
      --mdc-theme-on-secondary: black;
      --pdf-viewer-top-bar-height: 48px;
      --pdf-viewer-page-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    }
    pdf-viewer-display {
      width: 100%;
      height: 100%;
    }
    #controls {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      user-select: none;
      pointer-events: none;
    }
    #controls > * {
      user-select: initial;
      pointer-events: initial;
    }
    #top-bar {
      top: 0;
      height: var(--pdf-viewer-top-bar-height);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: var(--mdc-theme-on-primary, white);
      background: var(--mdc-theme-primary, #37474f);
      /* From https://github.com/material-components/material-components-web/blob/8d8f3fcb3f2940b071f761497490c1b0123e106b/packages/mdc-typography/_variables.scss */
      font-family: Roboto, sans-serif;
      font-size: 1rem;
      line-height: 2rem;
      font-weight: medium;
      letter-spacing: 1.25;
      /* 10px is the same as the content margin */
      padding: 0 10px;
    }
    #top-bar > * {
      flex: 1;
    }
    #page-number {
      text-align: center;
      vertical-align: middle;
    }
    #nav {
      text-align: right;
      --mdc-icon-button-size: 36px;
    }
    #title {
      text-align: center;
    }
    #zoom-out {
      position: absolute;
      bottom: 50px;
      right: 40px;
    }
    #zoom-in {
      position: absolute;
      bottom: 100px;
      right: 40px;
    }
  `;

  @query('pdf-viewer-display')
  private _display?: PDFViewerDisplayElement;

  @property({type: String, reflect: true})
  src?: string;

  /**
   * The current 1-based page number.
   */
  @property({type: Number, reflect: true})
  page: number = 1;

  /**
   * Whether multiple pages should render. Single page rendering is much faster.
   */
  @property({
    attribute: 'multi-page',
    type: Boolean,
    reflect: true,
  })
  multiPage = false;

  @property({
    reflect: true,
  })
  scale: number | 'cover' | 'contain' = 'cover';

  @property({type: Number, reflect: true})
  zoom: number = 1;

  /**
   * Total page count of the current document.
   */
  get pageCount() {
    return this._display?.pageCount ?? 0;
  }

  get documentTitle() {
    return this._display?.documentTitle ?? '';
  }

  render() {
    return html`
      <div id="top-bar">
        <span id="">
          <!-- <mwc-icon-button id="drawer"
            icon="menu" 
            mini>
          </mwc-icon-button> -->
        </span>
        <span id="title">${this.documentTitle}</span>
        <span id="nav">
          <mwc-icon-button id="prev"
            icon="navigate_before" 
            mini
            @click=${this.previousPage}>
          </mwc-icon-button>
          <span id="page-number">${this.page} / ${this.pageCount}</span>
          <mwc-icon-button id="next"
              icon="navigate_next" 
              mini
              @click=${this.nextPage}>
          </mwc-icon-button>
        </span>
      </div>
      <pdf-viewer-display
        .src=${this.src}
        .page=${this.page}
        .multiPage=${this.multiPage}
        .scale=${this.scale}
        .zoom=${this.zoom}
        .documentTitle=${this.documentTitle}
        @load=${this._onLoad}
      ></pdf-viewer-display>
      <div id="controls">
        <mwc-fab id="zoom-out"
            icon="remove"
            mini
            @click=${this.zoomOut}>
        </mwc-fab>
        <mwc-fab id="zoom-in"
            icon="add"
            mini
            @click=${this.zoomIn}>
        </mwc-fab>
      </div>`;
  }

  _onLoad() {
    console.log('_onLoad');
    this.requestUpdate();
  }

  zoomOut() {
    this.zoom = Math.max(this.zoom - .25, .25);
  }

  zoomIn() {
    // TODO: what's the max zoom?
    this.zoom += .25;
  }

  nextPage() {
    if (this.page < this.pageCount) {
      this.page++;
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

}
