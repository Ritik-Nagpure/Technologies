/*
Plotly.js is a charting library that comes with over 40 chart types:

Horizontal and Vertical Bar Charts
Pie and Donut Charts
Line Charts
Scatter and Bubble Plots
Equation Plots
3D Charts
Statistical Graphs
SVG Maps
...
Plotly.js is free and open-source under the MIT license. It costs nothing to install and use. You can view the source, report issues and contribute using Github.
*/

const xArray = ["Meloni", "Mcron", "Shakira", "Joe", "Leonel"];
const yArray = [
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100)
];

const data = [{
    x: xArray,
    y: yArray,
    type: "bar",
    orientation: "v",  // h => horizontal
    marker: { color: "rgba(255,150,120,0.8)" }
}];

const layout = { title: "Random Data Chart Production" };

Plotly.newPlot("myPlot", data, layout);