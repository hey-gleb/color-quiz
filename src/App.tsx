import React, {useCallback} from 'react';

import './App.css';

const MAX_GAME_ROUNDS = 10;

const App: React.FC = () => {
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

  const [currentRound, setCurrentRound] = React.useState(1);
  const [colorToGuess, setColorToGuess] = React.useState(getRandomColorHex());
  const [guessOptions, setGuessOptions] = React.useState(generateColorOptions(colorToGuess));

  const handleOptionClick = useCallback((color: string)=>{
    console.log(color === colorToGuess ? 'Correct' : 'Incorrect');

    const newColorToGuess = getRandomColorHex();
    setColorToGuess(newColorToGuess);
    setGuessOptions(generateColorOptions(newColorToGuess));
    setCurrentRound(prevState => prevState + 1);
  },[colorToGuess, generateColorOptions]);

  console.log(guessOptions);
  console.log(colorToGuess);

  return (
    <div className="main-layout">
        <div className="colored-background" style={{background: colorToGuess}}>
          <div className="quiz-form">
            <p>Game rounds {currentRound}/{MAX_GAME_ROUNDS}</p>
            {guessOptions.map((guessOption) => (
              <button key={guessOption} className="quiz-button" onClick={() => handleOptionClick(guessOption)}>{guessOption}</button>
            ))}
          </div>
        </div>
    </div>
  );
}

export default App;
