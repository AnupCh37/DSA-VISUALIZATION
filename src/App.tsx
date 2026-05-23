import { useEffect, useMemo } from 'react';
import { useVisualizer } from './context/VisualizerContext';
import { algorithmGenerators, algorithmGroups } from './features/algorithms';
import { useAnimationEngine } from './hooks/useAnimationEngine';
import './App.css';

const defaultArray = [12, 4, 18, 7, 9, 3, 14, 1, 22, 16];

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

  const flatAlgorithms = useMemo(
    () => algorithmGroups.flatMap((group) => group.items),
    [],
  );

  const activeAlgorithm = flatAlgorithms.find((item) => item.id === currentAlgorithm);

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
            <strong>{activeAlgorithm ? algorithmGroups.find((group) => group.items.some((item) => item.id === currentAlgorithm))?.label : 'General'}</strong>
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
              <h2>State snapshot</h2>
              <p>Visualizing algorithm state, active hotspots, and execution flow.</p>
            </div>
            <div className="step-pill">Step {snapshot.step + 1}</div>
          </div>

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
                <span /> Sorted
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
