//🔹 Definition
// Breadth-First Search (BFS) is a graph traversal algorithm that explores all vertices of a graph level by level starting from a source node. It uses a queue to keep track of the next vertex to visit.

// 🔹 Precondition
// Works on graphs or trees (directed/undirected).
// Requires a starting node.
// Graph can be represented using adjacency list or adjacency matrix.

function bfs(graph, start) {
  let visited = new Set();
  let queue = [start];

  visited.add(start);

  while (queue.length > 0) {
    let node = queue.shift(); // dequeue
    console.log(node); // process the node

    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor); // enqueue
      }
    }
  }
}

// Example graph as adjacency list
const graph = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: []
};

bfs(graph, "A"); // Output: A B C D E F
