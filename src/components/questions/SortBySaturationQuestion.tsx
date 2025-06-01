import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button.tsx';
import QuestionTitle from '@/components/questionTitle/QuestionTitle.tsx';

import type { QuestionProps } from '@/components/questions/index.ts';

import useGameState from '@/hooks/useGameState';

type ColorItem = {
  id: number;
  hex: string;
};

const hexToHsl = (hex: string): [number, number, number] => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  }

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s, l];
};

const generateColors = (): ColorItem[] => {
  const baseHue = Math.floor(Math.random() * 360);
  // const saturations = [0.2, 0.4, 0.6, 0.8];
  const saturations = [0.52, 0.49, 0.62, 0.81];
  const shuffled = [...saturations].sort(() => Math.random() - 0.5);

  return shuffled.map((s, i) => {
    const h = baseHue;
    const l = 0.5;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let [r, g, b] = [0, 0, 0];

    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    const m = l - c / 2;
    const hex = `#${[r + m, g + m, b + m]
      .map((v) =>
        Math.round(v * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')}`;

    return { id: i, hex };
  });
};

const SortBySaturationQuestion: React.FC<QuestionProps> = (props) => {
  const { onAnswerSubmit } = props;
  const { gameState } = useGameState();

  const [colors, setColors] = useState<ColorItem[]>(generateColors());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleClick = (index: number) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      const newColors = [...colors];
      [newColors[selectedIndex], newColors[index]] = [
        newColors[index],
        newColors[selectedIndex],
      ];
      setColors(newColors);
      setSelectedIndex(null);
    }
  };

  const checkAnswer = () => {
    const userOrder = colors.map((c) => hexToHsl(c.hex)[1]);
    const correct = [...userOrder].sort((a, b) => a - b);
    const isCorrect = userOrder.every((v, i) => v === correct[i]);
    setIsCorrect(isCorrect);
  };

  const handleNextRound = () => {
    const currentGameState = { ...gameState };
    if (isCorrect) currentGameState.score += 1;
    currentGameState.answers.push({
      questionColor: colors[0].hex,
      selected: [
        { color: colors[0].hex!, result: isCorrect ? 'correct' : 'wrong' },
      ],
      correct: colors[0].hex,
    });
    onAnswerSubmit(currentGameState);
  };

  return (
    <>
      <QuestionTitle>
        Sort colors by saturation (from lower to higher)
      </QuestionTitle>
      <div className="w-full flex flex-col gap-4">
        {colors.map((color, index) => (
          <motion.div
            key={color.id}
            layout
            onClick={() => handleClick(index)}
            className={`w-full h-15 max-w-md rounded-md cursor-pointer border-4 transition-all flex flex-col items-center justify-center ${
              selectedIndex === index
                ? 'border-blue-400 scale-105'
                : 'border-transparent'
            }`}
            style={{
              backgroundColor: color.hex,
              boxShadow: isCorrect
                ? '0 0 5px #00c951, 0 0 10px #00c951, 0 0 20px #00c951'
                : isCorrect === false
                  ? '0 0 5px #fb2c36, 0 0 10px #fb2c36, 0 0 20px #fb2c36'
                  : 'none',
            }}
            whileTap={{ scale: 0.95 }}
          >
            {color.hex.toUpperCase()}
          </motion.div>
        ))}
      </div>
      {isCorrect !== null ? (
        <Button onClick={handleNextRound} variant={'secondary'} size={'lg'}>
          Next Round
        </Button>
      ) : (
        <Button onClick={checkAnswer} variant={'secondary'} size={'lg'}>
          Confirm
        </Button>
      )}
    </>
  );
};

export default SortBySaturationQuestion;
