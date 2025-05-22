import useGameState from '@/hooks/useGameState';
import React from 'react';

const MenuScene: React.FC = () => {
  const { gameState, resetGame } = useGameState();

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">🎨 Color Quiz</h1>
      <p className="text-zinc-400 mb-6 max-w-md">
        Guess colors HEX-codes correctly. Just {gameState.totalRounds} rounds to
        show what you can.
      </p>
      <button
        onClick={resetGame}
        className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-xl transition"
      >
        Start game
      </button>
    </div>
  );
};

export default MenuScene;
