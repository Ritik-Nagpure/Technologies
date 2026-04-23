# Core Basics : CSS styles HTML elements to control look and layout.

## Selectors : Targets elements to apply styles.

```css
/* all <p> elements become blue */
p {
  color: blue;
}
/* element with id="main" gets yellow background */
#main {
  background: yellow;
}
/* elements with class="highlight" become bold */
.highlight {
  font-weight: bold;
}
```

## Combinators : Define relationships between selectors.

```css
/* all <p> inside <div> */
div p {
  color: red;
}
/* direct child <p> of <div> */
div > p {
  color: green;
}
/* <p> immediately after <div> */
div + p {
  color: blue;
}
/* all <p> siblings after <div> */
div ~ p {
  color: orange;
}
```

---

  <style> /*This applies line by line so preference matters*/
    /* all <p> inside <div> */
    div p {
      color: red;
    }
    /* direct child <p> of <div> */
    div > p {
      color: green;
    }
       /* all <p> siblings after <div> */
    div ~ p {
          color: orange;
    }
    /* <p> immediately after <div> */
    div + p {
      color: blue;
    } 
  </style>

  <div>
    <p>Direct child paragraph (green)</p>
    <section>
      <p>Nested paragraph inside section (red)</p>
    </section>
  </div>
  <p>This one is immediately after the div (blue)</p>
  <p>This one is also after the div, but not immediate (orange)</p>

---

## Specificity : Priority of selectors (inline > id > class > element).

```html
/* inline style wins over id, class, element */
<p style="color:red">Text</p>
```

## Cascade : Order of rules decides which style wins.

```css
/* later rule overrides earlier one */
p {
  color: blue;
}
/* this wins */
p {
  color: red;
}
```

## Inheritance : Some properties pass from parent to child.

```css
/* children inherit text color from body */
body {
  color: black;
}
```

## Box Model : Element = content + padding + border + margin.

```css
div {
  width: 100px;
  padding: 10px; /* space inside */
  border: 5px solid black; /* outline */
  margin: 20px; /* space outside */
}
```

## Display Property : Defines how elements are shown.

```css
div {
  display: block;
} /* full width */
span {
  display: inline;
} /* flows with text */
nav {
  display: flex;
} /* flexbox layout */
```

## Units : Define sizes.

```css
p {
  font-size: 16px;
} /* px = fixed */
p {
  font-size: 2em;
} /* em = relative to parent font */
p {
  font-size: 1rem;
} /* rem = relative to root font */
div {
  width: 50%;
} /* % = relative to parent */
div {
  height: 50vh;
} /* vh = viewport height */
```

## Colors : Define text/background colors.

```css
h1 {
  color: red;
} /* named color */
p {
  color: #333;
} /* hex code */
div {
  color: rgb(0, 128, 0);
} /* RGB value */
```

## Backgrounds : Control element background.

```css
body {
  background-color: lightblue;
} /* solid color */
div {
  background-image: url("img.png");
} /* image background */
```

## Borders : Outline around elements.

```css
p {
  border: 1px solid black;
} /* 1px solid border */
```

## Margins : Space outside element.

```css
div {
  margin: 20px;
} /* 20px outside space */
```

## Padding : Space inside element, around content.

```css
div {
  padding: 10px;
} /* 10px inside space */
```
