# Browser & Rendering : How browsers process and display CSS.

Interview One-Liner: Rendering concepts explain performance impacts of style changes.

## Reflow : Recalculate layout when structure changes.

Interview One-Liner: Reflow happens when the browser recomputes positions and sizes.

```css
/* changing width triggers reflow */
div {
  width: 200px;
}
```

## Repaint : Redraw element appearance without layout change.

Interview One-Liner: Repaint occurs when visual styles change but layout stays the same.

```css
/* changing color triggers repaint */
div {
  background-color: red;
}
```

## GPU Acceleration : Offload rendering tasks to graphics hardware.

Interview One-Liner: GPU acceleration improves performance for animations and transforms.

```css
/* force GPU acceleration with transform */
div {
  transform: translateZ(0);
}
```

## Stacking Context : Defines how elements are layered.

Interview One-Liner: Stacking context controls z-index and element layering rules.

```css
/* new stacking context created */
div {
  position: relative;
  z-index: 10;
}
```

## Containing Block : Reference box for positioned elements.

Interview One-Liner: Containing block determines where positioned elements are placed.

```css
/* absolute element positioned relative to parent */
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 10px;
  left: 20px;
}
```
