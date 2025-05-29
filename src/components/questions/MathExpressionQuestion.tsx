import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';

import { Button } from '@/components/ui/button.tsx';
import QuestionTitle from '@/components/questionTitle/QuestionTitle.tsx';

import useAudio from '@/hooks/useAudio.ts';
import useGameState from '@/hooks/useGameState';

import type { QuestionProps } from '@/components/questions/index.ts';

import { mixColors } from '@/colors.ts';
import { getRandomNumber } from '@/utils/random.ts';

type ColorItem = {
  color: string;
};

interface TargetColor {
  color: string;
  mixOf: string[];
}

const baseColors = [
  '#FF0000', // red
  '#00FF00', // green
  '#0000FF', // blue
  '#FFFF00', // yellow
  '#00FFFF', // cyan
  '#FF00FF', // magenta
  '#FFA500', // orange
  '#8B4513', // brown
  // Disabled for now
  // '#FFC0CB', // pink
  // '#40E0D0', // turquoise
];

const getRandomBaseColor = () => {
  const randomBaseColorIndex = getRandomNumber(baseColors.length);
  return baseColors[randomBaseColorIndex];
};

const ROUND_SCORE = 3;

const getTargetColor = () => {
  const mainRandomColor = getRandomBaseColor();
  let additionalRandomColor = mainRandomColor;
  while (mainRandomColor === additionalRandomColor)
    additionalRandomColor = getRandomBaseColor();
  return {
    color: mixColors(mainRandomColor, additionalRandomColor).toUpperCase(),
    mixOf: [mainRandomColor, additionalRandomColor],
  };
};

const MathExpressionQuestion: React.FC<QuestionProps> = (props) => {
  const { onAnswerSubmit } = props;
  const { gameState } = useGameState();

  const [slot1, setSlot1] = useState<string | null>(null);
  const [slot2, setSlot2] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [targetColor, _] = useState<TargetColor>(getTargetColor());
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const { play } = useAudio();

  const handleDrop1 = (color: string) => setSlot1(color);
  const handleDrop2 = (color: string) => setSlot2(color);

  const handleSubmit = () => {
    if (slot1 && slot2) {
      const resultColor = mixColors(slot1, slot2).toUpperCase();
      setIsCorrect(resultColor === targetColor.color);
      setShowAnswer(true);
      play(resultColor === targetColor.color ? 'correctAnswer' : 'wrongAnswer');
    }
  };

  const colorOptions = useMemo(() => {
    const indexArray = Array.from(Array(baseColors.length).keys());
    const randomColorsOptions: string[] = [];
    while (indexArray.length) {
      const randomIndex = getRandomNumber(indexArray.length);
      const randomColorIndex = indexArray[randomIndex];
      const randomColor = baseColors[randomColorIndex];
      randomColorsOptions.push(randomColor);
      indexArray.splice(randomIndex, 1);
    }
    return randomColorsOptions;
  }, []);

  const handleNextRound = () => {
    const getResult = (c: string) => {
      return targetColor.mixOf.includes(c) ? 'correct' : 'wrong';
    };
    const currentGameState = { ...gameState };
    currentGameState.score += isCorrect! ? ROUND_SCORE : 1;
    currentGameState.answers.push({
      questionColor: targetColor.color,
      // TODO rework
      selected: [
        { color: slot1!, result: getResult(slot1!) },
        { color: slot2!, result: getResult(slot2!) },
      ],
      correct: targetColor.color,
    });
    onAnswerSubmit(currentGameState);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-6 items-center">
        <QuestionTitle>Mix colors to get the target one</QuestionTitle>

        <div className="flex items-center space-x-4">
          <DropSlot
            color={slot1}
            onDrop={handleDrop1}
            isColorInMix={
              showAnswer ? targetColor.mixOf.includes(slot1!) : null
            }
          />
          <span className="text-3xl">+</span>
          <DropSlot
            color={slot2}
            onDrop={handleDrop2}
            isColorInMix={
              showAnswer ? targetColor.mixOf.includes(slot2!) : null
            }
          />
          <span className="text-3xl">=</span>
          <div
            className="w-16 h-16 rounded-md border border-gray-300"
            style={{
              backgroundColor: targetColor.color,
            }}
          />
        </div>

        <div className="mt-6 mb-6 grid grid-cols-4 gap-4">
          {colorOptions.map((color) => (
            <DraggableColor
              key={color}
              color={color}
              shouldRunAnimation={
                isCorrect !== null && targetColor.mixOf.includes(color)
              }
            />
          ))}
        </div>
        {isCorrect !== null ? (
          <Button onClick={handleNextRound} variant={'secondary'} size={'lg'}>
            Next round
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant={'secondary'} size={'lg'}>
            Confirm
          </Button>
        )}
      </div>
    </DndProvider>
  );
};

export default MathExpressionQuestion;

const DraggableColor = ({
  color,
  shouldRunAnimation,
}: {
  color: string;
  shouldRunAnimation: boolean;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'color',
    item: { color },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      // @ts-ignore
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <motion.div
        className={
          'w-13 h-13 m-1 rounded-md border border-gray-700 cursor-grab'
        }
        style={{
          background: color,
          boxShadow: shouldRunAnimation
            ? '0 0 5px #00c951, 0 0 10px #00c951, 0 0 20px #00c951'
            : 'none',
        }}
        animate={
          shouldRunAnimation
            ? {
                scale: [1, 1.3, 1.3],
                rotate: [0, -15, 15, 0],
              }
            : {}
        }
        transition={{ duration: 0.6 }}
      />
    </div>
  );
};

const DropSlot = ({
  onDrop,
  color,
  isColorInMix,
}: {
  onDrop: (color: string) => void;
  color: string | null;
  isColorInMix: boolean | null;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'color',
    drop: (item: ColorItem) => onDrop(item.color),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const additionalStyles = useMemo(() => {
    if (isColorInMix === null) return {};
    return isColorInMix
      ? { boxShadow: '0 0 5px #00c951, 0 0 10px #00c951, 0 0 20px #00c951' }
      : {
          boxShadow: '0 0 5px #fb2c36, 0 0 10px #fb2c36, 0 0 20px #fb2c36',
        };
  }, [isColorInMix]);

  return (
    <div
      // @ts-ignore
      ref={drop}
      className={'w-15 h-15 rounded-md border border-gray-300'}
      style={{
        backgroundColor: color ?? (isOver ? '#eee' : '#fff'),
        ...additionalStyles,
      }}
    />
  );
};
