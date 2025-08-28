# Vanila CSS or CSS

## 🧾 What Vanilla CSS Includes
- Standard CSS syntax: Selectors, properties, values
- No external dependencies: You write everything yourself
- Full control: You decide how every element looks and behaves
- Browser-native: Runs directly in the browser without compilation

## 🧠 Pros and Cons
|✅ Pros             |	❌ Cons|
|---------------------|------------|
|Total design freedom	            | Can be time-consuming|
|No learning curve for frameworks   |	No built-in components or utilities|
|Lightweight and fast               |	Harder to maintain in large Projects|
|Great for small projects           |	Repetitive code without abstraction|

<br/>

## 🧪 Example: Simple Button in Vanilla CSS

<!-- HTML -->
<button class="my-button">Click Me</button>

<!-- CSS -->
<style>
  .my-button {
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }

  .my-button:hover {
    background-color: #2980b9;
  }
</style>

Vanilla CSS is perfect when you want to learn the fundamentals or build something lightweight and custom.



## Course Index

## 🎯 Foundational Concepts
- Selectors (Universal, Type, Class, ID, Attribute)
- Box Model (margin, border, padding, content)
- Positioning (static, relative, absolute, fixed, sticky)
- Display (block, inline, inline-block, none)
- Units (px, em, rem, %, vh, vw)
- Colors and Backgrounds
- Typography (fonts, sizes, weights, line-height, letter-spacing)
- CSS Variables (custom properties)

## 💡 Intermediate Techniques
- Pseudo-classes (:hover, :focus, :nth-child)
- Pseudo-elements (::before, ::after)
- Specificity and Inheritance
- Flexbox
- Grid Layout
- Transitions and Animations
- Media Queries (responsive design)
- Box-sizing (content-box vs border-box)

## 🧠 Advanced Topics
- CSS Functions (calc(), clamp(), min(), max())
- Custom Scrollbars and Styling Form Elements
- Keyframe Animations
- Advanced Selectors (:not(), :has())
- CSS Layers and Cascade Level
- Container Queries
- Logical Properties (e.g., margin-inline, padding-block)
- Writing Modes (vertical, right-to-left)
- CSS for Dark Mode
 
## ⚙️ Modern Workflow Add-ons
- CSS Preprocessors (Sass, Less)
- Utility-First CSS (e.g., Tailwind)
- ## CSS Modules
  🧪 How It Works
    - The class name card is scoped only to the Card component.
    - When compiled, it becomes something like Card_card__abc123 to avoid global conflicts.
    - You import the styles as an object (styles) and use styles.card to apply them.


  🧩 1. Card.module.css 
  ```css
  .card {
    background-color: lightblue;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
  }
  ```

  ⚛️ 2. Card.jsx
  ```jsx
  import styles from './Card.module.css';

  function Card() {
    return <div className={styles.card}>Hello from CSS Modules!</div>;
  }

  export default Card;
  ```


- PostCSS
  - PostCSS is a tool that processes your CSS with plugins. It can transform, lint, optimize, and extend your CSS
- Web Components styling (::part, ::slotted)

  <table border="1" cellpadding="8" cellspacing="0">
  <thead>
    <tr>
      <th>Technique</th>
      <th>Scope</th>
      <th>Crosses Shadow DOM?</th>
      <th>Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Scoped Styles</td>
      <td>Inside Shadow DOM</td>
      <td>No ❌</td>
      <td>Style internal elements privately</td>
    </tr>
    <tr>
      <td>:host</td>
      <td>Shadow Host</td>
      <td>Yes ✅</td>
      <td>Style the custom element itself</td>
    </tr>
    <tr>
      <td>:host()</td>
      <td>Conditional Host</td>
      <td>Yes ✅</td>
      <td>Style based on attributes or state</td>
    </tr>
    <tr>
      <td>::part()</td>
      <td>Exposed Internal Elements</td>
      <td>Yes ✅</td>
      <td>Style internal parts from outside</td>
    </tr>
    <tr>
      <td>::slotted()</td>
      <td>Slotted Content</td>
      <td>Yes ✅</td>
      <td>Style content passed into slots</td>
    </tr>
    <tr>
      <td>CSS Custom Properties</td>
      <td>Global ↔ Shadow DOM</td>
      <td>Yes ✅</td>
      <td>Theming and dynamic styling</td>
    </tr>
    <tr>
      <td>Imported Styles</td>
      <td>Inside Shadow DOM</td>
      <td>No ❌</td>
      <td>Use external stylesheets internally: <br>
        <code>
          &lt;style&gt;<br>
          &nbsp;&nbsp;@import url('styles.css');<br>
          &lt;/style&gt;
        </code>
      </td>
    </tr>
  </tbody>
</table>


<hr/>

# 📚 Good Practices
- ## 🔄 Reset vs Normalize
  - ✨ CSS Reset
  - Removes all browser default styles.
  - Useful when you want a completely clean slate.

```css
 /* CSS Reset Example */
 * {
   margin: 0;
   padding: 0;
   border: 0;
 }
 ```
- ## 🎯 Normalize.css
  - Preserves useful defaults while fixing inconsistencies.
  - Ideal for cross-browser consistency.

```html
 <!-- Include via CDN -->
 <link rel="stylesheet" href="https://necolas.github.io/normalize.css/atest/- normalize.css">
 ```
 
- ##  ✍️ Using Shorthand Properties Effectively
    - Shorthand reduces clutter and improves readability. 
    - 🧠 Pro Tip: Understand the value order to avoid confusion.
 ```css
 /* Margin shorthand: top-bottom: 10px, left-right: 15px */
 margin: 10px 15px;
 
 /* Font shorthand */
 font: bold 16px/1.5 'Arial', sans-serif;
 
 /* Background shorthand */
- background: #fff url('img.jpg') no-repeat center/cover;
```


- ## 📱 Mobile-First Design
  - Design for small screens first, then scale up with media queries.
  - ✅ Why it matters: Prioritizes mobile performance and user experience.
 
```css
/* Base styles for mobile */
body {
  font-size: 16px;
}

/* Enhancements for larger screens */
@media (min-width: 768px) {
  body {
    font-size: 18px;
  }
}
```

- ## ♿ Accessibility Styling
  - Ensure your design is usable by everyone.
  - 🔍 Use tools like WCAG Contrast Checker for verification.

```css
/* Focus style for keyboard navigation */
button:focus {
  outline: 2px solid #000;
}

/* High contrast for readability */
.text {
  color: #000;
  background-color: #fff;
}

/* Adequate touch target size */
button {
  padding: 12px 16px;
  font-size: 16px;
}
```


- ## 🚀 Performance Optimization
  - Keep your CSS light and fast.
  - ✅ Combine and compress assets, remove unused styles, and avoid deep - selector nesting.

``` bash
# Bash 
# Minify CSS with tools like CSSNano
npx cssnano style.css style.min.css
```
``` css
/* Example: efficient selectors */
.main-title {
  font-size: 2rem;
}

/* Inline critical CSS */
<style>
  body { margin: 0; font-family: sans-serif; }
</style>
```
