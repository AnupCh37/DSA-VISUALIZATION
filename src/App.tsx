import { useEffect, useMemo } from 'react';
import type { AlgorithmType } from './types';
import { useVisualizer } from './context/VisualizerContext';
import { algorithmGenerators, algorithmGroups } from './features/algorithms';
import { useAnimationEngine } from './hooks/useAnimationEngine';
import './App.css';

const defaultArray = [12, 4, 18, 7, 9, 3, 14, 1, 22, 16];

const algorithmUseCases: Record<AlgorithmType, string> = {
  'brute-force': 'A brute force grid search that behaves like an uninformed DFS robot: explore blindly in the order Right, Down, Left, Up, backtrack when trapped, and only stop when the target is found.',
  'divide-and-conquer': 'Used in merge sort, quick sort, and large problem breakdowns where subproblems are solved independently.',
  'greedy-algorithms': 'Used in interval scheduling, coin change heuristics, and anytime a locally optimal choice is effective.',
  'branch-and-bound': 'Used for optimization tasks like knapsack, TSP, and pruning states that cannot beat the current best.',
  'backtracking': 'Used in N-queens, sudoku, and constraint-search problems where you explore choices and backtrack on failure.',
  'randomized-algorithms': 'Used in randomized quickselect, hashing, and algorithms where probability gives average-case speed.',
  'recursive-algorithms': 'Used in tree traversals, divide-and-conquer recurrence, and any self-similar recursive logic.',
  'dynamic-programming': 'Used in knapsack, edit distance, and memoized solutions that reuse computed subresults.',
  'stack-push-pop': 'Used for undo history, expression evaluation, and runtime call stack tracking.',
  'expression-conversion': 'Used by compilers and calculators to convert infix expressions into postfix notation.',
  'postfix-evaluation': 'Used to evaluate arithmetic expressions efficiently using a stack-based interpreter.',
  'prefix-evaluation': 'Used in calculator logic and expression parsing when prefix notation is provided.',
  'factorial-recursion': 'A classic recursion example used to teach call stacks and base cases.',
  'fibonacci-recursion': 'A teaching example for recursion branching and exponential growth in call trees.',
  'tower-of-hanoi': 'Used to illustrate recursive state movement and transfer between three pegs.',
  'linear-queue': 'Used for simple FIFO queues in print servers, task scheduling, and buffered input.',
  'circular-queue': 'Used for fixed-size ring buffers and hardware queue wrapping.',
  'deque': 'Used for sliding windows, double-ended buffers, and flexible insertion/removal at both ends.',
  'priority-queue': 'Used for Dijkstra, event simulation, and scheduling by priority.',
  'singly-linked-list': 'Used when frequent head insertions and sequential traversal are required.',
  'doubly-linked-list': 'Used for back-and-forth traversal and undo/redo history.',
  'circular-linked-list': 'Used for round-robin scheduling and cyclic buffer navigation.',
  'binary-tree-traversals': 'Used for tree searching, expression evaluation, and depth-first exploration.',
  'bst-insert-search-delete': 'Used in ordered maps and search trees for fast lookups and updates.',
  'avl-rotations': 'Used to keep binary trees balanced so operations remain O(log n).',
  'b-tree-insertion': 'Used in databases and file systems for disk-friendly indexing.',
  'red-black-intro': 'Used in balanced map implementations like Java TreeMap and C++ std::map.',
  'huffman-coding': 'Used in data compression like ZIP and JPEG to build efficient prefix codes.',
  'adjacency-matrix': 'Used to represent dense graphs and check edge existence quickly.',
  'adjacency-list': 'Used to store large sparse graphs efficiently for traversal.',
  'bfs': 'Used for shortest path in unweighted graphs, level-order search, and social network reachability.',
  'dfs': 'Used for cycle detection, path finding, and exhaustive graph exploration.',
  'dijkstra': 'Used for shortest-path routing on weighted graphs with non-negative weights.',
  'floyd-warshall': 'Used for all-pairs shortest paths in dense graphs.',
  'kruskal': 'Used to build minimum spanning trees in network design and clustering.',
  'prim': 'Used to grow a minimum spanning tree from a starting vertex.',
  'warshall': 'Used to compute reachability and transitive closure in directed graphs.',
  'topological-sort': 'Used for build ordering, task scheduling, and dependency resolution.',
  'bubble-sort': 'A teaching-friendly sort used for tiny arrays and conceptual demos.',
  'insertion-sort': 'Used for mostly-sorted data and small arrays where low overhead matters.',
  'selection-sort': 'A simple in-place sort useful for constrained-memory scenarios.',
  'shell-sort': 'Used to accelerate insertion sort on medium-sized arrays using gap sequences.',
  'quick-sort': 'A fast general-purpose sort used in many standard libraries.',
  'merge-sort': 'A stable sort used for predictable O(n log n) performance on large arrays.',
  'radix-sort': 'Used for sorting integers and fixed-length keys by digit passes.',
  'heap-sort': 'Used for in-place sorting with worst-case O(n log n) time and low extra memory.',
  'sequential-search': 'Used for unsorted data and small lists when simplicity is best.',
  'binary-search': 'Used for fast lookup in sorted arrays.',
  'hashing': 'Used to store and retrieve values quickly using hash functions.',
  'hash-table-chaining': 'Used to handle collisions by storing multiple items in each bucket.',
  'hash-table-linear-probing': 'Used to resolve collisions by scanning sequential slots.',
  'hash-table-quadratic-probing': 'Used to reduce clustering by probing quadratically.',
  'hash-table-double-hashing': 'Used to spread collisions using a second hash function.',
};

