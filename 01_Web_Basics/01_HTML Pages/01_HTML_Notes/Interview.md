# Senior Developer HTML Interview Guide

## Core HTML Structure & Semantics

**Q: What are the differences between inline, block, and inline-block elements?**  
- **Block**: Takes full width, starts on a new line. Example: `<div>`, `<p>`.  
- **Inline**: Only takes as much width as needed, does not start on a new line. Example: `<span>`, `<a>`.  
- **Inline-block**: Behaves like inline but allows setting width/height.  
Example:  
<span style="display:inline-block; width:100px;">Box</span>

**Q: How do semantic HTML tags improve accessibility and SEO?**  
- They provide meaning to content, helping screen readers and search engines.  
- Example: `<article>` signals independent content, `<nav>` signals navigation links.

**Q: Difference between `<section>`, `<article>`, and `<div>`?**  
- `<section>`: Groups related content with a heading.  
- `<article>`: Self-contained content (blog post, news item).  
- `<div>`: Generic container with no semantic meaning.

**Q: When would you use `<figure>` and `<figcaption>`?**  
- For images, diagrams, or code snippets with a caption.  
Example:  
<figure>  
  <img src="chart.png" alt="Sales chart">  
  <figcaption>Quarterly sales growth</figcaption>  
</figure>

---

## Forms & Inputs

**Q: How do you associate a `<label>` with an `<input>`?**  
- Use `for` (or `htmlFor` in React) with matching `id`.  
Example:  
<label for="username">Username</label>  
<input id="username" type="text">

**Q: Differences between `required`, `pattern`, and `aria-required`?**  
- `required`: Native HTML validation.  
- `pattern`: Regex validation for input.  
- `aria-required`: Accessibility hint for screen readers.

**Q: Accessibility in custom form controls?**  
- Use ARIA roles and keyboard handling.  
Example:  
<div role="checkbox" aria-checked="false" tabindex="0">Custom Checkbox</div>

**Q: Difference between `autocomplete="on"` and `autocomplete="off"`?**  
- `on`: Browser suggests previously entered values.  
- `off`: Prevents browser from suggesting values.

---

## Performance & Best Practices

**Q: How does the `defer` and `async` attribute on `<script>` affect page load?**  
- `defer`: Executes script after HTML parsing, in order.  
- `async`: Executes script as soon as downloaded, order not guaranteed.

**Q: Difference between inline styles, internal styles, and external styles in terms of performance?**  
- Inline: Hard to maintain, increases HTML size.  
- Internal: Scoped to one page, still adds weight.  
- External: Cached across pages, best for performance.

**Q: How do you optimize HTML for faster rendering and better Core Web Vitals?**  
- Minimize DOM depth, preload critical resources, lazy load images, use semantic tags.

**Q: Why is minimizing DOM depth important for performance?**  
- Reduces rendering complexity and improves reflow/repaint efficiency.

---

## Accessibility & ARIA

**Q: What role do ARIA attributes play in HTML, and when should they be used?**  
- Provide accessibility info when semantic HTML isn’t enough.  
- Example: `aria-label="Close"` for a button with only an icon.

**Q: How do you ensure keyboard navigation works properly in a custom modal dialog?**  
- Trap focus inside modal, allow Escape key to close, restore focus to trigger element.

**Q: Difference between `aria-label`, `aria-labelledby`, and `aria-describedby`?**  
- `aria-label`: Provides a string label directly.  
- `aria-labelledby`: References another element’s text as label.  
- `aria-describedby`: References another element’s text as description.

**Q: How do you test HTML accessibility across different screen readers?**  
- Use NVDA, JAWS, VoiceOver, TalkBack. Test keyboard navigation, labels, roles.

---

## Advanced Topics

**Q: Difference between `<link rel="preload">`, `<link rel="prefetch">`, and `<link rel="dns-prefetch">`?**  
- `preload`: Load resource early for current page.  
- `prefetch`: Load resource for future navigation.  
- `dns-prefetch`: Resolve DNS early.

**Q: How does the `<picture>` element differ from `<img>` for responsive images?**  
- `<picture>` allows multiple sources with conditions.  
Example:  
<picture>  
  <source srcset="image.webp" type="image/webp">  
  <img src="image.jpg" alt="Responsive image">  
</picture>

**Q: Difference between `<iframe>` and `<embed>`?**  
- `<iframe>`: Embeds another HTML page.  
- `<embed>`: Embeds external content like PDF or multimedia.

