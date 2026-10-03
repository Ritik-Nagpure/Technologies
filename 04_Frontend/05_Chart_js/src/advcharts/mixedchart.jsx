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
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],

    datasets: [
      {
        type: "bar",
        label: "Revenue",
        data: [120, 200, 170, 300, 250],
        backgroundColor: "rgba(59,130,246,0.7)",
      },

      {
        type: "line",
        label: "Profit",
        data: [30, 60, 40, 90, 70],
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="p-6 bg-gray-900 rounded-2xl">
      <div className="h-100">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
}