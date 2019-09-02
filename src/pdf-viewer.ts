import {LitElement, html, css, property, customElement, PropertyValues} from 'lit-element';
import pdfjs from '@bundled-es-modules/pdfjs-dist';
import viewer from "@bundled-es-modules/pdfjs-dist/web/pdf_viewer";
import {styles} from './styles.js';

pdfjs.GlobalWorkerOptions.workerSrc =
    '/node_modules/@bundled-es-modules/pdfjs-dist/build/pdf.worker.min.js';

/**
 * Display PDFs
 * 
 * ## Styling
 * ### CSS CUstom Variables
 * - `--pdf-viewer-page-shadow`
 * - `--pdf-viewer-background`
 */
@customElement('pdf-viewer')
export class PdfViewer extends LitElement {
  static styles = [css`
    :host {
      display: block;
      overflow: scroll;
      background: var(--pdf-viewer-background, gray);
    }
    #controls {
      display: none;
      /* display: flex; */
      flex-direction: row;
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
   * 1-based page number.
   */
  @property({type: Number, reflect: true})
  page: number = 1;

  /**
   * True iff multiple pages should render. Single page rendering is much
   * faster.
   */
  @property({
    attribute: 'multi-page',
    type: Boolean,
    reflect: true,
  })
  multiPage = false;

  private _viewerElement?: HTMLDivElement;

  private _pdfViewer?: viewer.PDFViewer;

  private _pdfDocument?: any;

  // TODO:
  // private _resizeObserver: ResizeObserver;

  update(changedProperties: PropertyValues) {
    // Right now multiPage is the only property that requires a new viewer
    // when it changes.
    if (changedProperties.has('multiPage')) {
      // Create the viewer element in update() so that it
      // renders in this update and is attached by the time update()
      // is called.
      this._viewerElement = document.createElement('div');
      this._viewerElement.id = 'viewer';
      this._viewerElement.className = 'pdfViewer';
    }
    super.update(changedProperties);
  }

  render() {
    return html`
      <div id="container">
      ${this._viewerElement}
      </div>
      <div id="controls">
        <!-- TODO: page number & controls, zoom, find. -->
      </div>`;
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('multiPage')) {
      const container = this.shadowRoot!.querySelector('#container');
      if (this.multiPage) {
        this._pdfViewer = new viewer.PDFViewer({
          container: container,
          viewer: this._viewerElement,
          // linkService: pdfLinkService,
          // findController: pdfFindController,        
        });
      } else {
        this._pdfViewer = new viewer.PDFSinglePageViewer({
          container: container,
          viewer: this._viewerElement,
          // linkService: pdfLinkService,
          // findController: pdfFindController,        
        });
      }
      if (this._pdfDocument) {
        this._pdfViewer.setDocument(this._pdfDocument);
      }
    }

    if (changedProperties.has('src')) {
      const loadingTask = pdfjs.getDocument({
        url: this.src,
        // cMapUrl: CMAP_URL,
        // cMapPacked: CMAP_PACKED,
      });
      loadingTask.promise.then((pdfDocument: any) => {
        this._pdfDocument = pdfDocument;
        // Document loaded, specifying document for the viewer and
        // the (optional) linkService.
        this._pdfViewer.setDocument(this._pdfDocument);
        // pdfLinkService.setDocument(pdfDocument, null);
        this.dispatchEvent(new Event('load'));
      }).catch((e: Error) => {
        this.dispatchEvent(new ErrorEvent('error', {
          error: e,
        }));
      });
    }
    if (changedProperties.has('page')) {
      this._pdfViewer.scrollPageIntoView({
        pageNumber: this.page,
      });
    }
  }
}
