/*
Chart.js is an free JavaScript library for making HTML-based charts. It is one of the simplest visualization libraries for JavaScript, and comes with the many built-in chart types:

Scatter Plot
Line Chart
Bar Chart
Pie Chart
Donut Chart
Bubble Chart
Area Chart
Radar Chart
Mixed Chart
*/

const xValues = ["Meloni", "Mcron", "Shakira", "Joe", "Leonel"];
const yValues = [
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100),
    Math.floor(Math.random() * 100)
];

const barColors = ["magenta", "palegreen", "lightblue", "orange", "brown"];

new Chart("myChart", {
    type: "bar",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            data: yValues
        }]
    },
    options: {
        legend: { display: false },
        title: {
            display: true,
            text: "Random Data Chart Production"
        }
    }
}
);