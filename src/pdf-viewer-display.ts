/**
 * Copyright 2019 Justin Fagnani <justin@fagnani.com>
 */
import {LitElement, html, css, property, customElement, PropertyValues, query} from 'lit-element';
import pdfjs from '@bundled-es-modules/pdfjs-dist';
import viewer from "@bundled-es-modules/pdfjs-dist/web/pdf_viewer";
import {styles} from './lib/styles.js';

pdfjs.GlobalWorkerOptions.workerSrc =
    '/node_modules/@bundled-es-modules/pdfjs-dist/build/pdf.worker.min.js';

const ptToPx: number = 96.0 / 72.0;

/**
 * A web component that displays PDFs
 * 
 * @cssprop [--pdf-viewer-top-bar-height=48px]
 * @cssprop [--pdf-viewer-page-shadow=2px 2px 2px 1px rgba(0, 0, 0, 0.2)]
 * @cssprop [--pdf-viewer-background=gray]
 */
@customElement('pdf-viewer-display')
export class PDFViewerDisplayElement extends LitElement {
  static styles = [styles, css`
    :host {
      display: block;
      position: relative;
      height: 480px;
      --pdf-viewer-background: gray;
      --pdf-viewer-page-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
      background: --pdf-viewer-background;
    }
    #container {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: auto;
    }
    /*
      Styling .canvasWrapper because .page has a padding and the drop-shadow
      is offset from the page.
    */
    .canvasWrapper {
      box-shadow: var(--pdf-viewer-page-shadow);
    }
  `];

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
  scale: number | 'cover' | 'contain' = 'cover';

  private _currentScale?: number;

  @property({type: Number, reflect: true})
  zoom = 1;

  @property({attribute: 'document-title'})
  documentTitle?: string;

  // TODO: This is the border on div.page make by pdf.js. Where does it come
  // from, and can we read or set it?
  private _pageBorderWidth = 9;

  // TODO: This is the macOS border size, used to reserve space for scrollbars
  // and prevent an overflow on one axis from unneccessarily causing an overflow
  // on the other axis. There's got to be a better way.
  private _scrollBarSize = 16;

  @query('#viewer')
  private _viewerElement!: HTMLDivElement;

  private _pdfViewer?: typeof viewer.PDFViewer;

  private _pdfDocument?: any;

  private _resizeObserver: ResizeObserver = new ResizeObserver(() => this._onResize());

  constructor() {
    super();
    this._resizeObserver.observe(this);
  }

  render() {
    return html`<div id="container"></div>`;
  }

  async updated(changedProperties: PropertyValues) {
    if (changedProperties.has('multiPage')) {
      const container = this.shadowRoot!.querySelector('#container') as HTMLElement;
      // When multiPage changes we must make a new viewer element.
      container.innerHTML = '<div id="viewer" class="pdfViewer"></div>';
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
        if (this.scale === 'cover' || this.scale === 'contain') {
          const page = await this._pdfDocument.getPage(this._pdfViewer.currentPageNumber);
          const viewport = page.getViewport({
            scale: 1,
            rotation: 0,
          });
          const availableWidth = (this.offsetWidth - this._pageBorderWidth * 2 - this._scrollBarSize);
          const availableHeight = (this.offsetHeight - this._pageBorderWidth * 2 - this._scrollBarSize);
          const viewportWidthPx = viewport.width * ptToPx;
          const viewportHeightPx = viewport.height * ptToPx;
          const fitWidthScale = availableWidth / viewportWidthPx;
          const fitHeightScale = availableHeight / viewportHeightPx;
          if (this.scale === 'cover') {
            this._currentScale =  Math.max(fitWidthScale, fitHeightScale);
          } else {
            this._currentScale =  Math.min(fitWidthScale, fitHeightScale);
          }
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
      const metadata = await pdfDocument.getMetadata();
      console.log({metadata});
      this.documentTitle = metadata.info.Title;
      await this.requestUpdate();
      this.dispatchEvent(new Event('load'));
    } catch (e) {
      this.dispatchEvent(new ErrorEvent('error', {
        error: e,
      }));
    }
  }

  _onResize() {
    console.log('_onResize');
    this.requestUpdate();
  }

}
