import React, {useCallback, useEffect, useMemo, useState} from 'react';

import GameScene from "./containers/gameScene/GameScene";
import GameOverScene from "./containers/gameOverScene/GameOverScene";

import {MAX_GAME_SCORE} from "./const";

import './GameContainer.css';
import MenuScene from "./containers/menuScene/MenuScene";

type Scene = 'menu' | 'game' | 'gameOver';
export type ColorMode = 'hex' | 'rgb' | 'hsv' | 'hsl';

export interface GameState {
  currentRound: number;
  currentScore: number;
  currentScene: Scene;
  colorMode: ColorMode
  isGameOver: boolean;
}

const INITIAL_GAME_STATE: GameState = {
  currentRound: 1,
  currentScore: 0,
  currentScene: 'menu',
  colorMode: 'hex',
  isGameOver: false,
}

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  const updateGameState = useCallback((newGameState: GameState) => setGameState(newGameState),[])

  const onGameRestart = useCallback(()=> {
    setGameState(INITIAL_GAME_STATE);
  },[])

  const scenes = useMemo(()=>({
    menu: <MenuScene gameState={gameState} updateGameState={updateGameState}/>,
    game: <GameScene
      gameState={gameState} updateGameState={updateGameState}
    />,
    gameOver: <GameOverScene gameState={gameState} onGameRestart={onGameRestart} />,
  }), [gameState, onGameRestart, updateGameState])

  const currentScene = useMemo(()=> scenes[gameState.currentScene], [gameState.currentScene, scenes])

  useEffect(() => {
    if (gameState.currentRound === MAX_GAME_SCORE && !gameState.isGameOver) {
      setGameState({
        ...gameState,
        isGameOver: true,
        currentScene: 'gameOver',
      });
    }
  }, [gameState, scenes.gameOver]);

  return (
    <div className="main-layout">
      {currentScene}
    </div>
  );
}

export default GameContainer;
