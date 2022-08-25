# `<pdf-viewer>`

`<pdf-viewer>` is a custom HTML element that displays PDFs, much like an `<img>` tag.

`<pdf-viewer>` is a drop-in PDF viewer. It works in plain HTML documents, and in frameworks with declararive templating like React, Vue, Angular, Lit, or Svelte.

`<pdf-viewer>` is built with [PDF.js](https://github.com/mozilla/pdf.js), which renders PDFs with JavaScript. PDF.js is maintained by Mozilla and powers Firefox's built-in PDF viewer.

## Install

```sh
npm i pdf-viewer-element
```

## Use

```html
<script type="module" src="node_modules/pdf-viewer-element/pdf-viewer.js"></script>

<!-- ... -->

<pdf-viewer-element src="./my-doc.pdf"></pdf-viewer-element>
```


### Or from a CDN like unpkg.com:

```html
<script type="module" src="https://unpkg.com/pdf-viewer-element?module"></script>

<!-- ... -->

<pdf-viewer-element src="./my-doc.pdf"></pdf-viewer-element>
```


# Goals

* Simple drop-in PDF viewer with no configuration required
* No build steps required
* Works from a CDN
* Optional configuration for power-users:
  * Exposes most useful pdf.js options
  * Customization via DOM: CSS variables, slots, parts, etc.
* Adapt pdf.js to the DOM: ie, pipe events back through elements

# Project Goals

Why make this?

* Learn pdf.js
* Create a useful framework-agnostic element for the web ecosystem
* Gain experience with tricky module, worker, and asynchronous timing issues within web component wrappers
* Convince pdf.js to distribute modules and web components directly?

# TODO

* Controls replaceable via `<slot>`s
* Tests
* Pipe events from pdf.js event-bus into DOM elements
* Options: rotation, auto-size
* Use ResizeObserver for auto-size
* Use IntersectionObserver for laziness
