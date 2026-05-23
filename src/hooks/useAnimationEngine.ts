import { useEffect } from 'react';
import { useVisualizer } from '../context/VisualizerContext';

export function useAnimationEngine(): void {
  const { playbackState, speed, currentStep, history, pause, stepForward } = useVisualizer();

  useEffect(() => {
    if (playbackState !== 'playing') {
      return;
    }

    if (history.length === 0 || currentStep >= history.length - 1) {
      pause();
      return;
    }

    const intervalId = window.setInterval(() => {
      if (currentStep >= history.length - 1) {
        pause();
        return;
      }

      stepForward();
    }, speed);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentStep, history.length, pause, playbackState, speed, stepForward]);
}
