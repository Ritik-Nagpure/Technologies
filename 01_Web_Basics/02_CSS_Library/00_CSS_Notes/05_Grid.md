# Grid : A layout system using rows and columns.

## Grid Container : The parent element that holds grid items.

```css
/* make container a grid */
div {
  display: grid;
}
```

## Grid Items : The child elements inside a grid container.

```css
/* grid items are direct children of grid container */
div > p {
  grid-column: 1;
}
```

## Grid Template Columns : Define column structure.

```css
/* three equal columns */
div {
  grid-template-columns: 1fr 1fr 1fr;
}
/* fixed and flexible columns */
div {
  grid-template-columns: 200px auto;
}
```

## Grid Template Rows : Define row structure.

```css
/* two rows: one fixed, one flexible */
div {
  grid-template-rows: 100px auto;
}
```

## Grid Area : Define named areas for layout.

```css
/* name areas */
div {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
/* assign item to area */
.header {
  grid-area: header;
}
```

## Grid Gap : Space between rows and columns.

```css
/* 20px gap between rows and columns */
div {
  grid-gap: 20px;
}
/* separate row and column gaps */
div {
  row-gap: 10px;
  column-gap: 15px;
}
```

## Grid Auto Flow : Control automatic item placement.

```css
/* place items by row (default) */
div {
  grid-auto-flow: row;
}
/* place items by column */
div {
  grid-auto-flow: column;
}
/* dense packing */
div {
  grid-auto-flow: dense;
}
```

## Justify Items : Align items horizontally within their cells.

```css
/* center items horizontally */
div {
  justify-items: center;
}
/* align items to start */
div {
  justify-items: start;
}
```

## Align Items : Align items vertically within their cells.

```css
/* center items vertically */
div {
  align-items: center;
}
/* align items to end */
div {
  align-items: end;
}
```

## Place Items : Shorthand for align-items and justify-items.

```css
/* center items both horizontally and vertically */
div {
  place-items: center;
}
```