**Q: How do you implement lazy loading for images and iframes in HTML5?**  
- Use `loading="lazy"` attribute.  
Example:  
<img src="photo.jpg" alt="Lazy loaded" loading="lazy">

---

## Security & SEO

**Q: How does the `sandbox` attribute on `<iframe>` improve security?**  
- Restricts actions inside iframe (scripts, forms, etc.). Prevents malicious behavior.

**Q: Difference between `rel="noopener"` and `rel="noreferrer"` on links?**  
- `noopener`: Prevents new page from accessing `window.opener`.  
- `noreferrer`: Also hides referrer info from request headers.

**Q: How do meta tags influence SEO and social sharing (Open Graph, Twitter Cards)?**  
- Provide metadata for search engines and social platforms.  
Example:  
<meta property="og:title" content="My Article">  
<meta name="twitter:card" content="summary">

**Q: Why is proper heading hierarchy (`<h1>`–`<h6>`) important for accessibility and SEO?**  
- Helps screen readers navigate content.  
- Improves SEO by structuring content meaningfully.


# Senior Developer HTML Interview Guide (Extended)

## Web Components & DOM

**Q: What are Web Components in HTML5, and how do they improve reusability?**  
- Web Components are a set of standards (Custom Elements, Shadow DOM, HTML Templates) that allow developers to create reusable, encapsulated UI elements.  
- They promote modularity and interoperability across frameworks.  
Example:  
<my-button>Click Me</my-button>

**Q: Explain the Shadow DOM and its role in encapsulation.**  
- Shadow DOM provides scoped styles and markup that are isolated from the main DOM.  
- Prevents CSS leakage and ensures predictable component behavior.  
Example:  
element.attachShadow({ mode: 'open' });

**Q: Difference between `<slot>` and `<template>` elements.**  
- `<slot>`: Placeholder for light DOM content inside a Web Component.  
- `<template>`: Defines reusable HTML fragments that are not rendered until cloned.

**Q: How would you design a component library using Web Components?**  
- Use Custom Elements for reusable components.  
- Encapsulate styles with Shadow DOM.  
- Provide slots for flexible content injection.  
- Publish as standard HTML elements for framework-agnostic use.

---

## Rendering & Performance

**Q: Compare Server-Side Rendering (SSR), Client-Side Rendering (CSR), and Static Site Generation (SSG).**  
- **SSR**: HTML rendered on server, faster first paint, better SEO.  
- **CSR**: HTML rendered in browser via JavaScript, slower initial load, rich interactivity.  
- **SSG**: Pre-rendered HTML at build time, very fast delivery, limited dynamic content.

**Q: What is the Critical Rendering Path, and how can it be optimized?**  
- Sequence of steps the browser takes to convert HTML/CSS/JS into pixels.  
- Optimize by minimizing CSS/JS blocking, using preload, compressing assets, and lazy loading.

**Q: Explain reflow vs repaint in the browser rendering process.**  
- **Reflow**: Recalculating layout when DOM changes.  
- **Repaint**: Updating visual styles without layout changes.  
- Reflows are more expensive; minimize DOM changes to improve performance.

**Q: How do `async` and `defer` scripts differ in execution?**  
- `async`: Executes immediately when downloaded, order not guaranteed.  
- `defer`: Executes after HTML parsing, in order.

**Q: What strategies would you use to optimize HTML for Core Web Vitals?**  
- Use semantic HTML for faster parsing.  
- Preload critical resources.  
- Lazy load non-critical images.  
- Reduce DOM complexity.  
- Ensure fast LCP (Largest Contentful Paint) by prioritizing hero content.

---

## HTML5 APIs & Features

**Q: Name and explain common HTML5 APIs.**  
- **Geolocation**: Get user location.  
- **Canvas**: Draw graphics programmatically.  
- **Web Storage**: Store data locally (localStorage/sessionStorage).  
- **Web Workers**: Run scripts in background threads.  
- **Drag & Drop**: Native drag-and-drop support.

**Q: Difference between inline SVG and Canvas API.**  
- **SVG**: Declarative, scalable, DOM-based graphics.  
- **Canvas**: Immediate mode, pixel-based drawing, better for dynamic rendering.

**Q: How do data-* attributes enhance flexibility in HTML5?**  
- Allow embedding custom metadata in elements.  
- Useful for JS logic without polluting semantics.  
Example:  
<div data-user-id="123">Profile</div>

