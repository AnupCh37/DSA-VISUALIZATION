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

export function generateSequentialSearchTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const working = [...array];
  const target = working[Math.floor(working.length / 3)];

  recordFrame(frames, working, [], `Starting sequential search for value ${target}.`, 1);

  for (let index = 0; index < working.length; index += 1) {
    recordFrame(frames, working, [index], `Checking index ${index} with value ${working[index]}.`, 2);
    if (working[index] === target) {
      recordFrame(frames, working, [index], `Found target ${target} at index ${index}.`, 3);
      return frames;
    }
  }

  recordFrame(frames, working, [], `Value ${target} was not found.`, 4);
  return frames;
}

export function generateBinarySearchTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const sorted = [...array].sort((a, b) => a - b);
  let left = 0;
  let right = sorted.length - 1;
  const target = sorted[Math.floor(sorted.length / 2)];

  recordFrame(frames, sorted, [], `Starting binary search for target ${target}.`, 1);

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    recordFrame(frames, sorted, [left, mid, right], `Inspecting range [${left}, ${right}] and middle value ${sorted[mid]} at index ${mid}.`, 2);
    if (sorted[mid] === target) {
      recordFrame(frames, sorted, [mid], `Found target ${target} at index ${mid}.`, 3);
      return frames;
    }
    if (sorted[mid] < target) {
      left = mid + 1;
      recordFrame(frames, sorted, [left, right], `Target greater than ${sorted[mid]}, discarding left half.`, 4);
    } else {
      right = mid - 1;
      recordFrame(frames, sorted, [left, right], `Target less than ${sorted[mid]}, discarding right half.`, 4);
    }
  }

  recordFrame(frames, sorted, [], `Target ${target} not found in sorted array.`, 5);
  return frames;
}

export function generateHashingTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const buckets = Array.from({ length: 8 }, () => -1);

  const getBucket = (value: number) => value % buckets.length;
  recordFrame(frames, buckets, [], 'Starting hash table insertion for open addressing.', 1);

  array.forEach((value) => {
    let slot = getBucket(value);
    let probeCount = 0;
    while (buckets[slot] !== -1 && probeCount < buckets.length) {
      recordFrame(frames, [...buckets], [slot], `Collision at bucket ${slot} for value ${value}; probing next bucket.`, 2);
      slot = (slot + 1) % buckets.length;
      probeCount += 1;
    }
    if (buckets[slot] === -1) {
      buckets[slot] = value;
      recordFrame(frames, [...buckets], [slot], `Inserted value ${value} at bucket ${slot}.`, 3);
    }
  });

  recordFrame(frames, buckets, [], 'Completed hash table insertion with open addressing.', 4);
  return frames;
}

export function generateHashTableChainingTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const buckets: number[][] = Array.from({ length: 6 }, () => []);

  const recordBuckets = (activeIndices: number[], explanation: string, currentLine: number) => {
    const state = buckets.flatMap((bucket, index) => [index, ...bucket, -1]);
    recordFrame(frames, state, activeIndices, explanation, currentLine);
  };

  array.forEach((value) => {
    const bucket = value % buckets.length;
    recordBuckets([bucket], `Adding value ${value} to chain at bucket ${bucket}.`, 2);
    buckets[bucket].push(value);
    recordBuckets([bucket], `Bucket ${bucket} now contains [${buckets[bucket].join(', ')}].`, 3);
  });

  recordBuckets([], 'Completed hash table chaining insertions.', 4);
  return frames;
}

export function generateHashTableLinearProbingTrace(array: number[]): Snapshot[] {
  return generateHashingTrace(array);
}

export function generateHashTableQuadraticProbingTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const buckets = Array.from({ length: 7 }, () => -1);

  const record = (active: number[], explanation: string, line: number) => recordFrame(frames, [...buckets], active, explanation, line);
  record([], 'Starting quadratic probing insertion.', 1);

  array.forEach((value) => {
    let index = value % buckets.length;
    let i = 0;
    while (buckets[index] !== -1 && i < buckets.length) {
      record([index], `Bucket ${index} occupied for ${value}. Probing i=${i}.`, 2);
      i += 1;
      index = (value + i * i) % buckets.length;
    }
    buckets[index] = value;
    record([index], `Placed ${value} at index ${index}.`, 3);
  });

  record([], 'Completed quadratic probing insertion.', 4);
  return frames;
}

export function generateHashTableDoubleHashingTrace(array: number[]): Snapshot[] {
  const frames: Snapshot[] = [];
  const buckets = Array.from({ length: 9 }, () => -1);

  const hash1 = (value: number) => value % buckets.length;
  const hash2 = (value: number) => 1 + (value % (buckets.length - 2));
  const record = (active: number[], explanation: string, line: number) => recordFrame(frames, [...buckets], active, explanation, line);
  record([], 'Starting double hashing insertion.', 1);

  array.forEach((value) => {
    let index = hash1(value);
    const step = hash2(value);
    let attempt = 0;
    while (buckets[index] !== -1 && attempt < buckets.length) {
      record([index], `Collision at ${index} for ${value}, stepping by ${step}.`, 2);
      attempt += 1;
      index = (hash1(value) + attempt * step) % buckets.length;
    }
    buckets[index] = value;
    record([index], `Inserted ${value} into bucket ${index}.`, 3);
  });

  record([], 'Completed double hashing insertion.', 4);
  return frames;
}
