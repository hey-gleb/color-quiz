import React, { useMemo } from 'react';
import GameOverScene from '@/scenes/gameOverScene/GameOverScene.tsx';
import MenuScene from '@/scenes/menuScene/MenuScene.tsx';
import GameScene from '@/scenes/gameScene/GameScene.tsx';
import useGameState from '@/hooks/useGameState.ts';

function GameContainer() {
  return (
    <div id={'game-container'}>
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
