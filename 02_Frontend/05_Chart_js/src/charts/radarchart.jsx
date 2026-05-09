import React from "react";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function App() {
  const data = {
    labels: [
      "React",
      "Node",
      "CSS",
      "System Design",
      "Testing",
      "DevOps",
    ],

    datasets: [
      {
        label: "Skill Level",

        data: [90, 80, 85, 70, 75, 60],

        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "#3b82f6",

        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",

        pointRadius: 5,

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
      r: {
        min: 0,
        max: 100,

        ticks: {
          color: "#9ca3af",
          backdropColor: "transparent",
          stepSize: 20,
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
          Developer Skills
        </h1>

        <div className="w-full h-112.5">
          <Radar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}