import React from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function App() {
  const data = {
    labels: ["Desktop", "Mobile", "Tablet", "TV"],

    datasets: [
      {
        label: "Users",

        data: [55, 30, 10, 5],

        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
        ],

        borderColor: "#111827",
        borderWidth: 3,

        cutout: "70%",
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
        <h1 className="text-white text-2xl font-bold">
          Device Usage
        </h1>

        <div className="w-full h-100">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
}