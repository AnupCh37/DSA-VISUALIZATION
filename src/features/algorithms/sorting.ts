import type { Snapshot } from '../../types';

const cloneSortedIndices = (sortedIndices: number[]): number[] => [...sortedIndices].sort((a, b) => a - b);

const recordFrameFactory = (working: number[], frames: Snapshot[]) => {
  let step = 0;

  return (
    activeIndices: number[],
    sortedIndices: number[],
    explanation: string,
    currentLine: number,
  ): void => {
    frames.push({
      step,
      arrayState: [...working],
      activeIndices: [...activeIndices],
      sortedIndices: cloneSortedIndices(sortedIndices),
      currentLine,
      explanation,
    });
    step += 1;
  };
};

export function generateBubbleSortTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const working = [...array];
  const n = working.length;
  const recordFrame = recordFrameFactory(working, frames);

  recordFrame([], [], 'Initial array loaded for bubble sort.', 1);

  for (let pass = 0; pass < n; pass += 1) {
    let swapped = false;
    const sortedIndices = Array.from({ length: pass }, (_, index) => n - 1 - index);

    for (let i = 0; i < n - pass - 1; i += 1) {
      recordFrame(
        [i, i + 1],
        sortedIndices,
        `Comparing indices ${i} and ${i + 1} with values ${working[i]} and ${working[i + 1]}.`,
        2,
      );

      if (working[i] > working[i + 1]) {
        const firstValue = working[i];
        const secondValue = working[i + 1];
        working[i] = secondValue;
        working[i + 1] = firstValue;
        swapped = true;

        recordFrame(
          [i, i + 1],
          sortedIndices,
          `Swapped values at indices ${i} and ${i + 1}: ${firstValue} ↔ ${secondValue}.`,
          3,
        );
      }
    }

    if (!swapped) {
      break;
    }
  }

  recordFrame([], Array.from({ length: n }, (_, index) => index), 'Bubble sort complete; the array is fully sorted.', 4);

  return frames;
}

export function generateQuickSortTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const working = [...array];
  const fixedIndices: number[] = [];
  let step = 0;

  const recordFrame = (
    activeIndices: number[],
    explanation: string,
    currentLine: number,
  ): void => {
    frames.push({
      step,
      arrayState: [...working],
      activeIndices: [...activeIndices],
      sortedIndices: cloneSortedIndices(fixedIndices),
      currentLine,
      explanation,
    });
    step += 1;
  };

  const swap = (i: number, j: number): void => {
    const temp = working[i];
    working[i] = working[j];
    working[j] = temp;
  };

  const partition = (low: number, high: number): number => {
    const pivotValue = working[high];
    let boundary = low;

    recordFrame(
      [low, high],
      `Pivot selected at index ${high} with value ${pivotValue}. Starting partition on range [${low}, ${high}].`,
      2,
    );

    for (let current = low; current < high; current += 1) {
      recordFrame(
        [current, high],
        `Comparing index ${current} with pivot value ${pivotValue}. Current element is ${working[current]}.`,
        3,
      );

      if (working[current] < pivotValue) {
        if (boundary !== current) {
          swap(boundary, current);
          recordFrame(
            [boundary, current, high],
            `Swapped elements at indices ${boundary} and ${current} because ${working[boundary]} is less than pivot.`,
            3,
          );
        }

        boundary += 1;
      }
    }

    if (boundary !== high) {
      swap(boundary, high);
      recordFrame(
        [boundary, high],
        `Moved pivot from index ${high} to final position ${boundary}.`,
        4,
      );
    } else {
      recordFrame(
        [boundary],
        `Pivot at index ${high} already belongs at final position ${boundary}.`,
        4,
      );
    }

    fixedIndices.push(boundary);
    return boundary;
  };

  const quickSort = (low: number, high: number): void => {
    if (low >= high) {
      return;
    }

    const pivotIndex = partition(low, high);
    recordFrame(
      [pivotIndex],
      `Pivot locked into place at index ${pivotIndex}. Sub-array [${low}, ${high}] is partitioned around pivot value ${working[pivotIndex]}.`,
      4,
    );

    quickSort(low, pivotIndex - 1);
    quickSort(pivotIndex + 1, high);
  };

  recordFrame([], 'Initial array loaded for quick sort.', 1);
  quickSort(0, working.length - 1);
  recordFrame([], 'Quick sort complete; the array is fully sorted.', 5);

  return frames;
}

