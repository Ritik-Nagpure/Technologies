// 🔹 Definition
// Depth-First Search (DFS) is a graph traversal algorithm that explores a branch as deep as possible before backtracking. It’s like going down one path until you can’t go further, then stepping back and trying another.

// 🔹 Precondition
// Works on graphs or trees (directed/undirected).
// Requires a starting node.
// Graph should be represented as an adjacency list or adjacency matrix.

// 🔹 Working Steps
    // Start from the given source node.
    // Mark the node as visited.
    // Process the node (e.g., print it).
    // For each neighbor of the node:
    // If the neighbor is not visited → recursively apply DFS on it.
    // Backtrack when no unvisited neighbors remain.
    // Continue until all reachable nodes are visited.

function dfs(graph, node, visited = new Set()) {
  if (visited.has(node)) return;

  visited.add(node);
  console.log(node); // process the node

  for (let neighbor of graph[node]) {
    dfs(graph, neighbor, visited);
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

dfs(graph, "A"); // Output: A B D E F C
