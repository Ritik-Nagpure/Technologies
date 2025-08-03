# **Document Object Model**

The DOM (Document Object Model) is a programming interface that represents the structure of a web page as a tree of objects. It lets JavaScript interact with and manipulate HTML and CSS—like changing content, styles, and responding to user actions.

- Maps HTML as a tree: Each element (like < div >, < p >, or < img >) is a node connected in a hierarchy.
- Makes content dynamic: You can use JavaScript to change text, images, links, and styles in real time.
- Enables event handling: Like listening for clicks, typing, scrolling, or form submissions.
- Bridges HTML/CSS and JavaScript: It’s what lets JS “talk to” your webpage.

## **🔹 Core Concepts of DOM**
- What the DOM is and how it represents the structure of a webpage
```
The Document Object Model (DOM) is a programming interface for web documents. It represents the structure of an HTML or XML page as a tree of objects, allowing scripts (like JavaScript) to dynamically access and update the content, structure, and style of a webpage.

Think of it as a live blueprint of your webpage that browsers use to render and interact with content.
```
- DOM tree structure (nodes, elements, attributes, text nodes)

The DOM organizes a webpage into a hierarchical tree of nodes:

<table border="1">
  <thead>
    <tr>
      <th>Node Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Document Node</td>
      <td>The root of the DOM tree; represents the entire document</td>
    </tr>
    <tr>
      <td>Element Nodes</td>
      <td>Represent HTML tags like &lt;div&gt;, &lt;p&gt;, &lt;img&gt;</td>
    </tr>
    <tr>
      <td>Attribute Nodes</td>
      <td>Represent attributes like <code>class</code>, <code>id</code>, <code>src</code> inside elements</td>
    </tr>
    <tr>
      <td>Text Nodes</td>
      <td>Contain the actual text inside elements</td>
    </tr>
    <tr>
      <td>Comment Nodes</td>
      <td>Represent comments in the HTML (<code>&lt;!-- comment --&gt;</code>)</td>
    </tr>
  </tbody>
</table>

```
Each node is connected like branches in a tree:
The document is the root.
Elements are children of the document.
Elements can have attributes and text nodes as their children.
```

## **🧭 DOM Navigation & Selection** → [ 01 Selectors ]
- **getElementById, getElementsByClassName, getElementsByTagName**
- **querySelector, querySelectorAll**
- **DOM traversal** (e.g. parentNode, children, nextSibling, etc.)

## **🛠️ DOM Manipulation** **→** [ 02 Manupulation]
- Changing element content: **innerHTML, textContent, innerText**

| Property        | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| **innerHTML**     | Gets or sets HTML content inside an element                                 |
| **innerText**     | Gets or sets visible text (respects CSS like **display: none**)               |
| **textContent**   | Gets or sets all text content (ignores styling, includes hidden text)       |
| **outerHTML**     | Gets or sets the entire HTML including the element itself                   |
| **outerText**     | Like **innerText**, but replaces the element with the text (rarely used)      |
| **value**         | Gets or sets the value of input, textarea, or select elements               |
| **className**     | Gets or sets the class attribute as a string                                |
| **classList**     | Allows adding/removing/toggling classes more flexibly                       |
| **id**            | Gets or sets the ID of an element                                           |
| **style**         | Directly manipulates inline styles (e.g., **element.style.color = "red"**)    |
| **attributes**    | Accesses all attributes of an element                                       |
| **dataset**       | Accesses custom **data-*** attributes                                         |

<hr/>

- Modifying attributes: **setAttribute, getAttribute, removeAttribute**
- Adding/removing elements: **createElement, appendChild, removeChild, replaceChild**



## **🎨 Styling Elements** → [ 03 Styling ]
- Inline styling with **.style**
- Dynamically adding/removing classes: **classList.add, classList.remove, classList.toggle**
- Using className and its limitations

## **⚡ Event Handling** → [ 04 Events and Event Handling]
- Adding events: **addEventListener**
- Event object and properties (target, type, preventDefault)
- Event types: **click, keyup, submit, load, etc.**
- Event propagation: **bubbling vs. capturing**
- Removing events: **removeEventListener**

## **💾 Forms and Input Handling** → [ 05 Forms and Input ]
- Reading input values from form controls
- Handling form submissions
- Validating input using JS
- Preventing default form behavior

## **🧩 Miscellaneous Essentials**
- document.readyState
- DOMContentLoaded event
- window vs. document object
- Timers and delays (setTimeout, setInterval) for dynamic interaction



## Notes
- Table for Inner elemnet content

