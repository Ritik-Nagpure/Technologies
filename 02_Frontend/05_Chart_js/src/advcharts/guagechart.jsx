import React from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip
);

export default function App() {
  const value = 75;

  const data = {
    datasets: [
      {
        data: [value, 100 - value],

        backgroundColor: [
          "#10b981",
          "rgba(255,255,255,0.1)",
        ],

        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  const options = {
    rotation: -90,
    circumference: 180,
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="p-6 bg-gray-900 rounded-2xl">
      <div className="relative h-62.5">
        <Doughnut data={data} options={options} />

        <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
          {value}%
        </div>
      </div>
    </div>
  );
}