import React from "react";

import "chartjs-adapter-date-fns";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Tooltip,
    Legend
);

export default function App() {
    const data = {
        datasets: [
            {
                label: "Visitors",

                data: [
                    { x: "2026-01-01", y: 100 },
                    { x: "2026-01-02", y: 180 },
                    { x: "2026-01-03", y: 140 },
                    { x: "2026-01-04", y: 250 },
                ],

                borderColor: "#3b82f6",
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        scales: {
            x: {
                type: "time",
                time: {
                    unit: "day",
                },
            },
        },
    };

    return (
        <div className="p-6 bg-gray-900 rounded-2xl">
            <div className="h-100">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
