## HTML


--- 
## Tags Details
# HTML Elements Reference Table

| Element        | Description                                                                 | Usage Example                                                                 |
|----------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `<html>`       | Root element of an HTML document.                                           | `<html lang="en"> ... </html>`                                                |
| `<head>`       | Contains metadata, links, and scripts.                                      | `<head><title>Page Title</title></head>`                                      |
| `<title>`      | Defines the document’s title (shown in browser tab).                        | `<title>My Website</title>`                                                   |
| `<meta>`       | Provides metadata (charset, viewport, SEO info).                            | `<meta charset="UTF-8">`                                                      |
| `<link>`       | Links external resources (CSS, icons, preloads).                            | `<link rel="stylesheet" href="styles.css">`                                   |
| `<script>`     | Embeds or links JavaScript code.                                            | `<script src="app.js" defer></script>`                                        |
| `<style>`      | Embeds CSS directly in HTML.                                                | `<style>body { font-family: Arial; }</style>`                                  |
| `<body>`       | Contains all visible page content.                                          | `<body><h1>Hello World</h1></body>`                                           |
| `<header>`     | Represents introductory content or navigation.                              | `<header><h1>Site Title</h1></header>`                                        |
| `<nav>`        | Defines navigation links.                                                   | `<nav><a href="/">Home</a></nav>`                                             |
| `<main>`       | Represents the main content of the page.                                    | `<main><article>...</article></main>`                                         |
| `<section>`    | Groups related content with a heading.                                      | `<section><h2>About Us</h2><p>...</p></section>`                              |
| `<article>`    | Self-contained content (blog post, news item).                              | `<article><h2>Blog Title</h2><p>...</p></article>`                            |
| `<aside>`      | Content indirectly related to the main content (sidebar).                   | `<aside>Related links</aside>`                                                |
| `<footer>`     | Defines footer content (credits, links).                                    | `<footer>&copy; 2026 My Company</footer>`                                     |
| `<h1>`–`<h6>`  | Headings, hierarchical structure.                                           | `<h1>Main Title</h1><h2>Subheading</h2>`                                      |
| `<p>`          | Paragraph of text.                                                          | `<p>This is a paragraph.</p>`                                                 |
| `<span>`       | Inline container for styling or grouping text.                              | `<span class="highlight">Important</span>`                                    |
| `<div>`        | Generic block-level container.                                              | `<div class="container">...</div>`                                            |
| `<a>`          | Hyperlink to another page or resource.                                      | `<a href="https://example.com">Visit</a>`                                     |
| `<img>`        | Embeds an image.                                                           | `<img src="photo.jpg" alt="Description">`                                     |
| `<picture>`    | Responsive images with multiple sources.                                    | `<picture><source srcset="img.webp" type="image/webp"><img src="img.jpg"></picture>` |
| `<figure>`     | Groups media content with a caption.                                        | `<figure><img src="chart.png"><figcaption>Sales Chart</figcaption></figure>`  |
| `<figcaption>` | Provides a caption for `<figure>`.                                          | `<figcaption>Quarterly Results</figcaption>`                                  |
| `<ul>`         | Unordered list.                                                            | `<ul><li>Item 1</li><li>Item 2</li></ul>`                                     |
| `<ol>`         | Ordered list.                                                              | `<ol><li>First</li><li>Second</li></ol>`                                      |
| `<li>`         | List item.                                                                 | `<li>Item</li>`                                                               |
| `<table>`      | Defines a table.                                                           | `<table><tr><td>Data</td></tr></table>`                                       |
| `<tr>`         | Table row.                                                                 | `<tr><td>Row Data</td></tr>`                                                  |
| `<td>`         | Table cell.                                                                | `<td>Cell Data</td>`                                                          |
| `<th>`         | Table header cell.                                                         | `<th>Header</th>`                                                             |
| `<form>`       | Defines a form for user input.                                              | `<form action="/submit" method="post">...</form>`                             |
| `<input>`      | Input field.                                                               | `<input type="text" name="username">`                                         |
| `<textarea>`   | Multi-line text input.                                                     | `<textarea rows="4" cols="50"></textarea>`                                    |
| `<button>`     | Clickable button.                                                          | `<button type="submit">Submit</button>`                                       |
| `<select>`     | Drop-down list.                                                            | `<select><option>Option 1</option></select>`                                  |
| `<option>`     | Option in a `<select>`.                                                    | `<option value="1">One</option>`                                              |
| `<label>`      | Associates text with form input.                                           | `<label for="email">Email</label><input id="email">`                          |
| `<iframe>`     | Embeds another HTML page.                                                  | `<iframe src="page.html"></iframe>`                                           |
| `<embed>`      | Embeds external content (PDF, multimedia).                                 | `<embed src="file.pdf" type="application/pdf">`                               |
| `<audio>`      | Embeds audio content.                                                      | `<audio controls><source src="song.mp3" type="audio/mpeg"></audio>`           |
| `<video>`      | Embeds video content.                                                      | `<video controls><source src="movie.mp4" type="video/mp4"></video>`           |
| `<canvas>`     | Provides a drawing surface via JavaScript.                                 | `<canvas id="myCanvas"></canvas>`                                             |
| `<svg>`        | Scalable Vector Graphics.                                                  | `<svg><circle cx="50" cy="50" r="40"/></svg>`                                 |
| `<template>`   | Defines reusable HTML fragments not rendered until cloned.                 | `<template><p>Template Content</p></template>`                                |
| `<slot>`       | Placeholder for light DOM content in Web Components.                       | `<slot></slot>`                                                               |


