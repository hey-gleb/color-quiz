import React from "react";

import Button from "../../atoms/button/Button";

import { GameState } from "../sceneContainer/SceneContainer";

import "./GameOverScene.css";

interface Props {
  gameState: GameState;
  onGameRestart: () => void;
}

const GameOverScene: React.FC<Props> = (props) => {
  const { gameState, onGameRestart } = props;

  return (
    <div className="game-over-scene">
      <div className="game-over-scene__form">
        <h3>Game finished successfully!</h3>
        <p>
          <span className={"correct-answers"}>{gameState.currentScore}</span>/
          <span className={"total-rounds"}>{gameState.totalRounds}</span>
          Correct answers
        </p>
        <Button onClick={onGameRestart}>Back to menu</Button>
      </div>
    </div>
  );
};

export default GameOverScene;
