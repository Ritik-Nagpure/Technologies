import React from "react";
import * as HeatMap from "react-heatmap-grid";

export default function App() {
  const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const yLabels = ["Frontend", "Backend", "Testing"];

  const data = [
    [1, 4, 3, 5, 2],
    [2, 1, 5, 3, 4],
    [3, 2, 4, 1, 5],
  ];

  return (
    <div className="p-6 bg-gray-900 rounded-2xl text-white">
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        data={data}
        cellStyle={(background, value) => ({
          background: `rgba(59,130,246,${value / 5})`,
          fontSize: "12px",
          color: "white",
        })}
        cellRender={(value) => value}
      />
    </div>
  );
}