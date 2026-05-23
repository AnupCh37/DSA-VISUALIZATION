// src/types/index.ts
export type Snapshot = {
  step: number;
  arrayState: number[];
  activeIndices: number[];
  sortedIndices: number[];
  currentLine: number;
  explanation: string;
  metadata?: Record<string, string | number | boolean>;
};

export type AlgorithmCategory =
  | 'design-techniques'
  | 'stack-recursion'
  | 'queue'
  | 'linked-list'
  | 'tree'
  | 'graph'
  | 'sorting'
  | 'searching';

export type AlgorithmType =
  | 'brute-force'
  | 'divide-and-conquer'
  | 'greedy-algorithms'
  | 'branch-and-bound'
  | 'backtracking'
  | 'randomized-algorithms'
  | 'recursive-algorithms'
  | 'dynamic-programming'
  | 'stack-push-pop'
  | 'expression-conversion'
  | 'postfix-evaluation'
  | 'prefix-evaluation'
  | 'factorial-recursion'
  | 'fibonacci-recursion'
  | 'tower-of-hanoi'
  | 'linear-queue'
  | 'circular-queue'
  | 'deque'
  | 'priority-queue'
  | 'singly-linked-list'
  | 'doubly-linked-list'
  | 'circular-linked-list'
  | 'binary-tree-traversals'
  | 'bst-insert-search-delete'
  | 'avl-rotations'
  | 'b-tree-insertion'
  | 'red-black-intro'
  | 'huffman-coding'
  | 'adjacency-matrix'
  | 'adjacency-list'
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'floyd-warshall'
  | 'kruskal'
  | 'prim'
  | 'warshall'
  | 'topological-sort'
  | 'bubble-sort'
  | 'insertion-sort'
  | 'selection-sort'
  | 'shell-sort'
  | 'quick-sort'
  | 'merge-sort'
  | 'radix-sort'
  | 'heap-sort'
  | 'sequential-search'
  | 'binary-search'
  | 'hashing'
  | 'hash-table-chaining'
  | 'hash-table-linear-probing'
  | 'hash-table-quadratic-probing'
  | 'hash-table-double-hashing';

export type PlaybackState = 'idle' | 'playing' | 'paused';
