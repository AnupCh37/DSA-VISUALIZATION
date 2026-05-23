import type { Snapshot } from '../../types';

const recordFrame = (
  frames: Snapshot[],
  arrayState: number[],
  activeIndices: number[],
  explanation: string,
  currentLine: number,
) => {
  frames.push({
    step: frames.length,
    arrayState: [...arrayState],
    activeIndices: [...activeIndices],
    sortedIndices: [],
    currentLine,
    explanation,
  });
};

export function generateAdjacencyMatrixTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const matrix = [0, 1, 0, 1, 0, 1, 0, 0, 1];

  recordFrame(frames, matrix, [], 'Displaying adjacency matrix representation for a small graph.', 1);
  recordFrame(frames, matrix, [1, 4, 7], 'Highlighting edges between connected nodes.', 2);
  recordFrame(frames, matrix, [], 'Each row corresponds to a source node and each column to a target node.', 3);

  return frames;
}

export function generateAdjacencyListTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const list = [1, 2, -1, 0, 2, -1, 1, 3, -1];

  recordFrame(frames, list, [], 'Displaying adjacency list representation for a small graph.', 1);
  recordFrame(frames, list, [0, 3, 6], 'Each sequence of values describes neighbors for one vertex.', 2);
  recordFrame(frames, list, [], 'Non-negative values represent target nodes, -1 separates adjacency groups.', 3);

  return frames;
}

export function generateBFSTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const order = [0, 1, 2, 3, 4];

  recordFrame(frames, order, [0], 'Starting BFS from node 0.', 1);
  recordFrame(frames, order, [0, 1], 'Visited neighbors of node 0.', 2);
  recordFrame(frames, order, [2], 'Continuing BFS with the next frontier node.', 3);
  recordFrame(frames, order, [3, 4], 'Expanded remaining nodes layer by layer.', 4);

  return frames;
}

export function generateDFSTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const order = [0, 1, 3, 4, 2];

  recordFrame(frames, order, [0], 'Starting DFS at node 0.', 1);
  recordFrame(frames, order, [1, 3], 'Exploring deep along one branch.', 2);
  recordFrame(frames, order, [4], 'Backtracking and visiting remaining nodes.', 3);
  recordFrame(frames, order, [2], 'Completed DFS traversal.', 4);

  return frames;
}

export function generateDijkstraTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const distances = [0, 7, 9, 20, 20, 11];

  recordFrame(frames, distances, [0], 'Starting Dijkstra shortest path algorithm with source node 0.', 1);
  recordFrame(frames, distances, [1, 2], 'Relaxed edges from the source and updated tentative distances.', 2);
  recordFrame(frames, distances, [3, 4], 'Selected next closest node and updated remaining distances.', 3);

  return frames;
}

export function generateFloydWarshallTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const matrix = [0, 5, 999, 10, 999, 0, 3, 999, 999, 999, 0, 1, 999, 999, 999, 0];

  recordFrame(frames, matrix, [], 'Starting Floyd-Warshall all-pairs shortest path updates.', 1);
  recordFrame(frames, matrix, [1, 2, 5], 'Considering intermediate node 1 for path relaxation.', 2);
  recordFrame(frames, matrix, [10, 11], 'Finalizing distances after all intermediate nodes.', 3);

  return frames;
}

export function generateKruskalTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const edges = [1, 2, 2, 3, 3, 4, 4, 5];

  recordFrame(frames, edges, [], 'Selecting edges in ascending order of weight for MST.', 1);
  recordFrame(frames, edges, [0, 2], 'Added the smallest edge to the spanning tree.', 2);
  recordFrame(frames, edges, [4, 6], 'Added next valid edge while avoiding cycles.', 3);

  return frames;
}

export function generatePrimTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const distances = [0, 2, 4, 6, 7];

  recordFrame(frames, distances, [], 'Starting Prim’s MST from source node 0.', 1);
  recordFrame(frames, distances, [1], 'Added closest adjacent vertex to the growing MST.', 2);
  recordFrame(frames, distances, [2, 3], 'Updated frontier edge weights and selected the next smallest.', 3);

  return frames;
}

export function generateWarshallTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const matrix = [0, 1, 1, 0, 0, 1, 0, 1, 0];

  recordFrame(frames, matrix, [], 'Starting Warshall transitive closure computation.', 1);
  recordFrame(frames, matrix, [0, 2], 'Checking reachability through an intermediate node.', 2);
  recordFrame(frames, matrix, [], 'Final transitive closure indicates reachable pairs.', 3);

  return frames;
}

export function generateTopologicalSortTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const order = [5, 7, 3, 11, 8, 2, 9, 10, 0, 6, 1, 4];

  recordFrame(frames, order, [], 'Starting topological sort on a directed acyclic graph.', 1);
  recordFrame(frames, order, [0, 1, 2], 'Removed nodes with in-degree zero in topological order.', 2);
  recordFrame(frames, order, [3, 4], 'Processed dependent nodes after their predecessors.', 3);

  return frames;
}
