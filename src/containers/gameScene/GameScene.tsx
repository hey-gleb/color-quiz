import React, {useCallback} from 'react';
import chroma from 'chroma-js';
import cn from 'classnames';

import Button from "../../atoms/button/Button";
import Switch from "../../atoms/switch/Switch";

import {MILLISECONDS_TO_WAIT_BEFORE_NEXT} from "../../const";

import {ColorMode, GameState} from "../sceneContainer/SceneContainer";

import './GameScene.css';

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
    return options.sort(() => Math.random() - 0.5);
  },[]);

  const [colorToGuess, setColorToGuess] = React.useState(getRandomColorHex());
  const [guessOptions, setGuessOptions] = React.useState(generateColorOptions(colorToGuess));
  const [isAnswered, setIsAnswered] = React.useState(false);

  const handleOptionClick = useCallback((color: string)=>{
    console.log(color === colorToGuess ? 'Correct' : 'Incorrect');
    if (isAnswered) return;

    const newGameState = {...gameState}

    if (color === colorToGuess) newGameState.currentScore = newGameState.currentScore + 1;

    const newColorToGuess = getRandomColorHex();

    setIsAnswered(true);
    setTimeout(()=>{
      setColorToGuess(newColorToGuess);
      setGuessOptions(generateColorOptions(newColorToGuess));
      newGameState.currentRound = newGameState.currentRound + 1;
      updateGameState(newGameState);
      setIsAnswered(false);
    }, MILLISECONDS_TO_WAIT_BEFORE_NEXT);


  }, [colorToGuess, gameState, generateColorOptions, isAnswered, updateGameState]);

  return (
    <div id="background" className="colored-background" style={{background: colorToGuess}}>
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
          {gameState.totalRounds === 'endless' ?
            <p>Game round {gameState.currentRound}</p>
            :
            <p>Game rounds {gameState.currentRound}/{gameState.totalRounds}</p>
          }
          {guessOptions.map((guessOption) => (
            <Button className={cn('guess-option', {'guess-option_correct': isAnswered && guessOption === colorToGuess, 'guess-option_incorrect': isAnswered && guessOption !== colorToGuess}, {
            })} key={guessOption} onClick={() => handleOptionClick(guessOption)}>{outputFormat[gameState.colorMode](guessOption)}</Button>
          ))}
        </div>
    </div>
  );
}

export default GameScene;