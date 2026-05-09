import React from "react";
import { Chart } from "react-google-charts";

export default function App() {
  const data = [
    ["Category", "Parent", "Value"],
    ["Storage", null, 0],
    ["Images", "Storage", 40],
    ["Videos", "Storage", 30],
    ["Docs", "Storage", 20],
    ["Other", "Storage", 10],
  ];

  return (
    <div className="p-6 bg-gray-900 rounded-2xl">
      <Chart
        chartType="TreeMap"
        width="100%"
        height="400px"
        data={data}
      />
    </div>
  );
}