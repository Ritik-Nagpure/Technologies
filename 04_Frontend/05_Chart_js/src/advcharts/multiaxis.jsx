import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);


export default function App() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],

    datasets: [
      {
        type: "bar",
        label: "Revenue",
        data: [100, 200, 150, 300, 250],
        backgroundColor: "#3b82f6",
        yAxisID: "y",
      },

      {
        type: "line",
        label: "Temperature",
        data: [28, 30, 27, 31, 29],
        borderColor: "#ef4444",
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      y: {
        position: "left",
      },

      y1: {
        position: "right",
      },
    },
  };

  return (
    <div className="p-6 bg-gray-900 rounded-2xl">
      <div className="h-100">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
}