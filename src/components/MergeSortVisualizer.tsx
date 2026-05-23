import React, { useEffect, useRef, useState } from 'react';

type Frame = {
  levels: number[][][];
  highlight?: { type: 'split' | 'compare' | 'merge'; depth: number; indices?: number[] };
  explanation: string;
};

const randomArray = () => [5, 2, 8, 1, 9, 3, 7, 4];

const cloneLevels = (levels: number[][][]) => levels.map((level) => level.map((node) => [...node]));

const makeLevels = (arr: number[]) => [
  [arr.slice()],
  [arr.slice(0, 4), arr.slice(4)],
  [arr.slice(0, 2), arr.slice(2, 4), arr.slice(4, 6), arr.slice(6, 8)],
  arr.map((n) => [n]),
];

export default function MergeSortVisualizer(): React.ReactElement {
  const [array, setArray] = useState<number[]>(randomArray);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<number | null>(null);

  const recordFrame = (
    target: Frame[],
    levels: number[][][],
    explanation: string,
    highlight?: Frame['highlight'],
  ) => {
    target.push({ levels: cloneLevels(levels), explanation, highlight });
  };

  useEffect(() => {
    const buildFrames = () => {
      const target: Frame[] = [];
      const levels = makeLevels(array);

      recordFrame(target, levels, 'Initial array. Divide the problem into halves to form the tree.');

      const aux = array.slice();

      const mergeSort = (start: number, end: number, depth: number): number[] => {
        if (end - start <= 1) {
          recordFrame(target, levels, `Reached base case [${start}, ${end}) with ${aux[start]}.`, {
            type: 'split',
            depth,
          });
          return [aux[start]];
        }

        const mid = Math.floor((start + end) / 2);
        recordFrame(target, levels, `Split [${start}, ${end}) into [${start}, ${mid}) and [${mid}, ${end}).`, {
          type: 'split',
          depth,
        });

        const left = mergeSort(start, mid, depth + 1);
        const right = mergeSort(mid, end, depth + 1);

        let i = 0;
        let j = 0;
        const merged: number[] = [];

        while (i < left.length && j < right.length) {
          recordFrame(target, levels, `Compare ${left[i]} and ${right[j]}.`, {
            type: 'compare',
            depth,
            indices: [start + i, mid + j],
          });
          if (left[i] <= right[j]) merged.push(left[i++]);
          else merged.push(right[j++]);
        }

        while (i < left.length) merged.push(left[i++]);
        while (j < right.length) merged.push(right[j++]);

        for (let k = 0; k < merged.length; k += 1) {
          aux[start + k] = merged[k];
        }

        if (depth === 0) {
          levels[0][0] = merged.slice();
        } else if (depth === 1) {
          levels[1][start === 0 ? 0 : 1] = merged.slice();
        } else if (depth === 2) {
          levels[2][start / 2] = merged.slice();
        }

        recordFrame(target, levels, `Merged [${start}, ${end}) into sorted subarray.`, {
          type: 'merge',
          depth,
        });
        return merged;
      };

      mergeSort(0, 8, 0);
      recordFrame(target, levels, 'Merge sort complete: the full array is sorted.', {
        type: 'merge',
        depth: 0,
      });
      return target;
    };

    setFrames(buildFrames());
    setFrameIndex(0);
    setPlaying(false);
  }, [array]);

  useEffect(() => {
    if (!playing) return undefined;
    timerRef.current = window.setTimeout(() => {
      setFrameIndex((current) => {
        const next = Math.min(frames.length - 1, current + 1);
        if (next === frames.length - 1) setPlaying(false);
        return next;
      });
    }, Math.max(60, speed));

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [playing, speed, frames.length]);

  const handleStart = () => {
    setFrameIndex(0);
    setPlaying(true);
  };

  const handleRegenerate = () => setArray(randomArray());

  const currentFrame = frames[frameIndex] ?? frames[0] ?? { levels: makeLevels(array), explanation: '', highlight: undefined };

  return (
    <div className="p-6 bg-slate-50 rounded-3xl shadow-xl max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-sm text-indigo-600 uppercase tracking-[0.24em]">Divide & Conquer</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Merge Sort Tree Visualizer</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 max-w-2xl">
            Watch the array split into smaller independent halves and merge back into a sorted whole.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleStart}
            disabled={playing}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Start Merge Sort
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={playing}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300"
          >
            Regenerate Array
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="mb-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-slate-700">Animation speed</span>
            <span className="text-sm font-medium text-slate-500">{speed} ms</span>
          </div>
          <input
            type="range"
            min={60}
            max={1200}
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="mt-3 w-full accent-indigo-600"
          />
        </div>

        <div className="space-y-6">
          {currentFrame.levels.map((level, levelIndex) => (
            <div key={levelIndex} className="flex items-start gap-4">
              <div className="w-24 text-right text-sm font-semibold text-slate-500">Level {levelIndex + 1}</div>
              <div className="flex flex-wrap gap-3">
                {level.map((segment, segmentIndex) => {
                  const isMergeHighlight = currentFrame.highlight?.type === 'merge' && currentFrame.highlight.depth === levelIndex;
                  const containerClasses = `rounded-3xl border border-slate-200 p-3 ${isMergeHighlight ? 'bg-emerald-100' : 'bg-slate-50'}`;
                  return (
                    <div key={`${levelIndex}-${segmentIndex}`} className={containerClasses}>
                      <div className="flex gap-2">
                        {segment.map((value, itemIndex) => {
                          const absoluteIndex = segmentIndex * (8 / level.length) + itemIndex;
                          const isCompareHighlight = currentFrame.highlight?.type === 'compare' && currentFrame.highlight.indices?.includes(absoluteIndex);
                          return (
                            <div
                              key={`${levelIndex}-${segmentIndex}-${itemIndex}`}
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-semibold transition ${
                                isCompareHighlight
                                  ? 'border-amber-400 bg-amber-200 text-slate-900'
                                  : 'border-slate-300 bg-white text-slate-900'
                              }`}
                            >
                              {value}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Step {frameIndex + 1} / {frames.length}</div>
          <p className="mt-2">{currentFrame.explanation}</p>
        </div>
      </div>
    </div>
  );
}
