/**
 * Copyright 2019 Justin Fagnani <justin@fagnani.com>
 */
import {LitElement, html, css, PropertyValues} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import '@material/mwc-icon-button';
import {contextProvided} from '@lit-labs/context';
import type {PDFViewerElement} from './pdf-viewer.js';
import {viewerContext} from './viewer-context.js';

@customElement('pdf-viewer-toolbar')
export class PDFViewerToolbarElement extends LitElement {
  static styles = css`
    :host {
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
    :host > * {
      flex: 1;
    }
    #title {
      text-align: center;
    }
    #page-number {
      text-align: center;
      vertical-align: middle;
    }
    #nav {
      text-align: right;
      --mdc-icon-button-size: 36px;
    }
  `;

  @contextProvided({context: viewerContext})
  @state()
  _viewer: PDFViewerElement | undefined;

  // _viewerContext = new ContextConsumer(this, viewerContext, (viewer) => {

  // });

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('_viewer')) {
      const oldViewer = changedProperties.get('_viewer');
      if (oldViewer !== undefined) {
        oldViewer.removeEventListener('change', this._onViewerChange);
      }
      if (this._viewer !== undefined) {
        this._viewer.addEventListener('change', this._onViewerChange);
      }
    }
  }

  private _onViewerChange = () => {
    this.requestUpdate();
  };

  render() {
    return html`
      <span id="">
        <!-- <mwc-icon-button id="drawer"
            icon="menu" 
            mini>
          </mwc-icon-button> -->
      </span>
      <span id="title">${this._viewer?.documentTitle}</span>
      <span id="nav">
        <mwc-icon-button
          id="prev"
          icon="navigate_before"
          mini
          @click=${this._previousPage}
        >
        </mwc-icon-button>
        <span id="page-number"
          >${this._viewer?.page} / ${this._viewer?.pageCount}</span
        >
        <mwc-icon-button
          id="next"
          icon="navigate_next"
          mini
          @click=${this._nextPage}
        >
        </mwc-icon-button>
      </span>
    `;
  }

  private _previousPage() {
    this._viewer?.previousPage();
  }

  private _nextPage() {
    this._viewer?.nextPage();
  }
}
