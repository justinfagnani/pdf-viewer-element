declare module '@bundled-es-modules/pdfjs-dist' {
  const x: typeof import('pdfjs-dist');
  export default x;
}
declare module '@bundled-es-modules/pdfjs-dist/web/pdf_viewer' {
  // import * as pdf from 'pdfjs-dist';
  // export const PDFViewer: typeof pdf.PDFJS.PDFViewer;
  // const viewer: typeof import('pdfjs-dist').PDFJS;
  const viewer: any;
  export default viewer;
}
