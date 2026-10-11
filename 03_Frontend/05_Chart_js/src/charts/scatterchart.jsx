import React from "react";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Scatter } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function App() {
  const data = {
    datasets: [
      {
        label: "Students",

        data: [
          { x: 10, y: 20 },
          { x: 15, y: 35 },
          { x: 20, y: 25 },
          { x: 25, y: 50 },
          { x: 30, y: 40 },
          { x: 35, y: 60 },
        ],

        backgroundColor: "#3b82f6",

        pointRadius: 7,
        pointHoverRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",

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

    scales: {
      x: {
        title: {
          display: true,
          text: "Study Hours",
          color: "#e5e7eb",
        },

        ticks: {
          color: "#9ca3af",
        },

        grid: {
          color: "rgba(255,255,255,0.08)",
        },
      },

      y: {
        title: {
          display: true,
          text: "Marks",
          color: "#e5e7eb",
        },

        ticks: {
          color: "#9ca3af",
        },

        grid: {
          color: "rgba(255,255,255,0.08)",
        },
      },
    },
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl p-6">
        <h1 className="text-white text-2xl font-bold mb-6">
          Study vs Marks
        </h1>

        <div className="w-full h-112.5">
          <Scatter data={data} options={options} />
        </div>
      </div>
    </div>
  );
}