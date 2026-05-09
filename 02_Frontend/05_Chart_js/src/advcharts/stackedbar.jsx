import React from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

export default function App() {
    const data = {
        labels: ["Sprint 1", "Sprint 2", "Sprint 3"],

        datasets: [
            {
                label: "Frontend",
                data: [20, 25, 30],
                backgroundColor: "#3b82f6",
            },

            {
                label: "Backend",
                data: [15, 20, 25],
                backgroundColor: "#10b981",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
            x: {
                stacked: true,
            },

            y: {
                stacked: true,
            },
        },
    };

    return (
        <div className="p-6 bg-gray-900 rounded-2xl">
            <div className="h-100">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}