---
# Extended HTML Elements Reference Table

| Element        | Description                                                                 | Usage Example                                                                 |
|----------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `<details>`    | Creates a disclosure widget that users can open/close.                      | `<details><summary>More info</summary><p>Hidden text</p></details>`           |
| `<summary>`    | Defines the summary/label for a `<details>` element.                        | `<summary>Click to expand</summary>`                                          |
| `<dialog>`     | Represents a dialog box or modal window.                                    | `<dialog open>Modal content</dialog>`                                         |
| `<progress>`   | Displays progress of a task.                                                | `<progress value="70" max="100">70%</progress>`                               |
| `<meter>`      | Displays a scalar measurement within a known range.                        | `<meter value="0.6">60%</meter>`                                              |
| `<time>`       | Represents a specific time or date.                                         | `<time datetime="2026-04-27">April 27, 2026</time>`                           |
| `<mark>`       | Highlights text for reference.                                              | `<p>Search result: <mark>keyword</mark></p>`                                  |
| `<abbr>`       | Defines an abbreviation or acronym.                                         | `<abbr title="World Health Organization">WHO</abbr>`                          |
| `<cite>`       | Represents the title of a work (book, film, etc.).                         | `<cite>The Great Gatsby</cite>`                                               |
| `<code>`       | Displays inline code snippets.                                              | `<code>console.log("Hello")</code>`                                           |
| `<pre>`        | Displays preformatted text (preserves whitespace).                         | `<pre>Line 1\nLine 2</pre>`                                                   |
| `<kbd>`        | Represents user keyboard input.                                             | `<kbd>Ctrl</kbd> + <kbd>C</kbd>`                                              |
| `<samp>`       | Represents sample output from a program.                                    | `<samp>Error: File not found</samp>`                                          |
| `<var>`        | Represents a variable in math or programming.                               | `<var>x</var> = <var>y</var> + 2`                                             |
| `<b>`          | Bold text (stylistic, not semantic).                                        | `<b>Important</b>`                                                            |
| `<i>`          | Italic text (stylistic, not semantic).                                      | `<i>Foreign word</i>`                                                         |
| `<u>`          | Underlined text.                                                           | `<u>Highlighted</u>`                                                          |
| `<small>`      | Smaller text, often for fine print.                                         | `<small>Terms and conditions apply</small>`                                   |
| `<strong>`     | Strong importance (semantic bold).                                          | <strong>Warning!</strong>                                                   |
| `<em>`         | Emphasis (semantic italic).                                                 | `<em>Note this carefully</em>`                                                |
| `<del>`        | Represents deleted text.                                                    | `<del>Old price</del>`                                                        |
| `<ins>`        | Represents inserted text.                                                   | `<ins>New price</ins>`                                                        |
| `<sup>`        | Superscript text.                                                           | `x<sup>2</sup>`                                                               |
| `<sub>`        | Subscript text.                                                             | `H<sub>2</sub>O`                                                              |
| `<br>`         | Line break.                                                                 | `Line 1<br>Line 2`                                                            |
| `<hr>`         | Thematic break (horizontal rule).                                           | `<hr>`                                                                        |

##