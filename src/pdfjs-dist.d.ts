import * as pdfjs from 'pdfjs-dist';

declare module '@bundled-es-modules/pdfjs-dist' {
  export = pdfjs;
}

declare module '@bundled-es-modules/pdfjs-dist/web/pdf_viewer';
