import React from 'react';

import Button from "../../atoms/button/Button";
import Switch from "../../atoms/switch/Switch";

import {GameRound, GameState} from "../sceneContainer/SceneContainer";

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

      <p className="instructions">
        Guess the correct color code from the options. Switch between Hex, RGB, HSV, and HSL to challenge yourself!
      </p>
      Game rounds
      <Switch onCheck={(value: string)=>{
        updateGameState({
          ...gameState,
          totalRounds: value as GameRound,
        })
      }}
              options={[
                {
                  value: '10',
                  label: '10',
                },
                {
                  value: '20',
                  label: '20',
                },
                {
                  value: 'endless',
                  label: 'Endless',
                }
              ]}
      />
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
