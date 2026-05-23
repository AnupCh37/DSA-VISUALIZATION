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
  recordFrame(frames, [1, 2, 3, 4], [], 'Brute force tries every possibility until a solution is found.', 1);
  recordFrame(frames, [1, 2, 3, 4], [0, 1], 'Compare first and second candidate combinations.', 2);
  recordFrame(frames, [1, 2, 3, 4], [2, 3], 'Continue checking remaining candidate solutions.', 3);
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
