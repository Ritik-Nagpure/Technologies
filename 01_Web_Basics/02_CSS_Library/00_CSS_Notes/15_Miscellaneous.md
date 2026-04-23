## Miscellaneous : Extra CSS properties for user interaction and content control.

Interview One-Liner: Miscellaneous properties handle cursors, selection, and dynamic content.

## Cursor : Change the mouse pointer style.

Interview One-Liner: Cursor defines how the pointer looks when hovering.

```css
/* show pointer hand on hover */
button {
  cursor: pointer;
}
/* show text cursor */
p {
  cursor: text;
}
```

## Pointer Events : Control mouse interactions with elements.

Interview One-Liner: Pointer-events decide if an element responds to clicks.

```css
/* disable mouse interaction */
div {
  pointer-events: none;
}
/* enable mouse interaction */
div {
  pointer-events: auto;
}
```

## User Select : Control text selection behavior.

Interview One-Liner: User-select allows or prevents text highlighting.

```css
/* prevent text selection */
p {
  user-select: none;
}
/* allow text selection */
p {
  user-select: text;
}
```

## Content Property : Insert generated content with pseudo-elements.

Interview One-Liner: Content property adds text or symbols before/after elements.

```css
/* add label before element */
p::before {
  content: "Note: ";
  color: red;
}
/* add checkmark after element */
p::after {
  content: " ✔";
  color: green;
}
```

## Counters : Create automatic numbering for elements.

Interview One-Liner: Counters generate dynamic numbering in lists or headings.

```css
/* initialize counter */
body {
  counter-reset: section;
}
/* increment counter */
h2::before {
  counter-increment: section;
  content: "Section " counter(section) ": ";
}
```

## Will Change : Hint browser about upcoming changes.

Interview One-Liner: Will-change optimizes performance for animations and transitions.

```css
/* hint that transform will change */
div {
  will-change: transform;
}
/* hint that opacity will change */
div {
  will-change: opacity;
}
```
