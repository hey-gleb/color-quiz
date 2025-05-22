import React, { createContext, type ReactNode, useState } from 'react';
import { TOTAL_ROUNDS } from '@/const.ts';

export type GameState = {
  totalRounds: number;
  round: number;
  score: number;
  scene: string;
  isGameOver: boolean;
};

export type GameStateContextType = {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  resetGame: () => void;
};

const defaultState: GameState = {
  totalRounds: TOTAL_ROUNDS,
  round: 1,
  score: 0,
  scene: 'menu',
  isGameOver: false,
};

export const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(defaultState);

  const resetGame = () => setGameState({ ...defaultState, scene: 'game' });

  return (
    <GameStateContext.Provider value={{ gameState, setGameState, resetGame }}>
      {children}
    </GameStateContext.Provider>
  );
};
