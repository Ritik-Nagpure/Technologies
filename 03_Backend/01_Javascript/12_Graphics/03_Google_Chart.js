/*
From simple line charts to complex hierarchical tree maps, the Google Chart gallery provides a large number of ready-to-use chart types:

Scatter Chart
Line Chart
Bar / Column Chart
Area Chart
Pie Chart
Donut Chart
Org Chart
Map / Geo Chart
*/



google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    // Set Data
    const data = google.visualization.arrayToDataTable([
        ['Contry', 'WTF'],
        ["Meloni", Math.floor(Math.random() * 100)],
        ["Mcron", Math.floor(Math.random() * 100)],
        ["Shakira", Math.floor(Math.random() * 100)],
        ["Joe", Math.floor(Math.random() * 100)],
        ["Leonel", Math.floor(Math.random() * 100)]
    ]);

    // Set Options
    const options = {
        title: 'World Wide Wine Production'
    };

    // Draw
    const chart = new google.visualization.BarChart(document.getElementById('gogleChart'));
    chart.draw(data, options);

}