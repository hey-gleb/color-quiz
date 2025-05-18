import { useState } from 'react';
import { motion } from 'framer-motion';

import { Card, CardContent } from './components/ui/card';

import './App.css';

const TOTAL_ROUNDS = 5;

const getRandomHexChar = () => {
  const letters = '0123456789ABCDEF';
  return letters[Math.floor(Math.random() * 16)];
};

const getRandomColor = (): string => {
  return '#' + Array.from({ length: 6 }, () => getRandomHexChar()).join('');
};

const getUniqueRandomHexChar = (currentChars: string[] = []) => {
  if (currentChars.length === 0) return getRandomHexChar();
  let hexChar = currentChars[0];
  while (!currentChars.includes(hexChar)) {
    hexChar = getRandomHexChar();
  }
  return getRandomHexChar();
};

const generateQuestion = (
  currentRounds: number
): { options: string[]; answer: string } => {
  const colorGeneratorStrategyMap: Record<number, () => string> = {
    1: () => {
      const hexChar = getUniqueRandomHexChar();
      return '#' + Array.from({ length: 6 }, () => hexChar).join('');
    },
    2: () => {
      const hexChar1 = getUniqueRandomHexChar();
      const hexChar2 = getUniqueRandomHexChar([hexChar1]);
      return (
        '#' +
        [hexChar1, hexChar1, hexChar1, hexChar2, hexChar2, hexChar2].join('')
      );
    },
    3: () => {
      {
        const hexChar1 = getUniqueRandomHexChar();
        const hexChar2 = getUniqueRandomHexChar([hexChar1]);
        const hexChar3 = getUniqueRandomHexChar([hexChar1, hexChar2]);
        return (
          '#' +
          [hexChar1, hexChar1, hexChar2, hexChar2, hexChar3, hexChar3].join('')
        );
      }
    },
    4: () => {
      {
        const hexChar1 = getRandomHexChar();
        return (
          '#' +
          [
            getRandomHexChar(),
            hexChar1,
            hexChar1,
            getRandomHexChar(),
            getRandomHexChar(),
            getRandomHexChar(),
          ].join('')
        );
      }
    },
    5: () => getRandomColor(),
  };
  const colorGenerator = colorGeneratorStrategyMap[currentRounds];
  if (!colorGenerator)
    return {
      answer: '#000000',
      options: ['#000000'],
    };
  const answer = colorGenerator();
  const options = [answer];
  while (options.length < 4) {
    const color = colorGenerator();
    if (!options.includes(color)) options.push(color);
  }
  return {
    answer,
    options: options.sort(() => Math.random() - 0.5),
  };
};

function App() {
  const [screen, setScreen] = useState<'welcome' | 'game' | 'gameover'>(
    'welcome'
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [question, setQuestion] = useState(generateQuestion(round));

  const handleStart = () => {
    setScreen('game');
    setScore(0);
    setRound(1);
    setQuestion(generateQuestion(1));
  };

  const handleSelect = (hex: string) => {
    if (showAnswer) return;
    setSelected(hex);
    setShowAnswer(true);

    if (hex === question.answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setRound((prev) => prev + 1);
      if (round === TOTAL_ROUNDS) {
        setScreen('gameover');
      }
      setQuestion(generateQuestion(round + 1));
      setSelected(null);
      setShowAnswer(false);
    }, 1500);
  };

  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">🎨 Color Quiz</h1>
        <p className="text-zinc-400 mb-6 max-w-md">
          Guess colors HEX-codes correctly. Just {TOTAL_ROUNDS} rounds to show
          what you can.
        </p>
        <button
          onClick={handleStart}
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-xl transition"
        >
          Start game
        </button>
      </div>
    );
  }

  if (screen === 'gameover') {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">Game over!</h2>
        <p className="text-lg text-zinc-400 mb-6">
          You scored {score} out of {TOTAL_ROUNDS} points.
        </p>
        <button
          onClick={handleStart}
          className="bg-green-500 hover:bg-green-600 text-black py-3 px-6 rounded-xl transition"
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-6">
      <div className="absolute top-4 right-6 text-white text-lg font-semibold">
        Round: {round}/{TOTAL_ROUNDS}
      </div>
      <Card className="w-full max-w-md rounded-2xl shadow-xl border border-zinc-700 bg-zinc-800">
        <CardContent className="p-6 flex flex-col items-center">
          <div
            className="w-40 h-40 rounded-xl mb-10 border border-zinc-700"
            style={{ backgroundColor: question.answer }}
          />
          <div className="grid grid-cols-2 gap-4 w-full">
            {question.options.map((hex) => {
              const isSelected = selected === hex;
              const isRight = showAnswer && hex === question.answer;
              const isWrong =
                showAnswer && isSelected && hex !== question.answer;
              return (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={hex}
                  onClick={() => handleSelect(hex)}
                  className={`py-3 px-4 rounded-xl font-mono text-sm text-white transition-all duration-300 border 
                    ${isRight ? 'bg-green-500 text-black border-green-500' : ''}
                    ${isWrong ? 'bg-red-500 text-black border-red-500' : ''}
                    ${!isRight && !isWrong ? 'bg-zinc-700 hover:bg-zinc-600 border-zinc-600' : ''}
                  `}
                >
                  {hex}
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
