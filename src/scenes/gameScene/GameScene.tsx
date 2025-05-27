import React from 'react';
import { motion } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card.tsx';
import useGameState from '@/hooks/useGameState';
import QuizQuestion from '@/components/questions/QuizQuestion.tsx';
import ColorMatchQuestion from '@/components/questions/ColorMatchQuestion.tsx';
import { gamePlan, type GameState } from '@/context/GameStateContext';
import type { QuestionType } from '@/types/game.ts';
import type { QuestionProps } from '@/components/questions';
import MathExpressionQuestion from '@/components/questions/MathExpressionQuestion.tsx';

const questionTypeToComponentMap: Record<
  QuestionType,
  React.FC<QuestionProps>
> = {
  quiz: QuizQuestion,
  match: ColorMatchQuestion,
  mathExpression: MathExpressionQuestion,
};

const GameScene: React.FC = () => {
  const { gameState, setGameState } = useGameState();

  const handleAnswerSubmit = (currentGameState: GameState) => {
    currentGameState.round += 1;
    if (currentGameState.round > gamePlan.length) {
      setGameState({ ...currentGameState, scene: 'gameOver' });
    } else {
      setGameState(currentGameState);
    }
  };

  const gameRound = gamePlan[gameState.round - 1];
  const QuestionComponent = questionTypeToComponentMap[gameRound.questionType];
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-6">
      <div className="absolute top-4 right-6 text-white text-lg font-semibold">
        Round: {gameState.round}/{gameState.totalRounds}
      </div>
      <Card className="w-full max-w-md rounded-2xl shadow-xl border border-zinc-700 bg-zinc-800">
        <motion.div
          key={gameState.round}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <CardContent className="p-6 flex flex-col items-center text-white gap-4">
            <QuestionComponent
              onAnswerSubmit={handleAnswerSubmit}
              difficulty={gameRound.difficulty}
            />
          </CardContent>
        </motion.div>
      </Card>
    </div>
  );
};

export default GameScene;
