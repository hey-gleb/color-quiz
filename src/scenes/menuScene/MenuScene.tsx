import React from 'react';

import useGameState from '@/hooks/useGameState';
import { Button } from '@/components/ui/button.tsx';
import ChangelogModal from '@/components/changelogModal/ChangelogModal.tsx';

const MenuScene: React.FC = () => {
  const { gameState, resetGame } = useGameState();

  return (
    <div
      className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6 text-center"
      style={{
        backgroundImage: 'radial-gradient(#26262d 2px, #18181b 2px)',
        backgroundSize: '40px 40px',
      }}
    >
      <h1 className="text-5xl font-bold mb-4">Color Quiz</h1>
      <p className="text-zinc-400 mb-6 max-w-md">
        Guess colors HEX-codes correctly. Just {gameState.totalRounds} rounds to
        show what you can.
      </p>
      <div className="flex flex-col gap-4 items-center justify-center">
        <Button onClick={resetGame} size={'lg'} variant={'secondary'}>
          Start game
        </Button>
        <ChangelogModal />
      </div>
    </div>
  );
};

export default MenuScene;
