import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);

export default function App() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

    datasets: [
      {
        label: "Users",
        data: [100, 250, 180, 320, 400, 500],

        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.3)",

        tension: 0.4,
        fill: true,

        pointBackgroundColor: "#fff",
        pointBorderColor: "#3b82f6",
        pointRadius: 5,
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
        },
      },
      
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },

        zoom: {
          wheel: {
            enabled: true,
          },

          pinch: {
            enabled: true,
          },

          mode: "x",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#9ca3af",
        },

        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,

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
          Monthly Users
        </h1>

        <div className="w-full h-100">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}