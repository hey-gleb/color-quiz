import React, { useState } from 'react';
import chroma from 'chroma-js';
import {
  type HsvaColor,
  hsvaToHex,
  ShadeSlider,
  Wheel,
} from '@uiw/react-color';

import useAudio from '@/hooks/useAudio.ts';
import useGameState from '@/hooks/useGameState';

import { Button } from '@/components/ui/button.tsx';
import QuestionTitle from '@/components/questionTitle/QuestionTitle.tsx';

import { generateQuestion, getRandomColor } from '@/colors.ts';

import type { QuestionProps } from '@/components/questions/index.ts';

const colorDifference = (c1: string, c2: string) => {
  const [r1, g1, b1] = chroma(c1).rgb();
  const [r2, g2, b2] = chroma(c2).rgb();
  const diff = Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
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

const getStartColor = () => {
  const [h, s, v] = chroma(getRandomColor()).hsv();
  return { h, s: s * 100, v: v * 100, a: 1 };
};

const ColorMatchQuestion: React.FC<QuestionProps> = (props) => {
  const { onAnswerSubmit, difficulty } = props;
  const { gameState } = useGameState();
  const { play } = useAudio();
  const [question, _] = useState(generateQuestion(difficulty));
  const [selectedColor, setSelectedColor] =
    useState<HsvaColor>(getStartColor());

  const [score, setScore] = useState<number | null>(null);
  const [diff, setDiff] = useState<number | null>(null);

  const handleSubmit = () => {
    const d = colorDifference(question.answer, hsvaToHex(selectedColor));
    const s = getScoreFromDifference(d);
    setScore(s);
    play(score || 0 > 0 ? 'correctAnswer' : 'wrongAnswer');
    setDiff(parseFloat(d.toFixed(2)));
  };

  const getResult = () => {
    if (!diff) return 'wrong';
    if (diff > 20) {
      return 'wrong';
    } else if (diff <= 5) {
      return 'correct';
    }
    return 'partial';
  };

  const handleNextRound = () => {
    const currentGameState = { ...gameState };
    currentGameState.score += score || 0;
    currentGameState.answers.push({
      questionColor: question.answer,
      selected: [{ color: hsvaToHex(selectedColor), result: getResult() }],
      correct: question.answer,
    });
    onAnswerSubmit(currentGameState);
  };
  const wheelSize = 200;

  // @ts-ignore
  function colorToCoord(hex: string, fixedL: number): { x: number; y: number } {
    const rgb = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const angle = (h / 360) * 2 * Math.PI;
    console.log(l, fixedL);

    // Вместо только насыщенности учитываем и яркость
    const radius = s * l * (wheelSize / 2 - 10);

    const x = wheelSize / 2 - radius * Math.cos(angle);
    const y = wheelSize / 2 - radius * Math.sin(angle);

    return { x, y };
  }

  return (
    <>
      <QuestionTitle>Match the color as closely as possible</QuestionTitle>

      <div
        className={`flex items-center ${diff !== null ? 'gap-5' : 'gap-15'}`}
      >
        <div>
          <p className="mb-2 text-sm white text-center">Your color</p>
          <div
            className="w-20 h-20 rounded-xl border border-zinc-700"
            style={{ backgroundColor: hsvaToHex(selectedColor) }}
          />
        </div>

        {score !== null && diff !== null && (
          <div className="mt-6 text-center">
            <p>Match: {(100 - (diff || 0)).toFixed(2)}%</p>
            <p>Score: {score} / 5</p>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm text-white text-center">Target color</p>
          <div
            className="w-20 h-20 rounded-xl border border-zinc-700"
            style={{ backgroundColor: question.answer }}
          />
        </div>
      </div>

      <div className={'relative'}>
        <div className="relative" style={{ width: 200, height: 200 }}>
          <Wheel
            color={selectedColor}
            onChange={(color) =>
              setSelectedColor({ ...selectedColor, ...color.hsva })
            }
          />
          {/*{score !== null && diff !== null && (*/}
          {/*  <svg*/}
          {/*    className="absolute top-0 left-0 pointer-events-none"*/}
          {/*    width={200}*/}
          {/*    height={200}*/}
          {/*  >*/}
          {/*    {(() => {*/}
          {/*      const { r, g, b } = hexToRgb(question.answer);*/}
          {/*      const [, , correctL] = rgbToHsl(r, g, b);*/}
          {/*      const user = colorToCoord(hsvaToHex(selectedColor), correctL);*/}
          {/*      const correct = colorToCoord(question.answer, correctL);*/}
          {/*      return (*/}
          {/*        <>*/}
          {/*          /!* Line from user to correct *!/*/}
          {/*          <line*/}
          {/*            x1={user.x}*/}
          {/*            y1={user.y}*/}
          {/*            x2={correct.x}*/}
          {/*            y2={correct.y}*/}
          {/*            stroke="white"*/}
          {/*            strokeWidth={2}*/}
          {/*          />*/}
          {/*          /!* Correct point *!/*/}
          {/*          <circle*/}
          {/*            cx={correct.x}*/}
          {/*            cy={correct.y}*/}
          {/*            r={6}*/}
          {/*            fill={question.answer}*/}
          {/*            stroke="white"*/}
          {/*            strokeWidth={2}*/}
          {/*          />*/}
          {/*        </>*/}
          {/*      );*/}
          {/*    })()}*/}
          {/*  </svg>*/}
          {/*)}*/}
        </div>
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
        <Button
          onClick={handleNextRound}
          variant={'secondary'}
          size={'lg'}
          className={'mt-5'}
        >
          Next round
        </Button>
      ) : (
        <Button
          onClick={handleSubmit}
          variant={'secondary'}
          size={'lg'}
          className={'mt-5'}
        >
          Confirm
        </Button>
      )}
    </>
  );
};

export default ColorMatchQuestion;

// Вспомогательные функции:
function hexToRgb(hex: string) {
  const parsed = hex.replace(/^#/, '');
  const bigint = parseInt(parsed, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h: number = 0,
    s: number = 0,
    l: number = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}