**Q: Advantages of Web Storage compared to cookies?**  
- Larger storage capacity (5MB vs ~4KB).  
- Not sent with every HTTP request.  
- Easier API (`localStorage.setItem`, `getItem`).  
- Session vs persistent storage options.

---

## Accessibility & SEO

**Q: How do you ensure accessibility in complex UI components?**  
- Use ARIA roles and attributes.  
- Manage focus with JavaScript.  
- Provide keyboard navigation.  
- Ensure screen reader compatibility.

**Q: Difference between `aria-label`, `aria-labelledby`, and `aria-describedby`?**  
- `aria-label`: Direct string label.  
- `aria-labelledby`: References another element’s text.  
- `aria-describedby`: Provides additional descriptive text.

**Q: How do semantic tags improve SEO and accessibility?**  
- Convey meaning to search engines and assistive tech.  
- `<header>`, `<nav>`, `<main>`, `<footer>` improve structure.  
- Better indexing and usability.

**Q: How would you structure headings (`<h1>`–`<h6>`) for accessibility and SEO?**  
- Use one `<h1>` per page for main title.  
- Nest headings logically to reflect hierarchy.  
- Avoid skipping levels.

---

## Security

**Q: Difference between HTML sanitization and escaping?**  
- **Sanitization**: Removing unsafe content (scripts, tags).  
- **Escaping**: Converting characters to safe equivalents (`<` → `&lt;`).  
- Both prevent XSS attacks.

**Q: How does the `sandbox` attribute on `<iframe>` enhance security?**  
- Restricts iframe capabilities (scripts, forms, same-origin).  
- Prevents malicious content from affecting parent page.

**Q: Why use `rel="noopener"` and `rel="noreferrer"` on external links?**  
- `noopener`: Prevents new page from accessing `window.opener`.  
- `noreferrer`: Prevents sending referrer info in HTTP headers.

**Q: How do you prevent XSS attacks in HTML templates?**  
- Escape user input.  
- Use Content Security Policy (CSP).  
- Avoid inline scripts.  
- Sanitize dynamic HTML.

---

## Architecture & Best Practices

**Q: How do you decide between using `<iframe>` vs `<embed>` for external content?**  
- `<iframe>`: For embedding full HTML documents.  
- `<embed>`: For embedding external resources (PDF, multimedia).  
- Choose based on content type and security needs.

**Q: What are Progressive Web Apps (PWAs), and how does HTML contribute to them?**  
- PWAs are web apps with native-like features (offline, installable).  
- HTML provides the structure, manifest links, and service worker registration.

**Q: How do you handle responsive images using `<picture>` and `srcset`?**  
- Use `<picture>` for multiple formats and conditions.  
- Use `srcset` for different resolutions.  
Example:  
<picture>  
  <source srcset="image.webp" type="image/webp">  
  <img src="image.jpg" alt="Responsive image">  
</picture>

**Q: Difference between absolute, relative, and root-relative paths in HTML links?**  
- **Absolute**: Full URL (`https://example.com/page`).  
- **Relative**: Relative to current document (`page.html`).  
- **Root-relative**: Relative to site root (`/page.html`).

**Q: How do you optimize images in HTML for performance?**  
- Use modern formats (WebP, AVIF).  
- Compress images.  
- Use `loading="lazy"`.  
- Provide responsive sizes with `srcset`.


Q: What are semantic HTML tags?  
Semantic tags clearly describe their meaning and role in the document. They improve accessibility, SEO, and readability by giving structure to the content.

Examples:
```html
<header>: Defines the header section of a page or section.

<header><h1>My Website</h1></header>
<article>: Represents self‑contained content like a blog post.

<article><h2>Blog Title</h2><p>Post content...</p></article>
<nav>: Defines navigation links.

<nav><a href="/">Home</a> | <a href="/about">About</a></nav>
<footer>: Defines footer content.

<footer>&copy; 2026 My Company</footer>

```

Q: What are non‑semantic HTML tags?  
Non‑semantic tags don’t convey meaning about the content they contain. They are generic containers used mainly for styling or grouping.

Examples:

``` html
<div>: Generic block‑level container.

<div class="container">Some grouped content</div>
<span>: Generic inline container.

<span class="highlight">Highlighted text</span>
```

Q: Why does the distinction matter?

**Semantic** tags help search engines understand page structure, improve accessibility for screen readers, and make code more maintainable.

**Non‑semantic** tags are flexible but should be used sparingly (means using something only a little, in small amounts, or only when necessary) , mainly for styling or when no semantic alternative exists.