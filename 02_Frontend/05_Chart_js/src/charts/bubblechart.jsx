import React from "react";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bubble } from "react-chartjs-2";

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
        label: "Companies",

        data: [
          { x: 10, y: 20, r: 10 },
          { x: 15, y: 35, r: 15 },
          { x: 25, y: 30, r: 12 },
          { x: 30, y: 50, r: 20 },
          { x: 40, y: 45, r: 18 },
        ],

        backgroundColor: "rgba(59,130,246,0.6)",
        borderColor: "#3b82f6",
        borderWidth: 2,
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
          text: "Employees",
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
          text: "Revenue",
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
          Company Growth
        </h1>

        <div className="w-full h-112.5">
          <Bubble data={data} options={options} />
        </div>
      </div>
    </div>
  );
}