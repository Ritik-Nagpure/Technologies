# Advanced Selectors : More powerful ways to target elements.
Interview One-Liner: Advanced selectors let you style elements with precision.

## Attribute Selectors : Select elements based on attributes.
Interview One-Liner: Attribute selectors match elements using attribute values.

```css
    /* select input with type="text" */
    input[type="text"] {
      border: 1px solid black;
    }
    /* select links with target="_blank" */
    a[target="_blank"] {
      color: red;
    }
    /* select elements with data-role attribute */
    [data-role="admin"] {
      font-weight: bold;
    }
```

## Pseudo Classes : Select elements in a specific state.
Interview One-Liner: Pseudo classes style elements based on their state.

```css
    /* style link when hovered */
    a:hover {
      color: green;
    }
    /* style first child element */
    p:first-child {
      font-style: italic;
    }
    /* style visited links */
    a:visited {
      color: purple;
    }
```

## Pseudo Elements : Style parts of an element.
Interview One-Liner: Pseudo elements let you style specific parts of content.

```css
    /* add content before element */
p::before {
      content: "Note: ";
      color: red;
    }
    /* add content after element */
p::after {
      content: " ✔";
      color: green;
    }
    /* style first line of text */
p::first-line {
      font-weight: bold;
    }
    /* style first letter */
p::first-letter {
      font-size: 24px;
    }
```

## Structural Selectors (:nth-child, etc.) : Select elements based on position.
Interview One-Liner: Structural selectors target elements by their order in the DOM.

```css
    /* select every even row */
tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    /* select every odd row */
tr:nth-child(odd) {
      background-color: #ddd;
    }
    /* select the third child */
li:nth-child(3) {
      color: blue;
    }
    /* select last child */
p:last-child {
      font-style: italic;
    }
```
