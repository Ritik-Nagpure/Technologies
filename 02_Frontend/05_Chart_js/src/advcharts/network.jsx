import React from "react";
import ForceGraph2D from "react-force-graph";

export default function App() {
  const data = {
    nodes: [
      { id: "React" },
      { id: "Node" },
      { id: "MongoDB" },
    ],

    links: [
      {
        source: "React",
        target: "Node",
      },
      {
        source: "Node",
        target: "MongoDB",
      },
    ],
  };

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <ForceGraph2D
        graphData={data}
        width={900}
        height={500}
      />
    </div>
  );
}