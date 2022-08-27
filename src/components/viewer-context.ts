import {createContext} from '@lit-labs/context';
import type {PDFViewerElement} from './pdf-viewer.js';

export const viewerContext = createContext<PDFViewerElement | undefined>(Symbol('pdf-viewer'));
