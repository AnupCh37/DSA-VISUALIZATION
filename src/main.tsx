import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { VisualizerProvider } from './context/VisualizerContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VisualizerProvider>
      <App />
    </VisualizerProvider>
  </StrictMode>,
);
