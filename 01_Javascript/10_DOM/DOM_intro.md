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
- Changing element content: **innerHTML, textContent**
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