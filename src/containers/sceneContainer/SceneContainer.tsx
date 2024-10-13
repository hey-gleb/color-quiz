import React, {useCallback, useEffect, useMemo, useState} from 'react';

import GameScene from "../gameScene/GameScene";
import GameOverScene from "../gameOverScene/GameOverScene";
import MenuScene from "../menuScene/MenuScene";

import './SceneContainer.css';
import gameScene from "../gameScene/GameScene";

type Scene = 'menu' | 'game' | 'gameOver';
export type ColorMode = 'hex' | 'rgb' | 'hsv' | 'hsl';
export type GameRound = 10 | 20 | 'endless';

export interface GameState {
  currentRound: number;
  currentScore: number;
  currentScene: Scene;

  totalRounds: GameRound;
  colorMode: ColorMode

  isGameOver: boolean;
}

const INITIAL_GAME_STATE: GameState = {
  currentRound: 1,
  currentScore: 0,
  currentScene: 'menu',

  totalRounds: 10,
  colorMode: 'hex',

  isGameOver: false,
}

const SceneContainer: React.FC = () => {
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

//   useEffect(() => {
//     document.addEventListener('contextmenu', event => event.preventDefault());
//
// // Disable common dev tool shortcuts
//     document.addEventListener('keydown', event => {
//       if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
//         event.preventDefault();
//       }
//     });
//   }, []);

  useEffect(() => {
    if (gameState.currentRound > gameState.totalRounds && !gameState.isGameOver) {
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

export default SceneContainer;
