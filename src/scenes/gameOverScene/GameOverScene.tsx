import React from 'react';
import useGameState from '@/hooks/useGameState.ts';

const GameOverScene: React.FC = () => {
  const { gameState, resetGame } = useGameState();

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-semibold mb-4">Game over!</h2>
      <p className="text-lg text-zinc-400 mb-6">
        You scored {gameState.score} out of {gameState.totalRounds} points.
      </p>
      <button
        onClick={resetGame}
        className="bg-green-500 hover:bg-green-600 text-black py-3 px-6 rounded-xl transition"
      >
        Restart
      </button>
    </div>
  );
};

export default GameOverScene;
