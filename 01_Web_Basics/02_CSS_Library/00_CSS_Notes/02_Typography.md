# Typography & Text : Controls how text looks and behaves.

## Font Properties : Define font family, size, style, weight.

```css
/* set font family */
p {
  font-family: Arial, sans-serif;
}
/* set font size */
h1 {
  font-size: 24px;
}
/* set font style */
em {
  font-style: italic;
}
/* set font weight */
strong {
  font-weight: bold;
}
```

## Text Properties : Control text color and spacing.

```css
/* set text color */
p {
  color: blue;
}
/* set line spacing */
p {
  line-height: 1.5;
}
```

## Line Height : Space between lines of text.

```css
/* increase line spacing */
p {
  line-height: 2;
}
```

## Letter Spacing : Space between letters.

```css
/* widen letter spacing */
h1 {
  letter-spacing: 2px;
}
```

## Word Spacing : Space between words.

```css
/* add extra space between words */
p {
  word-spacing: 5px;
}
```

## Text Alignment : Align text horizontally.

```css
/* center align text */
p {
  text-align: center;
}
/* right align text */
h2 {
  text-align: right;
}
```

## Text Decoration : Add or remove decorations.

```css
/* underline text */
a {
  text-decoration: underline;
}
/* remove underline */
a {
  text-decoration: none;
}
```

## Text Transform : Change text case.

```css
/* uppercase text */
p {
  text-transform: uppercase;
}
/* capitalize first letter of each word */
h1 {
  text-transform: capitalize;
}
```

## White Space : Control how white space is handled.

```css
/* preserve spaces and line breaks */
pre {
  white-space: pre;
}
/* prevent text wrapping */
p {
  white-space: nowrap;
}
```

## Text Overflow : Handle overflowing text.

```css
/* show ellipsis when text overflows */
div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```
