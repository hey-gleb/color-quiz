import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

import useGameState from '@/hooks/useGameState.ts';
import { Button } from '@/components/ui/button.tsx';
import useAudio from '@/hooks/useAudio.ts';

const GameOverScene: React.FC = () => {
  const { gameState, resetGame } = useGameState();
  const { play } = useAudio();
  const { score, answers } = gameState;

  useEffect(() => {
    confetti({
      spread: 120,
      particleCount: 80,
      angle: 90,
      origin: { y: 0.4, x: 0.5 },
    });
    play('gameOver');
  }, []);

  const handleRestart = () => {
    confetti.reset();
    resetGame();
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6 bg-zinc-800 text-white rounded-2xl shadow-xl border border-zinc-700"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">🎉 Great job!</h2>
        <p className="text-center text-xl">{score} points</p>

        <div className="mt-6">
          {answers.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-sm mb-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: a.questionColor }}
                />
                <span>#{i + 1}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span
                  className={`px-2 py-0.5 rounded font-mono ${a.isCorrect ? 'bg-green-500 text-black' : 'bg-red-500 text-black'}`}
                >
                  {a.selected}
                </span>
                {!a.isCorrect && (
                  <span className="text-xs text-zinc-400">→ {a.correct}</span>
                )}
                {a.isCorrect ? '✅' : '❌'}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button variant={'secondary'} size={'lg'} onClick={handleRestart}>
            🔁 Try again
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameOverScene;
