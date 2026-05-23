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

export function generateBruteForceTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const rows = 6;
  const cols = 7;
  const startRow = 1;
  const startCol = 1;
  const endRow = 5;
  const endCol = 3;
  const startIndex = startRow * cols + startCol;
  const endIndex = endRow * cols + endCol;
  const walls = new Set([2, 3, 10, 16, 17, 22, 23, 24, 30, 31, 33]);
  const gridBase = Array(rows * cols).fill(0);

  gridBase[startIndex] = 2;
  gridBase[endIndex] = 3;
  walls.forEach((wall) => {
    gridBase[wall] = 1;
  });

  const visited = new Set<number>();
  const path: number[] = [];

  const buildState = (activeIndex: number | null, pathCells: Set<number> = new Set()) => {
    const state = gridBase.map((value, index) => {
      if (index === startIndex) return 2;
      if (index === endIndex) return 3;
      if (pathCells.has(index)) return 6;
      if (visited.has(index)) return 4;
      return walls.has(index) ? 1 : 0;
    });
    return state;
  };

  const coord = (index: number) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return `[${row}, ${col}]`;
  };

  const directions = [
    { dr: 0, dc: 1, label: 'Right' },
    { dr: 1, dc: 0, label: 'Down' },
    { dr: 0, dc: -1, label: 'Left' },
    { dr: -1, dc: 0, label: 'Up' },
  ];

  const isValid = (row: number, col: number) => row >= 0 && row < rows && col >= 0 && col < cols;

  const record = (index: number | null, explanation: string, line: number) => {
    const state = buildState(index, new Set(path));
    recordFrame(frames, state, index === null ? [] : [index], explanation, line);
  };

  record(null, 'Start at S. The blind DFS brute force robot will always try Right, Down, Left, Up in that order.', 1);

  const dfs = (current: number): boolean => {
    visited.add(current);
    path.push(current);
    record(current, `At ${coord(current)}. Marking it visited and inspecting neighbors in priority order.`, 2);

    if (current === endIndex) {
      record(current, `Reached the target E at ${coord(current)}. Successful path found!`, 4);
      return true;
    }

    const row = Math.floor(current / cols);
    const col = current % cols;

    for (const { dr, dc, label } of directions) {
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (!isValid(nextRow, nextCol)) {
        record(current, `Try ${label} from ${coord(current)} but the grid edge blocks the move.`, 2);
        continue;
      }

      const nextIndex = nextRow * cols + nextCol;
      if (walls.has(nextIndex)) {
        record(current, `Try ${label} to ${coord(nextIndex)} but hit a wall.`, 2);
        continue;
      }
      if (visited.has(nextIndex)) {
        record(current, `Try ${label} to ${coord(nextIndex)} but already visited this cell.`, 2);
        continue;
      }

      record(nextIndex, `Move ${label} to ${coord(nextIndex)} and continue exploring blindly.`, 2);
      if (dfs(nextIndex)) {
        return true;
      }
    }

    path.pop();
    record(current, `No more moves from ${coord(current)}. Backtracking to the previous cell.`, 3);
    return false;
  };

  dfs(startIndex);
  const finalPath = new Set(path);
  const finalState = buildState(null, finalPath);
  record(null, `Final brute force trace complete. The highlighted cells show the exact path taken to reach the end.`, 4);
  frames[frames.length - 1] = {
    ...frames[frames.length - 1],
    arrayState: finalState,
    activeIndices: [],
  };

  return frames;
}

export function generateDivideAndConquerTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  recordFrame(frames, [16, 8, 4, 2], [], 'Divide the problem into smaller subproblems.', 1);
  recordFrame(frames, [16, 8, 4, 2], [0, 1], 'Solve left half independently.', 2);
  recordFrame(frames, [16, 8, 4, 2], [2, 3], 'Solve right half independently.', 3);
  recordFrame(frames, [16, 8, 4, 2], [], 'Combine the solutions into a final result.', 4);
  return frames;
}

export function generateGreedyAlgorithmsTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  recordFrame(frames, [6, 4, 3, 1], [], 'Choose the best immediate option at every step.', 1);
  recordFrame(frames, [6, 4, 3, 1], [0], 'Pick the highest-value choice first.', 2);
  recordFrame(frames, [6, 4, 3, 1], [1], 'Choose the next best remaining option.', 3);
  recordFrame(frames, [6, 4, 3, 1], [], 'Greedy technique constructs a solution incrementally.', 4);
  return frames;
}

export function generateBranchAndBoundTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  recordFrame(frames, [100, 50, 20, 10], [], 'Branch and bound prunes subproblems using cost bounds.', 1);
  recordFrame(frames, [100, 50, 20, 10], [0], 'Discard a branch because it exceeds the current best bound.', 2);
  recordFrame(frames, [100, 50, 20, 10], [1, 2], 'Explore promising branches while bounding the rest.', 3);
  return frames;
}

export function generateBacktrackingTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  recordFrame(frames, [1, 2, 3, 4], [], 'Backtracking explores choices and retreats on failure.', 1);
  recordFrame(frames, [1, 2, 3, 4], [0, 1], 'Make a choice and continue recursively.', 2);
  recordFrame(frames, [1, 2, 3, 4], [1], 'Backtrack from a dead end and try the next option.', 3);
  return frames;
}

export function generateRandomizedAlgorithmsTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  recordFrame(frames, [2, 7, 3, 9], [], 'Randomized algorithms use randomness to guide decisions.', 1);
  recordFrame(frames, [2, 7, 3, 9], [2], 'Sample a random candidate to evaluate.', 2);
  recordFrame(frames, [2, 7, 3, 9], [0, 3], 'Use random choices to converge faster on average.', 3);
  return frames;
}

export function generateRecursiveAlgorithmsTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  recordFrame(frames, [1, 2, 3], [], 'Recursive solutions call themselves on smaller inputs.', 1);
  recordFrame(frames, [1, 2, 3], [0], 'Solve the subproblem for input 2.', 2);
  recordFrame(frames, [1, 2, 3], [], 'Combine subresults to build the final answer.', 3);
  return frames;
}

export function generateDynamicProgrammingTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const memo = [1, 2, -1, -1, -1];

  recordFrame(frames, memo, [], 'Dynamic programming caches intermediate results.', 1);
  memo[2] = 3;
  recordFrame(frames, memo, [2], 'Fill memo table entry for the next subproblem.', 2);
  memo[3] = 5;
  recordFrame(frames, memo, [3], 'Reuse cached results to avoid duplicate computation.', 3);
  return frames;
}
