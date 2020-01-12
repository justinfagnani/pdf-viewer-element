/**
 * Copyright 2019 Justin Fagnani <justin@fagnani.com>
 */
import {LitElement, html, css, property, customElement, PropertyValues} from 'lit-element';
import pdfjs from '@bundled-es-modules/pdfjs-dist';
import viewer from "@bundled-es-modules/pdfjs-dist/web/pdf_viewer";
import {styles} from './lib/styles.js';
import '@material/mwc-fab';
import '@material/mwc-icon-button';

pdfjs.GlobalWorkerOptions.workerSrc =
    '/node_modules/@bundled-es-modules/pdfjs-dist/build/pdf.worker.min.js';

const ptToPx: number = 96.0 / 72.0;

/**
 * Display PDFs
 * 
 * ## Styling
 * ### CSS CUstom Variables
 * - `--pdf-viewer-page-shadow`
 * - `--pdf-viewer-background`
 */
@customElement('pdf-viewer')
export class PdfViewerElement extends LitElement {
  static styles = [css`
    :host {
      display: block;
      position: relative;
      background: var(--pdf-viewer-background, gray);
      /* --mdc-theme-secondary: var(--mdc-theme-secondary, white); */
      /* --mdc-theme-on-secondary: var(--mdc-theme-on-secondary, black); */
      --mdc-theme-secondary: white;
      --mdc-theme-on-secondary: black;
      --pdf-viewer-top-bar-height: 48px;
    }
    #container {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: scroll;
      padding-top: var(--pdf-viewer-top-bar-height);
    }
    /* :host(:hover) #controls {
      display: block !important;
    }*/
    #controls {
      /* display: none; */
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
      /* position: sticky; */
      top: 0;
      height: var(--pdf-viewer-top-bar-height);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: white;
      background: rgba(0, 0, 0, .5);
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
    }
    #nav {
      text-align: right;
      --mdc-icon-button-size: 36px;
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
    /*
      Styling .canvasWrapper because .page has a padding and the drop-shadow
      is offset from the page.
    */
    .canvasWrapper {
      box-shadow: var(--pdf-viewer-page-shadow, 2px 2px 2px 1px rgba(0, 0, 0, 0.2));
    }
  `, styles];

  @property({type: String, reflect: true})
  src?: string;

  /**
   * The current 1-based page number.
   */
  @property({type: Number, reflect: true})
  page: number = 1;

  /**
   * Total page count of the current document.
   */
  get pageCount() {
    return this._pdfViewer?.pagesCount;
  }

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
  scale: number | 'fit' = 'fit';

  private _currentScale?: number;

  @property({type: Number, reflect: true})
  zoom = 1;

  @property()
  documentTitle?: string;

  // TODO: This is the border on div.page make by pdf.js. Where does it come
  // from, and can we read or set it?
  private _pageBorderWidth = 9;

  private _viewerElement?: HTMLDivElement;

  private _pdfViewer?: typeof viewer.PDFViewer;

  private _pdfDocument?: any;

  // TODO:
  // private _resizeObserver: ResizeObserver = new ResizeObserver(() => this._onResize());

  constructor() {
    super();
    // this._resizeObserver.observe(this);
  }

  update(changedProperties: PropertyValues) {
    if (changedProperties.has('multiPage')) {
      // When multiPage changes we must make a new viewer element. We create the
      // viewer element in update() and before super.update() so that it renders
      // in this update cycle and is attached by the time updated() is called.
      this._viewerElement = document.createElement('div');
      this._viewerElement.id = 'viewer';
      this._viewerElement.className = 'pdfViewer';
    }
    super.update(changedProperties);
  }

  render() {
    return html`
      <div id="container">${this._viewerElement}</div>
      <div id="controls">
        <div id="top-bar">
          <span id="title">${this.documentTitle}</span>
          <span id="page-number">${this.page} / ${this.pageCount}</span>
          <span id="nav">
            <mwc-icon-button id="prev"
                icon="navigate_before" 
                mini
                @click=${this.previousPage}>
            </mwc-icon-button>
            <mwc-icon-button id="next"
                icon="navigate_next" 
                mini
                @click=${this.nextPage}>
            </mwc-icon-button>
          </span>
        </div>
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

  async updated(changedProperties: PropertyValues) {
    if (changedProperties.has('multiPage')) {
      const container = this.shadowRoot!.querySelector('#container') as HTMLElement;
      if (this.multiPage) {
        this._pdfViewer = new viewer.PDFViewer({
          container,
          viewer: this._viewerElement,
          // linkService: pdfLinkService,
          // findController: pdfFindController,        
        });
      } else {
        this._pdfViewer = new viewer.PDFSinglePageViewer({
          container,
          viewer: this._viewerElement,
          // linkService: pdfLinkService,
          // findController: pdfFindController,        
        });
      }
      if (this._pdfDocument) {
        this._pdfViewer.setDocument(this._pdfDocument);
      }
      this.requestUpdate();
    }

    if (changedProperties.has('src')) {
      this._load();
    }

    if (changedProperties.has('page')) {
      this._pdfViewer.scrollPageIntoView({
        pageNumber: this.page,
      });
    }

    if (this._pdfDocument !== undefined) {
      if (this._currentScale === undefined || changedProperties.has('scale')) {
        if (this.scale === 'fit') {
          const page = await this._pdfDocument.getPage(this._pdfViewer.currentPageNumber);
          const viewport = page.getViewport({
            scale: 1,
            rotation: 0,
          });
          const availableWidth = (this.offsetWidth - this._pageBorderWidth * 2);
          const viewportWidthPx = viewport.width * ptToPx;
          this._currentScale =  availableWidth / viewportWidthPx;
        } else {
          this._currentScale = this.scale;
        }
      }
      this._pdfViewer.currentScale = this._currentScale * this.zoom;
    }
  }

  private async _load() {
    try {
      const loadingTask = pdfjs.getDocument({
        url: this.src,
        // cMapUrl: CMAP_URL,
        // cMapPacked: CMAP_PACKED,
      });
      const pdfDocument = await loadingTask.promise;
      if (this._pdfDocument) {
        this._pdfDocument.destroy();
      }
      this._pdfDocument = pdfDocument;
      // Document loaded, specifying document for the viewer and
      // the (optional) linkService.
      this._pdfViewer.setDocument(pdfDocument);
      // pdfLinkService.setDocument(pdfDocument, null);
      this.dispatchEvent(new Event('load'));
      pdfDocument.getMetadata().then((metadata: any) => {
        // console.log({metadata});
        this.documentTitle = metadata.info.Title;
      });
      this.requestUpdate();
    } catch (e) {
      this.dispatchEvent(new ErrorEvent('error', {
        error: e,
      }));
    }
  }

  zoomOut() {
    this.zoom = Math.max(this.zoom - .25, .25);
  }

  zoomIn() {
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
