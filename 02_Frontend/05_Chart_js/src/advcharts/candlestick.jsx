import React, { useEffect, useRef } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  CandlestickController,
  CandlestickElement
);

export default function App() {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current;

    const chart = new ChartJS(ctx, {
      type: "candlestick",

      data: {
        datasets: [
          {
            label: "Stock Price",

            data: [
              {
                x: "Mon",
                o: 100,
                h: 120,
                l: 90,
                c: 110,
              },

              {
                x: "Tue",
                o: 110,
                h: 140,
                l: 100,
                c: 130,
              },

              {
                x: "Wed",
                o: 130,
                h: 150,
                l: 120,
                c: 125,
              },
            ],
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="p-6 bg-gray-900 rounded-2xl">
      <div className="h-[400px]">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}