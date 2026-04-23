## Responsive Design : Techniques to make websites adapt to different devices.

## Media Queries : Apply styles based on device conditions.
The @media rule in CSS is used to apply styles conditionally based on the device type, screen size, orientation, or other media features—making it the foundation of responsive web design.
```css
    /* apply styles when screen width is 600px or less */
    @media (max-width: 600px) {
      body {
        background-color: lightblue;
      }
    }
```

## Breakpoints : Specific screen widths where layout changes.
```css
    /* breakpoint at 768px for tablets */
    @media (max-width: 768px) {
      div {
        font-size: 14px;
      }
    }
    /* breakpoint at 1024px for desktops */
    @media (max-width: 1024px) {
      div {
        font-size: 16px;
      }
    }
```

## Mobile First Design : Start with mobile styles, then scale up.
```css
    /* default mobile styles */
    body {
      font-size: 14px;
    }
    /* larger screens override */
    @media (min-width: 768px) {
      body {
        font-size: 16px;
      }
    }
```

## Fluid Layouts : Use relative units for flexible design.
usually means using relative units so the design adapts to the viewport.
```css
    /* width adjusts with parent */
    div {
      width: 80%;
    }
    /* font size scales with viewport */
    h1 {
      font-size: 5vw;
    }
```

## Viewport Meta : Control how page scales on mobile devices.
 The portion of a web page that is currently visible to the user.

```html
    <!-- set viewport for responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
```
- CSS Viewport Units

| Unit  | Definition                          | Example Usage       | Result Description                  |
|-------|-------------------------------------|---------------------|-------------------------------------|
| **vh** | 1% of viewport height               | `height: 100vh;`    | Element fills full viewport height  |
| **vw** | 1% of viewport width                | `width: 50vw;`      | Element fills half viewport width   |
| **vmin** | 1% of the smaller dimension (width or height) | `font-size: 5vmin;` | Text scales with smaller side       |
| **vmax** | 1% of the larger dimension (width or height) | `width: 50vmax;`    | Element scales with larger side     |
| **%**  | Relative to parent element size     | `width: 50%;`       | Half the width of parent container  |
| **px** | Absolute pixel unit (device pixels) | `margin: 20px;`     | Fixed spacing regardless of screen  |

