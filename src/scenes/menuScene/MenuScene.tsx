import React from 'react';

import useGameState from '@/hooks/useGameState';
import { Button } from '@/components/ui/button.tsx';

const MenuScene: React.FC = () => {
  const { gameState, resetGame } = useGameState();

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-bold mb-4">Color Quiz</h1>
      <p className="text-zinc-400 mb-6 max-w-md">
        Guess colors HEX-codes correctly. Just {gameState.totalRounds} rounds to
        show what you can.
      </p>
      <Button onClick={resetGame} size={'lg'} variant={'secondary'}>
        Start game
      </Button>
    </div>
  );
};

export default MenuScene;
