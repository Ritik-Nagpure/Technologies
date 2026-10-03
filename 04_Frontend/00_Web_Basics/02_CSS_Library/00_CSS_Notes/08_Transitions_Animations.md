# Transitions & Animations : Add smooth effects and motion to elements.
Interview One-Liner: Transitions and animations make style changes visually appealing.

## Transition : Smoothly change property values over time.
Interview One-Liner: Transition defines how property changes happen.

```css
    /* smoothly change background color */
    div {
      transition: background-color 0.5s;
    }
```

## Transition Properties : Control which properties transition.
Interview One-Liner: Transition properties specify what changes are animated.

```css
    /* transition multiple properties */
    div {
      transition-property: width, height;
      transition-duration: 1s;
    }
```

## Timing Functions : Define speed curve of transition.
Interview One-Liner: Timing functions control acceleration of animation.

```css
    /* ease-in starts slow, ends fast */
    div {
      transition: all 1s ease-in;
    }
    /* linear moves at constant speed */
    div {
      transition: all 1s linear;
    }
```

## Delay : Wait before starting transition.
Interview One-Liner: Delay adds a pause before animation begins.

```css
    /* start transition after 2 seconds */
    div {
      transition: opacity 1s ease 2s;
    }
```

## Keyframes : Define stages of an animation.
Interview One-Liner: Keyframes describe how styles change step by step.

```css
    /* fade in animation */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
```

## Animation Properties : Control how keyframes run.
Interview One-Liner: Animation properties set duration, repetition, and behavior.

```css
    /* apply fadeIn animation */
    div {
      animation-name: fadeIn;
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }
```
