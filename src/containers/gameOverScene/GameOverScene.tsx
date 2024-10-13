import React from 'react';

import Button from "../../atoms/button/Button";

import {MAX_GAME_SCORE} from "../../const";

import {GameState} from "../../GameContainer";

import './GameOverScene.css';

interface Props {
  gameState: GameState;
  onGameRestart: () => void;
}

const GameOverScene: React.FC<Props> = props => {
  const {gameState, onGameRestart} = props;

  return (
    <div className="game-over-scene">
      <div className="game-over-scene__form">
        <h3>
          Game finished successfully!
        </h3>
      Your score: {gameState.currentScore}/{MAX_GAME_SCORE}!
      <Button onClick={onGameRestart}>Back to menu</Button>
    </div>
    </div>
  )
}

export default GameOverScene;