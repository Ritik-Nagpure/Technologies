# SASS Project Overview and Learning Guide

This project demonstrates the use of SASS (Syntactically Awesome Style Sheets) to create a modular, maintainable, and scalable CSS codebase. Below is an explanation of the folder structure, the SASS features used, and a guide to SASS concepts not yet covered in this project.

## Folder Structure

- `scss/` — Contains all SASS source files (partials and main file)
  - `_config.scss` — Variables, functions, and mixins for theme and utility
  - `_buttons.scss` — Button styles using placeholders and mixins
  - `_utilities.scss` — Utility classes for spacing and containers
  - `_mobile.scss` — Responsive styles for mobile devices
  - `style.scss` — Main SASS file that imports/uses all partials
- `css/` — Compiled CSS output
  - `index.css` — Compiled CSS file
  - `index.css.map` — Source map for debugging
- `index.html` — HTML file using the compiled CSS

---

## SASS Features Used in This Project

### 1. **Variables**
Defined in `_config.scss` (e.g., `$primary-color`, `$font-stack`).

### 2. **Nesting**
Selectors are nested for better readability (e.g., `.showcase nav ul li a`).

### 3. **Partials and Imports**
Files starting with `_` are partials. The main `style.scss` uses `@use` to include them.

### 4. **Mixins**
Reusable blocks of code, e.g., `@mixin set-background($color)` in `_config.scss`.

### 5. **Functions**
Custom SASS functions like `set-text-color($color)` to determine text color based on background.

### 6. **Placeholders**
`%btn` in `_buttons.scss` is a placeholder selector, extended with `@extend` in button classes.

### 7. **Loops**
`@each` loop in `_utilities.scss` generates multiple spacing utility classes.

### 8. **Responsive Design**
Media queries in `_mobile.scss` for mobile responsiveness.

---

## SASS Concepts Not Yet Used (and How to Use Them)

### 1. **Inheritance with `@extend` (beyond placeholders)**
You can extend regular classes, not just placeholders, to share styles.

### 2. **`@forward` and `@import`**
- `@forward` is used in SASS modules to re-export styles from one file to another.
- `@import` is the old way to include files; `@use` and `@forward` are preferred in modern SASS.

### 3. **Maps and Advanced Data Structures**
SASS maps allow you to store key-value pairs, useful for themes or breakpoints.
```scss
$theme-colors: (
  'primary': #0e6cff,
  'secondary': #ff8700,
  'light': #f4f4f4
);

.button {
  @each $name, $color in $theme-colors {
    &-#{$name} {
      background: $color;
    }
  }
}
```

### 4. **Conditionals and Advanced Logic**
SASS supports `@if`, `@else if`, and `@while` for more complex logic.

### 5. **Built-in SASS Functions**
You can use functions like `darken()`, `lighten()`, `map-get()`, `str-replace()`, etc.

### 6. **Error Handling**
Use `@error`, `@warn`, and `@debug` for debugging and validation in SASS code.

---

## Example: Using a Map and `@each` for Theming
```scss
$themes: (
  light: (
    bg: #fff,
    text: #222
  ),
  dark: (
    bg: #222,
    text: #fff
  )
);

@each $name, $theme in $themes {
  .theme-#{$name} {
    background: map-get($theme, bg);
    color: map-get($theme, text);
  }
}
```

---

## Summary
This project covers most core SASS features: variables, nesting, mixins, functions, placeholders, loops, and responsive design. To deepen your SASS knowledge, try experimenting with maps, advanced logic, and the module system (`@use`, `@forward`).

For more, visit the [SASS official documentation](https://sass-lang.com/guide).
