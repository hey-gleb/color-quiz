import React from 'react';
import Button from "../../atoms/button/Button";
import {GameState} from "../../GameContainer";

import './MenuScene.css';

interface Props {
  gameState: GameState;
  updateGameState: (gameState: GameState) => void;
}

const MenuScene: React.FC<Props> = props => {
  const {gameState, updateGameState} = props;

  return <div className={'menu-scene'}>
    <div className={'menu-scene__form'}>
      <h1>Color quiz</h1>
      <Button
        className={'menu-scene__button'}
        onClick={() => {
          updateGameState({
            ...gameState,
            currentScene: 'game'
          });
        }}
      >Start</Button>
    </div>
  </div>
}

export default MenuScene;
