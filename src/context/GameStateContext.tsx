import React, { createContext, type ReactNode, useState } from 'react';
import type { GameRound } from '@/types/game.ts';

interface SelectedColor {
  color: string;
  result: 'correct' | 'wrong' | 'partial';
}

type Answer = {
  questionColor: string;
  selected: SelectedColor[];
  correct: string;
};

export type GameState = {
  totalRounds: number;
  round: number;
  score: number;
  scene: string;
  isGameOver: boolean;
  answers: Answer[];
};

export type GameStateContextType = {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  resetGame: () => void;
};

export const gamePlan: GameRound[] = [
  {
    questionType: 'quiz',
    difficulty: 1,
  },
  {
    questionType: 'quiz',
    difficulty: 2,
  },
  {
    questionType: 'quiz',
    difficulty: 3,
  },
  {
    questionType: 'quiz',
    difficulty: 4,
  },
  {
    questionType: 'mathExpression',
    difficulty: 1,
  },
  {
    questionType: 'match',
    difficulty: 5,
  },
];

const defaultState: GameState = {
  totalRounds: gamePlan.length,
  round: 1,
  score: 0,
  scene: 'menu',
  isGameOver: false,
  answers: [],
};

export const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined
);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(defaultState);

  const resetGame = () =>
    setGameState({ ...defaultState, scene: 'game', answers: [] });

  return (
    <GameStateContext.Provider value={{ gameState, setGameState, resetGame }}>
      {children}
    </GameStateContext.Provider>
  );
};
