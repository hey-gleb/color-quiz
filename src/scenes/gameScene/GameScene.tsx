import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card.tsx';
import { generateQuestion } from '@/colors.ts';
import useGameState from '@/hooks/useGameState';
import useAudio from '@/hooks/useAudio.ts';

const GameScene: React.FC = () => {
  const { gameState, setGameState } = useGameState();
  const { play } = useAudio();

  const [selected, setSelected] = useState<string | null>(null);
  const [question, setQuestion] = useState(generateQuestion(gameState.round));

  const showAnswer = useRef(false);

  const handleSelect = useCallback(
    (hex: string) => {
      if (showAnswer.current) return;
      setSelected(hex);
      showAnswer.current = true;

      const currentGameState = { ...gameState };

      if (hex === question.answer) currentGameState.score += 1;
      play(hex === question.answer ? 'correctAnswer' : 'wrongAnswer');

      setTimeout(() => {
        currentGameState.round += 1;
        currentGameState.answers.push({
          questionColor: question.answer,
          selected: hex,
          correct: question.answer,
          isCorrect: hex === question.answer,
        });
        if (currentGameState.round > gameState.totalRounds) {
          currentGameState.scene = 'gameOver';
        }
        setQuestion(generateQuestion(currentGameState.round));
        setSelected(null);
        showAnswer.current = false;
        setGameState(currentGameState);
      }, 1500);
    },
    [gameState]
  );

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
          <CardContent className="p-6 flex flex-col items-center">
            <div
              className="w-40 h-40 rounded-xl mb-10 border border-zinc-700"
              style={{ backgroundColor: question.answer }}
            />
            <div className="grid grid-cols-2 gap-4 w-full">
              {question.options.map((hex) => {
                const isSelected = selected === hex;
                const isRight = showAnswer.current && hex === question.answer;
                const isWrong =
                  showAnswer.current && isSelected && hex !== question.answer;
                return (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    key={hex}
                    onClick={() => handleSelect(hex)}
                    className={`py-3 px-4 rounded-xl font-mono text-sm text-white transition-all duration-300 border 
                    ${isRight ? 'bg-green-500 text-black border-green-500' : ''}
                    ${isWrong ? 'bg-red-500 text-black border-red-500' : ''}
                    ${!isRight && !isWrong ? 'bg-zinc-700 hover:bg-zinc-600 border-zinc-600' : ''}
                  `}
                  >
                    {hex}
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </motion.div>
      </Card>
    </div>
  );
};

export default GameScene;
