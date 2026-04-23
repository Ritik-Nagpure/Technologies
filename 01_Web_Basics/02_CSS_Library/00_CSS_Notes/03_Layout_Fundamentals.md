# Layout Fundamentals : Control how elements are arranged on a page.

## Normal Flow : Default positioning of elements.

```css
/* block elements stack vertically */
div {
  display: block;
}
/* inline elements flow horizontally */
span {
  display: inline;
}
```

## Positioning (static, relative, absolute, fixed, sticky) : Control element position.

```css
/* default positioning */
div {
  position: static;
}
/* relative to normal position */
div {
  position: relative;
  top: 10px;
}
/* absolute relative to nearest positioned ancestor */
div {
  position: absolute;
  top: 20px;
  left: 30px;
}
/* fixed relative to viewport */
.header {
  position: fixed;
  top: 0;
}
/* sticky toggles between relative and fixed */
nav {
  position: sticky;
  top: 0;
}
```

## Float : Push elements to left or right.

```css
/* float element to the left */
img {
  float: left;
}
/* float element to the right */
img {
  float: right;
}
```

## Clear : Prevent floating elements from overlapping.

```css
/* clear floats on both sides */
p {
  clear: both;
}
```

## Overflow : Control content that exceeds container.

```css
/* hide overflowing content */
div {
  overflow: hidden;
}
/* add scrollbars */
div {
  overflow: scroll;
}
/* auto scrollbars when needed */
div {
  overflow: auto;
}
```

## Visibility : Show or hide elements.

```css
/* hide element but keep space */
p {
  visibility: hidden;
}
/* show element */
p {
  visibility: visible;
}
```

## Z-Index : Control stacking order of elements.

```css
/* higher z-index appears above lower ones */
div {
  position: absolute;
  z-index: 10;
}
```
