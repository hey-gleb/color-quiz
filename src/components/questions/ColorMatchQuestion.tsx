import React, { useState } from 'react';
import { generateQuestion } from '@/colors.ts';
import { hsvaToHex, ShadeSlider, Wheel } from '@uiw/react-color';
import { Button } from '@/components/ui/button.tsx';
import useGameState from '@/hooks/useGameState';
import type { QuestionProps } from '@/components/questions/index.ts';
import QuestionTitle from '@/components/questionTitle/QuestionTitle.tsx';
import useAudio from '@/hooks/useAudio.ts';

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const colorDifference = (c1: string, c2: string) => {
  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);
  const diff = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );
  return (diff / 441.67295593) * 100; // Normalize by max RGB distance
};

const getScoreFromDifference = (diff: number): number => {
  if (diff <= 5) return 5;
  if (diff <= 7) return 4;
  if (diff <= 10) return 3;
  if (diff <= 15) return 2;
  if (diff <= 20) return 1;
  return 0;
};

const ColorMatchQuestion: React.FC<QuestionProps> = (props) => {
  const { onAnswerSubmit, difficulty } = props;
  const { gameState } = useGameState();
  const { play } = useAudio();
  const [question, _] = useState(generateQuestion(difficulty));
  const [selectedColor, setSelectedColor] = useState({
    h: 214,
    s: 43,
    v: 90,
    a: 1,
  });
  const [score, setScore] = useState<number | null>(null);
  const [diff, setDiff] = useState<number | null>(null);

  const handleSubmit = () => {
    const d = colorDifference(question.answer, hsvaToHex(selectedColor));
    const s = getScoreFromDifference(d);
    setScore(s);
    play(score || 0 > 0 ? 'correctAnswer' : 'wrongAnswer');
    setDiff(parseFloat(d.toFixed(2)));
  };

  const handleNextRound = () => {
    const currentGameState = { ...gameState };
    currentGameState.score += score || 0;
    currentGameState.answers.push({
      questionColor: question.answer,
      selected: hsvaToHex(selectedColor),
      correct: question.answer,
      isCorrect:
        colorDifference(question.answer, hsvaToHex(selectedColor)) <= 5,
    });
    onAnswerSubmit(currentGameState);
  };

  return (
    <>
      <QuestionTitle title={'Match the color as closely as possible'} />

      <div className="flex gap-10 items-center">
        <div>
          <p className="mb-2 text-sm text-zinc-400 text-center">Your color</p>
          <div
            className="w-24 h-24 rounded-xl border border-zinc-700"
            style={{ backgroundColor: hsvaToHex(selectedColor) }}
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-zinc-400 text-center">Target color</p>
          <div
            className="w-24 h-24 rounded-xl border border-zinc-700"
            style={{ backgroundColor: question.answer }}
          />
        </div>
      </div>

      <div className={'relative'}>
        <Wheel
          color={selectedColor}
          onChange={(color) =>
            setSelectedColor({ ...selectedColor, ...color.hsva })
          }
        />
        <div className={'absolute top-0 -right-10'}>
          <ShadeSlider
            height={200}
            width={16}
            hsva={selectedColor}
            direction={'vertical'}
            onChange={(newShade) => {
              setSelectedColor({ ...selectedColor, ...newShade });
            }}
          />
        </div>
      </div>
      {score !== null ? (
        <Button onClick={handleNextRound} variant={'secondary'} size={'lg'}>
          Next round
        </Button>
      ) : (
        <Button onClick={handleSubmit} variant={'secondary'} size={'lg'}>
          Confirm
        </Button>
      )}

      {score !== null && diff !== null && (
        <div className="mt-4 text-center">
          <p>Match: {100 - diff.toFixed(2)}%</p>
          <p>Your score: {score} / 5</p>
        </div>
      )}
    </>
  );
};

export default ColorMatchQuestion;
