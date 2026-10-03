import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function App() {
  const data = {
    labels: ["React", "Vue", "Angular", "Svelte"],

    datasets: [
      {
        label: "Popularity",
        data: [95, 70, 60, 40],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="p-6 bg-gray-900 rounded-2xl">
      <div className="h-100">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}