import type { GameState } from '@/context/GameStateContext.tsx';

interface QuestionProps {
  onAnswerSubmit: (gameState: GameState) => void;
  difficulty: number;
}

export type { QuestionProps };
