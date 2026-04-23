# Flexbox : A layout model for arranging elements in a flexible way.

## Flex Container : The parent element that holds flex items.

```css
/* make container a flexbox */
div {
  display: flex;
}
```

## Flex Items : The child elements inside a flex container.

```css
/* flex items are direct children of flex container */
div > p {
  flex: 1;
}
```

## Flex Direction : Defines the main axis direction.

```css
/* horizontal row (default) */
div {
  flex-direction: row;
}
/* vertical column */
div {
  flex-direction: column;
}
```

## Flex Wrap : Allows items to wrap onto multiple lines.

```css
/* wrap items to next line */
div {
  flex-wrap: wrap;
}
/* no wrapping */
div {
  flex-wrap: nowrap;
}
```

## Justify Content : Aligns items along the main axis.

```css
/* center items horizontally */
div {
  justify-content: center;
}
/* space between items */
div {
  justify-content: space-between;
}
/* space around items */
div {
  justify-content: space-around;
}
```

## Align Items : Aligns items along the cross axis.

```css
/* align items at start */
div {
  align-items: flex-start;
}
/* align items at center */
div {
  align-items: center;
}
/* stretch items to fill */
div {
  align-items: stretch;
}
```

## Align Content : Aligns multiple lines of flex items.

```css
/* distribute lines evenly */
div {
  align-content: space-between;
}
/* center lines */
div {
  align-content: center;
}
```

## Flex Grow : Defines how items grow relative to others.

```css
/* item grows to fill space */
.item {
  flex-grow: 1;
}
```

## Flex Shrink : Defines how items shrink relative to others.

```css
/* item shrinks when space is tight */
.item {
  flex-shrink: 1;
}
```

## Flex Basis : Defines initial size of an item.

```css
/* item starts at 200px width */
.item {
  flex-basis: 200px;
}
```

## Order : Controls the order of flex items.

```css
/* item appears first */
.item {
  order: 1;
}
/* item appears second */
.item2 {
  order: 2;
}
```

## Gap : Defines spacing between flex items.

```css
/* 20px gap between items */
div {
  gap: 20px;
}
```
