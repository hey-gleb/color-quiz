import React, { useMemo, useState } from 'react';
import chroma from 'chroma-js';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';

import { Button } from '@/components/ui/button.tsx';
import QuestionTitle from '@/components/questionTitle/QuestionTitle.tsx';

import useAudio from '@/hooks/useAudio.ts';
import useGameState from '@/hooks/useGameState';

import type { QuestionProps } from '@/components/questions/index.ts';

type ColorItem = {
  color: string;
};

const getRandomNumber = (max: number) => Math.floor(Math.random() * max);

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

const mixColors = (c1: string, c2: string) =>
  chroma.mix(c1, c2).hex().toUpperCase();

const DraggableColor = ({ color }: { color: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'color',
    item: { color },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={'w-13 h-13 m-1 rounded-md border border-gray-700 cursor-grab'}
      style={{
        backgroundColor: color,
        opacity: isDragging ? 0.5 : 1,
      }}
    />
  );
};

const DropSlot = ({
  onDrop,
  color,
  isCorrect = true,
}: {
  onDrop: (color: string) => void;
  color: string | null;
  isCorrect: boolean | null;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'color',
    drop: (item: ColorItem) => onDrop(item.color),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const additionalStyles =
    isCorrect === null || isCorrect
      ? {}
      : { borderColor: 'red', borderWidth: '2px' };

  return (
    <div
      ref={drop}
      className={'w-15 h-15 rounded-md border border-gray-300'}
      style={{
        backgroundColor: color ?? (isOver ? '#eee' : '#fff'),
        ...additionalStyles,
      }}
    />
  );
};

const ROUND_SCORE = 3;

const MathExpressionQuestion: React.FC<QuestionProps> = (props) => {
  const { onAnswerSubmit } = props;
  const { gameState } = useGameState();

  const [slot1, setSlot1] = useState<string | null>(null);
  const [slot2, setSlot2] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [resultColor, setResultColor] = useState<string | null>(null);

  const { play } = useAudio();

  const handleDrop1 = (color: string) => setSlot1(color);
  const handleDrop2 = (color: string) => setSlot2(color);

  const handleSubmit = () => {
    if (slot1 && slot2) {
      const resultColor = mixColors(slot1, slot2).toUpperCase();
      setResultColor(resultColor);
      setIsCorrect(resultColor === targetColor);
      play(resultColor === targetColor ? 'correctAnswer' : 'wrongAnswer');
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

  const targetColor = useMemo(() => {
    const mainRandomColor = baseColors[getRandomNumber(baseColors.length)];
    let additionalRandomColor = baseColors[getRandomNumber(baseColors.length)];
    while (mainRandomColor === additionalRandomColor) {
      additionalRandomColor = baseColors[getRandomNumber(baseColors.length)];
    }
    return mixColors(mainRandomColor, additionalRandomColor);
  }, []);

  const handleNextRound = () => {
    const currentGameState = { ...gameState };
    currentGameState.score += isCorrect! ? ROUND_SCORE : 0;
    currentGameState.answers.push({
      questionColor: targetColor,
      // TODO rework
      selected: slot1!,
      correct: targetColor,
      isCorrect: isCorrect!,
    });
    onAnswerSubmit(currentGameState);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-6 items-center">
        <QuestionTitle title={'Mix colors to get the target one'} />

        <div className="flex items-center space-x-4">
          <DropSlot color={slot1} onDrop={handleDrop1} isCorrect={isCorrect} />
          <span className="text-3xl">+</span>
          <DropSlot color={slot2} onDrop={handleDrop2} isCorrect={isCorrect} />
          <span className="text-3xl">=</span>
          <div
            className="w-16 h-16 rounded-md border border-gray-300"
            style={{
              backgroundColor: targetColor,
            }}
          />
        </div>

        {resultColor && (
          <div className="text-lg">
            {isCorrect ? "✅ That's right!" : '❌ Incorrect...'}
          </div>
        )}

        <div className="mt-6 mb-6 grid grid-cols-4 gap-4">
          {colorOptions.map((color) => (
            <DraggableColor key={color} color={color} />
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
