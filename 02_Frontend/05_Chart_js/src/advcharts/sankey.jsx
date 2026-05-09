import React from "react";
import { Chart } from "react-google-charts";

export default function App() {
  const data = [
    ["From", "To", "Weight"],
    ["Landing", "Products", 5],
    ["Landing", "Pricing", 3],
    ["Products", "Checkout", 4],
  ];

  return (
    <div className="p-6 bg-gray-900 rounded-2xl">
      <Chart
        chartType="Sankey"
        width="100%"
        height="400px"
        data={data}
      />
    </div>
  );
}