export function generateSelectionSortTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const working = [...array];
  const n = working.length;
  const recordFrame = recordFrameFactory(working, frames);

  recordFrame([], [], 'Initial array loaded for selection sort.', 1);

  for (let boundary = 0; boundary < n - 1; boundary += 1) {
    let minIndex = boundary;
    recordFrame(
      [boundary],
      Array.from({ length: boundary }, (_, index) => index),
      `Starting selection for position ${boundary}. Current minimum index ${minIndex} with value ${working[minIndex]}.`,
      2,
    );

    for (let cursor = boundary + 1; cursor < n; cursor += 1) {
      recordFrame(
        [minIndex, cursor],
        Array.from({ length: boundary }, (_, index) => index),
        `Comparing current minimum ${working[minIndex]} at index ${minIndex} with element ${working[cursor]} at index ${cursor}.`,
        3,
      );

      if (working[cursor] < working[minIndex]) {
        minIndex = cursor;
        recordFrame(
          [boundary, minIndex],
          Array.from({ length: boundary }, (_, index) => index),
          `New minimum found at index ${minIndex} with value ${working[minIndex]}.`,
          3,
        );
      }
    }

    if (minIndex !== boundary) {
      const firstValue = working[boundary];
      const secondValue = working[minIndex];
      [working[boundary], working[minIndex]] = [working[minIndex], working[boundary]];

      recordFrame(
        [boundary, minIndex],
        Array.from({ length: boundary }, (_, index) => index),
        `Swapped smallest element ${secondValue} into position ${boundary}, moving ${firstValue} to index ${minIndex}.`,
        4,
      );
    }
  }

  recordFrame([], Array.from({ length: n }, (_, index) => index), 'Selection sort complete; the array is fully sorted.', 5);

  return frames;
}

export function generateInsertionSortTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const working = [...array];
  const n = working.length;
  const recordFrame = recordFrameFactory(working, frames);

  recordFrame([], [], 'Initial array loaded for insertion sort.', 1);

  for (let current = 1; current < n; current += 1) {
    const key = working[current];
    let position = current - 1;

    recordFrame(
      [position, current],
      Array.from({ length: current }, (_, index) => index),
      `Inserting value ${key} into sorted segment [0, ${current - 1}].`,
      2,
    );

    while (position >= 0 && working[position] > key) {
      working[position + 1] = working[position];
      recordFrame(
        [position, position + 1],
        Array.from({ length: current }, (_, index) => index),
        `Shifting value ${working[position]} right from index ${position} to ${position + 1}.`,
        3,
      );

      position -= 1;
    }

    working[position + 1] = key;
    recordFrame(
      [position + 1],
      Array.from({ length: current + 1 }, (_, index) => index),
      `Placed key ${key} at index ${position + 1}. Sorted segment is now [0, ${current}].`,
      4,
    );
  }

  recordFrame([], Array.from({ length: n }, (_, index) => index), 'Insertion sort complete; the array is fully sorted.', 5);

  return frames;
}