const shapeByCategory: Record<string, 'array' | 'stack' | 'queue' | 'list' | 'tree' | 'graph' | 'process'> = {
  'design-techniques': 'process',
  'stack-recursion': 'stack',
  queue: 'queue',
  'linked-list': 'list',
  tree: 'tree',
  graph: 'graph',
  sorting: 'array',
  searching: 'array',
};

const buildTreeLevels = (values: number[]) => {
  const levels: number[][] = [];
  let index = 0;
  let width = 1;

  while (index < values.length) {
    levels.push(values.slice(index, index + width));
    index += width;
    width *= 2;
  }

  return levels;
};

function App() {
  const {
    currentAlgorithm,
    playbackState,
    currentStep,
    history,
    play,
    pause,
    stepForward,
    stepBackward,
    setAlgorithm,
    loadHistory,
  } = useVisualizer();

  useAnimationEngine();

  useEffect(() => {
    const generator = algorithmGenerators[currentAlgorithm];
    loadHistory(generator(defaultArray));
  }, [currentAlgorithm, loadHistory]);

  const progress = history.length > 1 ? (currentStep / (history.length - 1)) * 100 : 0;
  const snapshot = history[currentStep] ?? {
    step: 0,
    arrayState: defaultArray,
    activeIndices: [],
    sortedIndices: [],
    currentLine: 0,
    explanation: 'Waiting for algorithm load.',
  };

  const flatAlgorithms = useMemo(() => algorithmGroups.flatMap((group) => group.items), []);
  const activeAlgorithm = flatAlgorithms.find((item) => item.id === currentAlgorithm);
  const activeGroup = algorithmGroups.find((group) => group.items.some((item) => item.id === currentAlgorithm));
  const visualType = shapeByCategory[activeGroup?.category ?? 'sorting'];

  const renderHanoi = () => {
    const towers = [
      snapshot.arrayState.slice(0, 3),
      snapshot.arrayState.slice(3, 6),
      snapshot.arrayState.slice(6, 9),
    ];

    return (
      <div className="hanoi-state">
        {towers.map((tower, towerIndex) => (
          <div key={towerIndex} className="hanoi-tower">
            <div className="tower-label">Peg {['A', 'B', 'C'][towerIndex]}</div>
            <div className="tower-base" />
            <div className="tower-pole" />
            <div className="tower-stack">
              {tower
                .slice()
                .reverse()
                .map((size, position) => {
                  const absoluteIndex = towerIndex * 3 + (2 - position);
                  if (size === 0) {
                    return <div key={position} className="hanoi-slot" />;
                  }

                  return (
                    <div
                      key={position}
                      className={`hanoi-ring ${snapshot.activeIndices.includes(absoluteIndex) ? 'active' : ''}`}
                      style={{ width: `${32 + size * 18}px` }}
                    >
                      {size}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const isActive = (index: number) => snapshot.activeIndices.includes(index);

  const renderStackVisual = () => (
    <div className="stack-state">
      {snapshot.arrayState.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className={`stack-plate ${isActive(index) ? 'active' : ''}`}
          style={{ width: `${48 + value * 16}px` }}
        >
          <span>{value}</span>
        </div>
      ))}
    </div>
  );

  const renderQueueVisual = () => (
    <div className="queue-state">
      {snapshot.arrayState.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className={`queue-person ${value === -1 ? 'empty' : ''} ${isActive(index) ? 'active' : ''}`}
        >
          <div className="queue-avatar">{value === -1 ? '...' : value}</div>
          <div className="queue-label">{value === -1 ? 'empty seat' : `passenger ${value}`}</div>
        </div>
      ))}
    </div>
  );

  const renderListVisual = () => (
    <div className="list-state">
      {snapshot.arrayState.map((value, index) => (
        <div key={`${value}-${index}`} className={`list-node ${isActive(index) ? 'active' : ''}`}>
          <span>{value}</span>
          {index < snapshot.arrayState.length - 1 && <span className="list-arrow">→</span>}
        </div>
      ))}
    </div>
  );

  const renderTreeVisual = () => {
    const levels = buildTreeLevels(snapshot.arrayState);
    let offset = 0;

    return (
      <div className="tree-state">
        {levels.map((level, rowIndex) => {
          const row = (
            <div key={rowIndex} className="tree-row">
              {level.map((value, nodeIndex) => {
                const absoluteIndex = offset + nodeIndex;
                return (
                  <div key={`${value}-${absoluteIndex}`} className={`tree-node ${isActive(absoluteIndex) ? 'active' : ''}`}>
                    <span>{value}</span>
                  </div>
                );
              })}
            </div>
          );
          offset += level.length;
          return row;
        })}
      </div>
    );
  };

  const renderGraphVisual = () => {
    if (currentAlgorithm === 'adjacency-matrix') {
      return (
        <div className="graph-matrix">
          {snapshot.arrayState.map((value, index) => (
            <div key={index} className={`graph-cell ${value ? 'connected' : ''}`}>
              {value}
            </div>
          ))}
        </div>
      );
    }

    if (currentAlgorithm === 'adjacency-list') {
      const groups: number[][] = [];
      let current: number[] = [];

      snapshot.arrayState.forEach((value) => {
        if (value === -1) {
          groups.push(current);
          current = [];
        } else {
          current.push(value);
        }
      });

      if (current.length) groups.push(current);

      return (
        <div className="graph-list">
          {groups.map((group, index) => (
            <div key={index} className="graph-list-item">
              <span className="graph-list-key">node {index}</span>
              <span>{group.length ? group.join(', ') : 'none'}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="graph-state">
        {snapshot.arrayState.slice(0, 6).map((value, index) => (
          <div key={`${value}-${index}`} className={`graph-node ${isActive(index) ? 'active' : ''}`}>
            <span>{value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderGridVisual = () => (
    <div className="grid-state">
      {snapshot.arrayState.map((value, index) => {
        const classNames = ['grid-cell'];
        let label = '';

        if (snapshot.activeIndices.includes(index)) {
          classNames.push('active');
        }

        switch (value) {
          case 1:
            classNames.push('wall');
            break;
          case 2:
            classNames.push('start');
            label = 'S';
            break;
          case 3:
            classNames.push('end');
            label = 'E';
            break;
          case 4:
            classNames.push('visited');
            break;
          case 5:
            classNames.push('found');
            label = '✓';
            break;
          case 6:
            classNames.push('path');
            break;
          default:
            classNames.push('empty');
        }

        return (
          <div key={index} className={classNames.join(' ')}>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );

  const renderHashVisual = () => (
    <div className="hash-state">
      {snapshot.arrayState.map((value, index) => (
        <div key={index} className={`hash-bucket ${isActive(index) ? 'active' : ''}`}>
          <div className="bucket-index">bucket {index}</div>
          <div className="bucket-value">{value === -1 ? 'empty' : value}</div>
        </div>
      ))}
    </div>
  );

  const renderArrayVisual = () => (
    <div className="array-state">
      {snapshot.arrayState.map((value, index) => {
        const isActive = snapshot.activeIndices.includes(index);
        const isSorted = snapshot.sortedIndices.includes(index);

        return (
          <div
            key={`${value}-${index}`}
            className={`array-bar ${isActive ? 'active' : ''} ${isSorted ? 'sorted' : ''}`}
            style={{ transform: `scaleY(${1 + value / 42})` }}
          >
            <span>{value}</span>
          </div>
        );
      })}
    </div>
  );

  const renderStructure = () => {
    switch (currentAlgorithm) {
      case 'tower-of-hanoi':
        return renderHanoi();
      case 'stack-push-pop':
      case 'expression-conversion':
      case 'postfix-evaluation':
      case 'prefix-evaluation':
      case 'factorial-recursion':
      case 'fibonacci-recursion':
        return renderStackVisual();
      case 'linear-queue':
      case 'circular-queue':
      case 'deque':
      case 'priority-queue':
        return renderQueueVisual();
      case 'singly-linked-list':
      case 'doubly-linked-list':
      case 'circular-linked-list':
        return renderListVisual();
      case 'binary-tree-traversals':
      case 'bst-insert-search-delete':
      case 'avl-rotations':
      case 'b-tree-insertion':
      case 'red-black-intro':
      case 'huffman-coding':
        return renderTreeVisual();
    case 'brute-force':
      return renderGridVisual();
      case 'prim':
      case 'warshall':
      case 'topological-sort':
        return renderGraphVisual();
      case 'hashing':
      case 'hash-table-chaining':
      case 'hash-table-linear-probing':
      case 'hash-table-quadratic-probing':
      case 'hash-table-double-hashing':
        return renderHashVisual();
      default:
        return renderArrayVisual();
    }
  };

  return (
    <main className="app-shell">
      <div className="hero-overlay" />
      <header className="hero-banner">
        <div className="hero-copy">
          <span className="eyebrow">DSA AI Visualizer</span>
          <h1>Discover algorithms with premium motion and state tracing.</h1>
          <p>
            Navigate across sorting, searching, trees, graphs, queues, and recursion with vivid
            gradient animations, intelligent highlights, and insight-rich visual tracing.
          </p>
        </div>

        <div className="hero-card summary-card">
          <div>
            <span>Current algorithm</span>
            <strong>{activeAlgorithm?.label ?? currentAlgorithm.replace(/-/g, ' ')}</strong>
          </div>
          <div>
            <span>Category</span>
            <strong>{activeGroup?.label ?? 'General'}</strong>
          </div>
          <div>
            <span>Trace length</span>
            <strong>{history.length ? `${history.length} steps` : 'Loading...'}</strong>
          </div>
        </div>
      </header>

      <section className="dashboard-grid">
        <aside className="controls-panel card">
          <div className="algorithm-select">
            <label htmlFor="algorithm">Choose a DSA topic</label>
            <select
              id="algorithm"
              value={currentAlgorithm}
              onChange={(event) => setAlgorithm(event.target.value as keyof typeof algorithmGenerators)}
            >
              {algorithmGroups.map((group) => (
                <optgroup key={group.category} label={group.label}>
                  {group.items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="algorithm-detail">
            <h3>{activeAlgorithm?.label ?? 'Pick an algorithm'}</h3>
            <p>{activeAlgorithm?.description ?? 'Select an algorithm to see step-by-step execution.'}</p>
            <p className="use-case">
              <strong>Use case:</strong> {algorithmUseCases[currentAlgorithm]}
            </p>
          </div>

          <div className="playback-buttons">
            <button type="button" onClick={stepBackward} disabled={currentStep === 0}>
              Step Back
            </button>
            {playbackState === 'playing' ? (
              <button type="button" onClick={pause} className="primary">
                Pause
              </button>
            ) : (
              <button type="button" onClick={play} className="primary">
                Play
              </button>
            )}
            <button type="button" onClick={stepForward} disabled={currentStep >= history.length - 1}>
              Step Forward
            </button>
          </div>

          <div className="progress-group">
            <span>Trace progress</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="status-grid">
            <div>
              <span>Mode</span>
              <strong>{playbackState === 'playing' ? 'Animated' : 'Manual'}</strong>
            </div>
            <div>
              <span>Step</span>
              <strong>{history.length ? `${currentStep + 1} / ${history.length}` : '0 / 0'}</strong>
            </div>
            <div>
              <span>Active indices</span>
              <strong>{snapshot.activeIndices.length ? snapshot.activeIndices.join(', ') : 'None'}</strong>
            </div>
          </div>
        </aside>

        <section className="visualizer-panel card">
          <div className="visualizer-header">
            <div>
              <h2>{activeAlgorithm?.label ?? 'State snapshot'}</h2>
              <p>Rendering this algorithm as a {visualType} structure with clear visual cues.</p>
            </div>
            <div className="step-pill">Step {snapshot.step + 1}</div>
          </div>

          <div className={`visualizer-canvas visualizer-${visualType}`}>
            {renderStructure()}
          </div>

          <div className="explanation-box">
            <div className="explanation-top">
              <p>{snapshot.explanation}</p>
              <span>Line {snapshot.currentLine}</span>
            </div>

            <div className="legend-row">
              <div className="legend-item active">
                <span /> Active
              </div>
              <div className="legend-item sorted">
                <span /> Sorted / visited
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
