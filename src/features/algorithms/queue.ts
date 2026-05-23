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

export function generateLinearQueueTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const queue: (number | -1)[] = Array.from({ length: 8 }, () => -1);
  let tail = 0;

  recordFrame(frames, queue, [], 'Starting linear queue operations.', 1);

  [5, 8, 2].forEach((value) => {
    queue[tail] = value;
    recordFrame(frames, queue, [tail], `Enqueued ${value} at position ${tail}.`, 2);
    tail += 1;
  });

  queue.shift();
  queue.push(-1);
  recordFrame(frames, queue, [0], 'Dequeued one value from the front.', 3);

  queue[tail - 1] = -1;
  recordFrame(frames, queue, [], 'Linear queue cannot wrap; shifted remaining elements left.', 4);

  return frames;
}

export function generateCircularQueueTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const queue: (number | -1)[] = Array.from({ length: 7 }, () => -1);
  let head = 0;
  let tail = 0;

  recordFrame(frames, queue, [], 'Starting circular queue simulation.', 1);

  [3, 6, 9, 1].forEach((value) => {
    queue[tail] = value;
    recordFrame(frames, queue, [tail], `Enqueued ${value} at index ${tail}.`, 2);
    tail = (tail + 1) % queue.length;
  });

  recordFrame(frames, queue, [head], `Dequeued ${queue[head]} from index ${head}.`, 3);
  queue[head] = -1;
  head = (head + 1) % queue.length;

  queue[tail] = 7;
  recordFrame(frames, queue, [tail], `Enqueued 7 at wrapped index ${tail}.`, 4);
  return frames;
}

export function generateDequeTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const deque: number[] = [];

  recordFrame(frames, deque, [], 'Starting deque operations on both ends.', 1);
  deque.unshift(10);
  recordFrame(frames, deque, [0], 'Pushed 10 to the front.', 2);
  deque.push(15);
  recordFrame(frames, deque, [deque.length - 1], 'Pushed 15 to the back.', 3);
  deque.unshift(5);
  recordFrame(frames, deque, [0], 'Pushed 5 to the front.', 4);
  deque.pop();
  recordFrame(frames, deque, [deque.length - 1], 'Popped from the back.', 5);
  deque.shift();
  recordFrame(frames, deque, [0], 'Popped from the front.', 6);

  return frames;
}

export function generatePriorityQueueTrace(_: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const heap: number[] = [];

  const bubbleUp = (index: number) => {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (heap[parent] >= heap[index]) {
        break;
      }
      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      index = parent;
    }
  };

  const record = (active: number[], explanation: string, line: number) => recordFrame(frames, heap, active, explanation, line);
  record([], 'Starting priority queue (max-heap) insertion.', 1);

  [4, 7, 2, 9].forEach((value) => {
    heap.push(value);
    bubbleUp(heap.length - 1);
    record([heap.indexOf(value)], `Inserted ${value} and adjusted heap.`, 2);
  });

  record([], `Priority queue root is ${heap[0]} after heapify.`, 3);
  return frames;
}
