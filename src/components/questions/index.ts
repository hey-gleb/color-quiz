import type { GameState } from '@/context/GameStateContext.tsx';

interface QuestionProps {
  onAnswerSubmit: (gameState: GameState) => void;
}

export type { QuestionProps };
