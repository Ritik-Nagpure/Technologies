import React from "react";

import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { PolarArea } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function App() {
  const data = {
    labels: ["Design", "Development", "Testing", "DevOps", "Management"],

    datasets: [
      {
        label: "Team Contribution",

        data: [20, 35, 15, 18, 12],

        backgroundColor: [
          "rgba(59,130,246,0.7)",
          "rgba(16,185,129,0.7)",
          "rgba(245,158,11,0.7)",
          "rgba(239,68,68,0.7)",
          "rgba(139,92,246,0.7)",
        ],

        borderColor: "#111827",
        borderWidth: 2,
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

    scales: {
      r: {
        ticks: {
          color: "#9ca3af",
          backdropColor: "transparent",
        },

        grid: {
          color: "rgba(255,255,255,0.08)",
        },

        angleLines: {
          color: "rgba(255,255,255,0.08)",
        },

        pointLabels: {
          color: "#e5e7eb",

          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-2xl p-6">
        <h1 className="text-white text-2xl font-bold mb-6">
          Team Contribution
        </h1>

        <div className="w-full h-112.5">
          <PolarArea data={data} options={options} />
        </div>
      </div>
    </div>
  );
}