## Performance & Architecture : Techniques to organize and optimize CSS.

Interview One-Liner: Performance and architecture ensure CSS is scalable, maintainable, and efficient.

## CSS Preprocessors (SASS, LESS) : Extend CSS with variables, nesting, and functions.

Interview One-Liner: Preprocessors add programming features to CSS for better workflow.

```css
/_ SASS example with variable _/
$main-color: blue;

    div {
      color: $main-color;
      padding: 10px;
    }
```

## BEM Methodology : Block, Element, Modifier naming convention.

Interview One-Liner: BEM ensures consistent, readable, and scalable class names.

```css
/* block */
.card {
}
/* element */
.card__title {
}
/* modifier */
.card--highlighted {
}
```

## Utility-first CSS : Small classes for single-purpose styling.

Interview One-Liner: Utility-first CSS uses atomic classes to build UI quickly.

```css
/* utility classes */
.text-center {
  text-align: center;
}
.mt-4 {
  margin-top: 1rem;
}
.bg-blue {
  background-color: blue;
}
```

## CSS Modules : Scoped CSS for components.

Interview One-Liner: CSS Modules prevent style conflicts by scoping classes locally.

```css
    /* styles.module.css */
    .title {
      color: red;
    }
    /* usage in component */
    <h1 className={styles.title}>Hello</h1>
```

## Atomic CSS : One class per property for maximum reusability.

Interview One-Liner: Atomic CSS breaks styles into single-purpose classes.

```css
/* atomic classes */
.c-red {
  color: red;
}
.fs-16 {
  font-size: 16px;
}
.m-10 {
  margin: 10px;
}
```

## Critical CSS : Inline essential styles for faster rendering.

Interview One-Liner: Critical CSS improves performance by loading above-the-fold styles first.

```html
<!-- inline critical CSS in head -->
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
  }
  header {
    background: #333;
    color: white;
  }
</style>
```