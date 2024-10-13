import React, {useCallback} from 'react';
import chroma from 'chroma-js';

import Button from "../../atoms/button/Button";

import {MAX_GAME_ROUNDS} from "../../const";

import {ColorMode, GameState} from "../../GameContainer";

import './GameScene.css';
import Switch from "../../atoms/switch/Switch";

interface GameSceneProps {
  gameState: GameState;
  updateGameState: (gameState: GameState) => void;
}


const outputFormat: Record<ColorMode, (color: string) => string> = {
  hex: (color: string) => chroma(color).hex().toUpperCase(),
  rgb: (color: string) => `rgb(${chroma(color).rgb().join(', ')})`,
  // TODO fix hsv
  hsv: (color: string) => {
    const [hue, saturation, value] = chroma(color).hsv();
    return `hsv(${Math.trunc(hue)}, ${Math.trunc(saturation * 100)}%, ${Math.trunc(value * 100)}%)`;
  },
  hsl: (color: string) => {
    const [hue, saturation, lightness] = chroma(color).hsl();
    return `hsl(${Math.trunc(hue)}, ${Math.trunc(saturation * 100)}%, ${Math.trunc(lightness * 100)}%)`;
  },
}

const GameScene: React.FC<GameSceneProps> = props => {
  const {gameState, updateGameState} = props;

  const getRandomColorHex = () => chroma.random().hex()

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
          <Switch onCheck={(value: string)=>{
            updateGameState({
              ...gameState,
              colorMode: value as ColorMode,
            })
          }}
          options={[
            {
              value: 'hex',
              label: 'Hex',
            },
            {
              value: 'rgb',
              label: 'RGB',
            },
            {
              value: 'hsv',
              label: 'HSV',
            },
            {
              value: 'hsl',
              label: 'HSL',
            }
          ]}
          />
          <p>Game rounds {gameState.currentRound}/{MAX_GAME_ROUNDS}</p>
          {guessOptions.map((guessOption) => (
            <Button key={guessOption} onClick={() => handleOptionClick(guessOption)}>{outputFormat[gameState.colorMode](guessOption)}</Button>
          ))}
        </div>
    </div>
  );
}

export default GameScene;