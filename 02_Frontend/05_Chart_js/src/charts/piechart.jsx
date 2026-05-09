import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function App() {
  const data = {
    labels: ["React", "Vue", "Angular", "Svelte"],

    datasets: [
      {
        label: "Framework Usage",

        data: [45, 25, 20, 10],

        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
        ],

        borderColor: "#111827",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#e5e7eb",
          padding: 20,
          font: {
            size: 14,
          },
        },
      },

      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#d1d5db",
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-2xl p-6">
        <h1 className="text-white text-2xl font-bold mb-6">
          Framework Popularity
        </h1>

        <div className="w-full h-100">
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
}