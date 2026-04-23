## Modern CSS : Newer features that make styling more powerful and flexible.

Interview One-Liner: Modern CSS introduces advanced tools for responsive and dynamic design.

## CSS Variables (Custom Properties) : Define reusable values.

Interview One-Liner: CSS variables allow consistent styling with easy updates.

```css
/* define variable */
:root {
  --main-color: blue;
  --padding-size: 10px;
}
/* use variable */
div {
  color: var(--main-color);
  padding: var(--padding-size);
}
```

## Clamp() : Set a value with min, preferred, and max limits.

Interview One-Liner: Clamp ensures values stay within a safe range.

```css
/* font size between 16px and 24px, preferring 2vw */
p {
  font-size: clamp(16px, 2vw, 24px);
}
```

## Min() / Max() : Choose smallest or largest value.

Interview One-Liner: Min/Max functions pick the most suitable size.

```css
/* width is the smaller of 50% or 400px */
div {
  width: min(50%, 400px);
}
/* height is the larger of 200px or 10vh */
div {
  height: max(200px, 10vh);
}
```

## Aspect Ratio : Maintain width-to-height ratio.

Interview One-Liner: Aspect ratio keeps elements proportional.

```css
/* element maintains 16:9 ratio */
div {
  aspect-ratio: 16 / 9;
}
```

## Object Fit : Control how media fits inside container.

Interview One-Liner: Object-fit defines how images/videos scale in boxes.

```css
/* cover container without distortion */
img {
  object-fit: cover;
}
/* fit entire image inside */
img {
  object-fit: contain;
}
```

## Scroll Behavior : Control smooth scrolling.

Interview One-Liner: Scroll behavior defines how page scrolls to anchors.

```css
/* enable smooth scrolling */
html {
  scroll-behavior: smooth;
}
```

## Scroll Snap : Lock scroll position to defined points.

Interview One-Liner: Scroll snap creates precise snapping for scrollable areas.

```css
/* snap container horizontally */
div {
  scroll-snap-type: x mandatory;
}
/* snap items to start */
.section {
  scroll-snap-align: start;
}
```
