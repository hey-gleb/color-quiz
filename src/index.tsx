import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import GameContainer from '@/GameContainer.tsx';
import { GameStateProvider } from '@/context/GameStateContext.tsx';
import { AudioProvider } from '@/context/AudioContext.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AudioProvider>
      <GameStateProvider>
        <GameContainer />
      </GameStateProvider>
    </AudioProvider>
  </StrictMode>
);