export function generateMergeSortTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const working = [...array];
  const sortedPositions = new Set<number>();
  const recordFrame = (activeIndices: number[], explanation: string, currentLine: number): void => {
    frames.push({
      step: frames.length,
      arrayState: [...working],
      activeIndices: [...activeIndices],
      sortedIndices: cloneSortedIndices(Array.from(sortedPositions)),
      currentLine,
      explanation,
    });
  };

  recordFrame([], 'Initial array loaded for merge sort.', 1);

  const merge = (low: number, mid: number, high: number): void => {
    const leftSegment = working.slice(low, mid + 1);
    const rightSegment = working.slice(mid + 1, high + 1);
    let leftIndex = 0;
    let rightIndex = 0;
    let writeIndex = low;

    recordFrame(
      [low, mid, high],
      `Merging segments [${low}, ${mid}] and [${mid + 1}, ${high}]. Left segment = [${leftSegment.join(', ')}], right segment = [${rightSegment.join(', ')}].`,
      2,
    );

    while (leftIndex < leftSegment.length && rightIndex < rightSegment.length) {
      recordFrame(
        [writeIndex, low + leftIndex, mid + 1 + rightIndex],
        `Comparing left value ${leftSegment[leftIndex]} and right value ${rightSegment[rightIndex]} to decide next placement.`,
        3,
      );

      if (leftSegment[leftIndex] <= rightSegment[rightIndex]) {
        working[writeIndex] = leftSegment[leftIndex];
        leftIndex += 1;
      } else {
        working[writeIndex] = rightSegment[rightIndex];
        rightIndex += 1;
      }

      recordFrame(
        [writeIndex],
        `Wrote value ${working[writeIndex]} into index ${writeIndex}.`,
        4,
      );

      writeIndex += 1;
    }

    while (leftIndex < leftSegment.length) {
      working[writeIndex] = leftSegment[leftIndex];
      recordFrame(
        [writeIndex],
        `Draining remaining left segment value ${leftSegment[leftIndex]} into index ${writeIndex}.`,
        4,
      );
      leftIndex += 1;
      writeIndex += 1;
    }

    while (rightIndex < rightSegment.length) {
      working[writeIndex] = rightSegment[rightIndex];
      recordFrame(
        [writeIndex],
        `Draining remaining right segment value ${rightSegment[rightIndex]} into index ${writeIndex}.`,
        4,
      );
      rightIndex += 1;
      writeIndex += 1;
    }

    for (let position = low; position <= high; position += 1) {
      sortedPositions.add(position);
    }

    recordFrame(
      [low, high],
      `Completed merge for range [${low}, ${high}]. This segment is now fully ordered.`,
      5,
    );
  };

  const mergeSort = (low: number, high: number): void => {
    if (low >= high) {
      return;
    }

    const mid = Math.floor((low + high) / 2);
    recordFrame(
      [low, mid, high],
      `Splitting range [${low}, ${high}] at midpoint ${mid}.`,
      2,
    );

    mergeSort(low, mid);
    mergeSort(mid + 1, high);
    merge(low, mid, high);
  };

  mergeSort(0, working.length - 1);
  recordFrame([], 'Merge sort complete; the array is fully sorted.', 6);

  return frames;
}

export function generateHeapSortTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const working = [...array];
  const n = working.length;
  const sortedIndices: number[] = [];
  const recordFrame = (activeIndices: number[], explanation: string, currentLine: number): void => {
    frames.push({
      step: frames.length,
      arrayState: [...working],
      activeIndices: [...activeIndices],
      sortedIndices: cloneSortedIndices(sortedIndices),
      currentLine,
      explanation,
    });
  };

  const heapify = (root: number, heapSize: number): void => {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < heapSize) {
      recordFrame(
        [root, left],
        `Comparing parent ${working[root]} at index ${root} with left child ${working[left]} at index ${left}.`,
        2,
      );
      if (working[left] > working[largest]) {
        largest = left;
      }
    }

    if (right < heapSize) {
      recordFrame(
        [largest, right],
        `Comparing current largest ${working[largest]} with right child ${working[right]} at index ${right}.`,
        2,
      );
      if (working[right] > working[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      [working[root], working[largest]] = [working[largest], working[root]];
      recordFrame(
        [root, largest],
        `Swapped parent and child to maintain max-heap property: ${working[largest]} moves to index ${largest} and ${working[root]} moves to index ${root}.`,
        3,
      );
      heapify(largest, heapSize);
    }
  };

  recordFrame([], 'Initial array loaded for heap sort.', 1);

  for (let start = Math.floor(n / 2) - 1; start >= 0; start -= 1) {
    recordFrame([start], `Heapifying subtree rooted at index ${start}.`, 2);
    heapify(start, n);
  }

  for (let end = n - 1; end > 0; end -= 1) {
    [working[0], working[end]] = [working[end], working[0]];
    sortedIndices.push(end);
    recordFrame(
      [0, end],
      `Moved current max element ${working[end]} to sorted position ${end}.`,
      4,
    );
    heapify(0, end);
  }

  sortedIndices.push(0);
  recordFrame([], 'Heap sort complete; the array is fully sorted.', 5);

  return frames;
}

