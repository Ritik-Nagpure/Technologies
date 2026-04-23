## Transforms : Change the shape, size, and position of elements.

Interview One-Liner: Transforms let you move, rotate, scale, or skew elements.

## Translate : Move an element along X or Y axis.

Interview One-Liner: Translate repositions elements without affecting flow.

```css
/* move element 50px right and 20px down */
div {
  transform: translate(50px, 20px);
}
```

## Rotate : Rotate an element around its center.

Interview One-Liner: Rotate spins elements by a given angle.

```css
/* rotate element 45 degrees */
div {
  transform: rotate(45deg);
}
```

## Scale : Resize an element larger or smaller.

Interview One-Liner: Scale increases or decreases element size.

```css
/* double size of element */
div {
  transform: scale(2);
}
/* shrink element to half */
div {
  transform: scale(0.5);
}
```

## Skew : Slant an element along X or Y axis.

Interview One-Liner: Skew slants elements for angled effects.

```css
/* skew element 20 degrees horizontally */
div {
  transform: skewX(20deg);
}
/* skew element 15 degrees vertically */
div {
  transform: skewY(15deg);
}
```

## Transform Origin : Set the point around which transforms occur.

Interview One-Liner: Transform origin defines the pivot point for transformations.

```css
/* rotate around top left corner */
div {
  transform-origin: top left;
  transform: rotate(45deg);
}
/* scale from center (default) */
div {
  transform-origin: center;
  transform: scale(1.5);
}
```
