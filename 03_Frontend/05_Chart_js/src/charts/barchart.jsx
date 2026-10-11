import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function BarChart() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [120, 190, 300, 250, 420, 380],
        backgroundColor: [
          "#3b82f6",
          "#8b5cf6",
          "#06b6d4",
          "#10b981",
          "#f59e0b",
          "#ef4444",
        ],
        borderRadius: 10,
        borderSkipped: false,
        barThickness: 40,
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
            weight: "bold",
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
        ticks: {
          color: "#9ca3af",
          font: {
            size: 12,
          },
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

    interaction: {
      mode: "nearest",
      intersect: true,
    },
  };
const chartRef = useRef();
  return (
    <div className="mt-6 flex justify-center grow">

      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl p-6">

        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">
            Monthly Revenue
          </h1>
        </div>

        {/* Responsive Chart Container */}
        <div className="w-full h-100">
          <Bar
            ref={chartRef}
            data={data}
            options={options}
            onClick={(event) => {
              const element = getElementAtEvent(
                chartRef.current,
                event
              );

              if (!element.length) return;

              const index = element[0].index;

              console.log(data.labels[index]);
            }}
          />
        </div>

      </div>
    </div>
  );
}