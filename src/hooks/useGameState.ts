import { useContext } from 'react';
import {
  GameStateContext,
  type GameStateContextType,
} from '@/context/GameStateContext.tsx';

const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

export default useGameState;