| Feature                        | `innerText`                              | `textContent`                            | `innerHTML`                               |
|-------------------------------|------------------------------------------|------------------------------------------|--------------------------------------------|
| **Reads visible text only**   | ✅ Yes (ignores hidden elements)         | ❌ No (includes hidden text)             | ❌ No (returns HTML markup)                |
| **Reads all text nodes**      | ❌ No                                     | ✅ Yes                                    | ❌ No                                      |
| **Reads HTML tags**           | ❌ No                                     | ❌ No                                     | ✅ Yes                                     |
| **Writes plain text**         | ✅ Yes                                    | ✅ Yes                                    | ❌ No (requires HTML-safe input)           |
| **Writes HTML markup**        | ❌ No                                     | ❌ No                                     | ✅ Yes                                     |
| **DOM traversal impact**      | ⚠️ Moderate (depends on visibility)       | ✅ Minimal (direct access to text nodes) | ⚠️ Moderate (parses and injects HTML)     |
| **Triggers reflow/layout**    | ⚠️ Yes (calculates styles/layout)         | ✅ No                                     | ⚠️ Yes (may re-render DOM structure)       |
| **Performance (read)**        | ❌ Slower (layout-dependent)              | ✅ Fastest (no layout needed)            | ⚠️ Depends on markup complexity            |
| **Performance (write)**       | ✅ Fast for plain text                    | ✅ Fast for plain text                   | ❌ Slower if complex HTML is injected      |
| **Whitespace handling**       | ✅ Trims and collapses                    | ❌ Preserves all whitespace              | ✅ Preserves formatting via HTML           |
| **Security risk (XSS)**       | ✅ Safe                                   | ✅ Safe                                   | ❌ Risk if inserting untrusted HTML        |
| **Use case**                  | Displaying visible text only             | Extracting raw text from DOM            | Rendering or modifying HTML structure      |



- Table for Outer elemnet content
 
| Feature                        | `outerText`                               | `outerHTML`                               |
|-------------------------------|--------------------------------------------|--------------------------------------------|
| **Reads visible text only**   | ✅ Yes (ignores hidden elements)           | ❌ No (returns full HTML markup)           |
| **Includes element tag**      | ❌ No (returns only visible text)          | ✅ Yes (includes opening and closing tags) |
| **Writes plain text**         | ✅ Yes (replaces element with text)        | ❌ No (requires HTML-safe input)           |
| **Writes HTML markup**        | ❌ No                                      | ✅ Yes (replaces element with HTML)        |
| **Replaces element itself**   | ✅ Yes                                      | ✅ Yes                                      |
| **Triggers reflow/layout**    | ⚠️ Yes (due to layout recalculation)       | ⚠️ Yes (due to DOM re-rendering)           |
| **Performance (read)**        | ❌ Slower (layout-dependent)               | ⚠️ Depends on markup complexity            |
| **Performance (write)**       | ✅ Fast (simple replacement)               | ❌ Slower if complex HTML is injected      |
| **Whitespace handling**       | ✅ Trims and collapses                     | ✅ Preserves formatting via HTML           |
| **Security risk (XSS)**       | ✅ Safe                                    | ❌ Risk if inserting untrusted HTML        |
| **Use case**                  | Replace element with plain visible text    | Replace element with HTML structure        |


- Table for Adding Removing elements 

| Operation           | Method/Property         | Description                                                                 | Example Usage                                                                 |
|---------------------|-------------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| **Add (append)**    | `appendChild()`         | Adds a node as the last child of a parent                                  | `parent.appendChild(newElement)`                                              |
|                     | `append()`              | Adds one or more nodes or strings as children (more flexible than `appendChild`) | `parent.append("Text", newElement)`                                           |
|                     | `insertBefore()`        | Inserts a node before a reference child node                               | `parent.insertBefore(newElement, referenceNode)`                              |
|                     | `innerHTML += ...`      | Adds HTML content (not recommended for dynamic DOM manipulation)           | `parent.innerHTML += "<div>New</div>"`                                        |
|                     | `cloneNode()`           | Creates a copy of an existing node                                         | `const copy = original.cloneNode(true)`                                       |
| **Remove**          | `removeChild()`         | Removes a child node from a parent                                         | `parent.removeChild(child)`                                                   |
|                     | `remove()`              | Removes the element itself from the DOM                                    | `element.remove()`                                                            |
|                     | `replaceChild()`        | Replaces one child node with another                                       | `parent.replaceChild(newElement, oldElement)`                                 |
|                     | `outerHTML = ""`        | Removes the element by replacing it with an empty string                   | `element.outerHTML = ""`                                                      |
|                     | `innerHTML = ""`        | Clears all child content inside an element                                 | `parent.innerHTML = ""`                                                       |

- Table of styling manupulation

| Method/Property         | Description                                                                 | Example Usage                          |
|-------------------------|-----------------------------------------------------------------------------|----------------------------------------|
| `element.style.property`| Sets or gets inline styles directly on an element                          | `element.style.color = "red"`          |
| `element.style.cssText` | Sets multiple styles as a string                                            | `element.style.cssText = "color: red; background: yellow"` |
| `getComputedStyle()`    | Retrieves all the final computed styles of an element                      | `getComputedStyle(element).fontSize`   |
| `element.classList.add()`    | Adds a class to the element                                         | `element.classList.add("active")`      |
| `element.classList.remove()` | Removes a class from the element                                     | `element.classList.remove("hidden")`   |
| `element.classList.toggle()` | Toggles a class on/off                                               | `element.classList.toggle("dark-mode")`|
| `element.classList.contains()`| Checks if a class exists on the element                             | `element.classList.contains("active")` |
| `element.setAttribute()`     | Sets a style attribute (less common for CSS)                        | `element.setAttribute("style", "color: blue")` |
| `element.removeAttribute()`  | Removes the style attribute                                          | `element.removeAttribute("style")`     |
