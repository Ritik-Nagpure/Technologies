import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentChart = ({ students }) => {
    const data = {
        labels: students.map(s => s.student_name),
        datasets: [
            {
                label: "Total Score",
                data: students.map(s => s.total),
                backgroundColor: "rgba(59, 130, 246, 0.7)" // Tailwind blue-500
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Student Total Scores" }
        }
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <Bar data={data} options={options} />
        </div>
    );
};

export default StudentChart;