export function generateShellSortTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const working = [...array];
  const n = working.length;
  const recordFrame = recordFrameFactory(working, frames);
  recordFrame([], [], 'Initial array loaded for shell sort.', 1);

  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i += 1) {
      const temp = working[i];
      let j = i;
      while (j >= gap && working[j - gap] > temp) {
        working[j] = working[j - gap];
        recordFrame([j - gap, j], [], `Shifting value ${working[j]} from index ${j - gap} to ${j}.`, 2);
        j -= gap;
      }
      working[j] = temp;
      recordFrame([j], [], `Placed ${temp} at index ${j} with gap ${gap}.`, 3);
    }
    gap = Math.floor(gap / 2);
  }

  recordFrame([], Array.from({ length: n }, (_, index) => index), 'Shell sort complete; the array is gap-sorted and finalized.', 4);
  return frames;
}

export function generateRadixSortTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const working = [...array];
  const buckets: number[][] = Array.from({ length: 10 }, () => []);
  const maxValue = Math.max(...working, 0);
  let digit = 1;
  const record = (activeIndices: number[], explanation: string, currentLine: number) => {
    frames.push({
      step: frames.length,
      arrayState: [...working],
      activeIndices: [...activeIndices],
      sortedIndices: [],
      currentLine,
      explanation,
    });
  };

  record([], 'Starting radix sort by digit buckets.', 1);

  while (digit <= maxValue) {
    buckets.forEach((bucket) => bucket.splice(0, bucket.length));
    working.forEach((value) => {
      const bucketIndex = Math.floor((value / digit) % 10);
      buckets[bucketIndex].push(value);
    });

    const flattened = buckets.flat();
    for (let i = 0; i < working.length; i += 1) {
      working[i] = flattened[i];
      record([i], `Placed value ${working[i]} into position ${i} after digit ${digit}.`, 2);
    }

    digit *= 10;
    record([], `Completed pass for digit ${digit / 10}.`, 3);
  }

  record([], 'Radix sort complete.', 4);
  return frames;
}

export function generateBinarySearchTrace(array: number[]): Snapshot[] {
  const sorted = [...array].sort((a, b) => a - b);
  const frames: Snapshot[] = [];
  const n = sorted.length;
  const target = sorted[Math.floor(n / 2)];
  let left = 0;
  let right = n - 1;
  let step = 0;

  const recordFrame = (activeIndices: number[], explanation: string, currentLine: number): void => {
    frames.push({
      step,
      arrayState: [...sorted],
      activeIndices: [...activeIndices],
      sortedIndices: Array.from({ length: n }, (_, index) => index),
      currentLine,
      explanation,
    });
    step += 1;
  };

  recordFrame([], `Initial sorted array loaded for binary search. Target value is ${target}.`, 1);

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    recordFrame(
      [left, mid, right],
      `Checking middle index ${mid} with value ${sorted[mid]} against target ${target}.`,
      2,
    );

    if (sorted[mid] === target) {
      recordFrame(
        [mid],
        `Target ${target} found at index ${mid}.`,
        3,
      );
      return frames;
    }

    if (sorted[mid] < target) {
      left = mid + 1;
      recordFrame(
        [left, right],
        `Target is greater than middle value. Narrowing search to range [${left}, ${right}].`,
        4,
      );
    } else {
      right = mid - 1;
      recordFrame(
        [left, right],
        `Target is less than middle value. Narrowing search to range [${left}, ${right}].`,
        4,
      );
    }
  }

  recordFrame([], `Target ${target} was not found in the array.`, 5);
  return frames;
}
