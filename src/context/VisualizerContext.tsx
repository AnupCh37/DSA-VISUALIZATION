import { createContext, useCallback, useContext, useMemo, useState, type FC, type ReactNode } from 'react';
import type { AlgorithmType, PlaybackState, Snapshot } from '../types';

type VisualizerContextValue = {
  currentAlgorithm: AlgorithmType;
  playbackState: PlaybackState;
  speed: number;
  currentStep: number;
  history: Snapshot[];
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setAlgorithm: (type: AlgorithmType) => void;
  loadHistory: (snapshots: Snapshot[]) => void;
};

const VisualizerContext = createContext<VisualizerContextValue | null>(null);

export const VisualizerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmType>('bubble-sort');
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [speed] = useState<number>(400);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [history, setHistory] = useState<Snapshot[]>([]);

  const play = useCallback(() => {
    setPlaybackState('playing');
  }, []);

  const pause = useCallback(() => {
    setPlaybackState('paused');
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep((previousStep) => {
      if (history.length === 0) {
        return 0;
      }

      return Math.min(previousStep + 1, history.length - 1);
    });
  }, [history.length]);

  const stepBackward = useCallback(() => {
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 0));
  }, []);

  const setAlgorithm = useCallback((type: AlgorithmType) => {
    setCurrentAlgorithm(type);
    setPlaybackState('idle');
    setCurrentStep(0);
  }, []);

  const loadHistory = useCallback((snapshots: Snapshot[]) => {
    setHistory([...snapshots]);
    setCurrentStep(0);
    setPlaybackState('idle');
  }, []);

  const value = useMemo<VisualizerContextValue>(
    () => ({
      currentAlgorithm,
      playbackState,
      speed,
      currentStep,
      history,
      play,
      pause,
      stepForward,
      stepBackward,
      setAlgorithm,
      loadHistory,
    }),
    [currentAlgorithm, currentStep, history, pause, play, playbackState, stepBackward, stepForward, setAlgorithm, loadHistory, speed],
  );

  return <VisualizerContext.Provider value={value}>{children}</VisualizerContext.Provider>;
};

export const useVisualizer = (): VisualizerContextValue => {
  const context = useContext(VisualizerContext);

  if (!context) {
    throw new Error('useVisualizer must be used within a VisualizerProvider');
  }

  return context;
};
