import React, { useMemo } from 'react';
import GameOverScene from '@/scenes/gameOverScene/GameOverScene.tsx';
import MenuScene from '@/scenes/menuScene/MenuScene.tsx';
import GameScene from '@/scenes/gameScene/GameScene.tsx';
import useGameState from '@/hooks/useGameState.ts';
import SoundControlButton from '@/components/soundControlButton/SoundControlButton.tsx';

function GameContainer() {
  return (
    <div id={'game-container'} className={'relative w-full h-full'}>
      <SoundControlButton className={'absolute top-5 left-5'} />
      <SceneProvider />
    </div>
  );
}

export default GameContainer;

const SceneProvider: React.FC = () => {
  const { gameState } = useGameState();
  const scenes: Record<'menu' | 'game' | 'gameOver', React.ReactNode> = useMemo(
    () => ({
      menu: <MenuScene />,
      game: <GameScene />,
      gameOver: <GameOverScene />,
    }),
    []
  );

  return scenes[gameState.scene as 'menu' | 'game' | 'gameOver'];
};
