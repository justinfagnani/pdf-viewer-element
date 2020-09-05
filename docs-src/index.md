---
layout: page.11ty.cjs
title: <pdf-viewer> ⌲ Home
---

# &lt;pdf-viewer>

`<pdf-viewer>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<pdf-viewer>` is just an HTML element. You can it anywhere you can use HTML!

```html
<pdf-viewer></pdf-viewer>
```

  </div>
  <div>

<pdf-viewer></pdf-viewer>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<pdf-viewer>` can be configured with attributed in plain HTML.

```html
<pdf-viewer name="HTML"></pdf-viewer>
```

  </div>
  <div>

<pdf-viewer name="HTML"></pdf-viewer>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<pdf-viewer>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name="lit-html";

render(html`
  <h2>This is a &lt;pdf-viewer&gt;</h2>
  <pdf-viewer .name=${name}></pdf-viewer>
`, document.body);
```

  </div>
  <div>

<h2>This is a &lt;pdf-viewer&gt;</h2>
<pdf-viewer name="lit-html"></pdf-viewer>

  </div>
</section>
