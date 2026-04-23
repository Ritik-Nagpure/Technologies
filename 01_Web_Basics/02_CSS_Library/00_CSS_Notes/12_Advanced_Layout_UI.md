## Advanced Layout & UI : Modern techniques for complex layouts and interfaces.

Interview One-Liner: Advanced layout features provide powerful control for responsive and dynamic designs.

## Container Queries : Apply styles based on container size.

Interview One-Liner: Container queries adapt elements depending on their parent’s dimensions.

```css
/* style changes when container width is at least 500px */
@container (min-width: 500px) {
  .card {
    font-size: 1.2rem;
  }
}
```

## Subgrid : Allow child grids to inherit parent grid tracks.

Interview One-Liner: Subgrid lets nested elements align with parent grid lines.

```css
/* parent grid defines columns */
.parent {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
/* child grid uses parent’s tracks */
.child {
  display: grid;
  grid-template-columns: subgrid;
}
```

## Logical Properties : Use writing-mode aware properties.

Interview One-Liner: Logical properties replace physical ones for better internationalization.

```css
/* padding on inline start (left in LTR, right in RTL) */
div {
  padding-inline-start: 20px;
}
/* margin on block end (bottom in horizontal writing mode) */
div {
  margin-block-end: 10px;
}
```

## Writing Modes : Control text flow direction.

Interview One-Liner: Writing modes change text orientation for different languages.

```css
/* vertical text top to bottom */
div {
  writing-mode: vertical-rl;
}
/* horizontal text left to right (default) */
div {
  writing-mode: horizontal-tb;
}
```

## Multi-column Layout : Split content into multiple columns.

Interview One-Liner: Multi-column layout flows text across columns like newspapers.

```css
/* two columns with gap */
div {
  column-count: 2;
  column-gap: 30px;
}
```

## Resize : Allow elements to be resizable by user.

Interview One-Liner: Resize lets users adjust element dimensions interactively.

```css
/* allow vertical resizing */
textarea {
  resize: vertical;
}
/* disable resizing */
textarea {
  resize: none;
}
```

## Clip Path : Define custom shapes for elements.

Interview One-Liner: Clip-path cuts elements into shapes beyond rectangles.

```css
/* circle shape */
div {
  clip-path: circle(50%);
}
/* polygon shape */
div {
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}
```

## Masking : Use images or gradients to mask element visibility.

Interview One-Liner: Masking hides or reveals parts of elements using shapes or images.

```css
/* mask with image */
div {
  mask-image: url(mask.png);
  mask-repeat: no-repeat;
  mask-position: center;
}
/* mask with gradient */
div {
  mask-image: linear-gradient(to bottom, black, transparent);
}
```
