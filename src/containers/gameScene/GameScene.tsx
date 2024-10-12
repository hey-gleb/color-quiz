import React, {useCallback} from 'react';

import Button from "../../atoms/button/Button";

import {MAX_GAME_ROUNDS} from "../../const";

import {GameState} from "../../GameContainer";

import './GameScene.css';

interface GameSceneProps {
  gameState: GameState;
  updateGameState: (gameState: GameState) => void;
}

const GameScene: React.FC<GameSceneProps> = props => {
  const {gameState, updateGameState} = props;

  const getRandomColorHex = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
  }

  const generateColorOptions = useCallback((currentColor: string) => {
    const options = [currentColor];
    while (options.length < 4) {
      const randomColor = getRandomColorHex();
      if (!options.includes(randomColor)) {
        options.push(randomColor);
      }
    }
    // TODO rework array shuffle
    return options.sort(() => Math.random() - 0.5);
  },[]);

  const [colorToGuess, setColorToGuess] = React.useState(getRandomColorHex());
  const [guessOptions, setGuessOptions] = React.useState(generateColorOptions(colorToGuess));

  const handleOptionClick = useCallback((color: string)=>{
    console.log(color === colorToGuess ? 'Correct' : 'Incorrect');

    const newGameState = {...gameState}

    if (color === colorToGuess) newGameState.currentScore = newGameState.currentScore + 1;

    const newColorToGuess = getRandomColorHex();
    setColorToGuess(newColorToGuess);
    setGuessOptions(generateColorOptions(newColorToGuess));
    newGameState.currentRound = newGameState.currentRound + 1;
    updateGameState(newGameState);
  }, [colorToGuess, gameState, generateColorOptions, updateGameState]);

  return (
    <div className="colored-background" style={{background: colorToGuess}}>
        <div className="quiz-form">
          <p>Game rounds {gameState.currentRound}/{MAX_GAME_ROUNDS}</p>
          {guessOptions.map((guessOption) => (
            <Button key={guessOption} onClick={() => handleOptionClick(guessOption)}>{guessOption}</Button>
          ))}
        </div>
    </div>
  );
}

export default GameScene;