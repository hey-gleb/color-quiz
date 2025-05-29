import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import useGameState from '@/hooks/useGameState.ts';
import useAudio from '@/hooks/useAudio.ts';

import { Button } from '@/components/ui/button.tsx';
import QuestionTitle from '@/components/questionTitle/QuestionTitle.tsx';

import type { QuestionProps } from '@/components/questions/index.ts';

import { generateQuestion } from '@/colors.ts';

const QuizQuestion: React.FC<QuestionProps> = (props) => {
  const { onAnswerSubmit, difficulty } = props;
  const { gameState } = useGameState();
  const { play } = useAudio();

  const [selected, setSelected] = useState<string | null>(null);
  const [question, _] = useState(generateQuestion(difficulty));

  const showAnswer = useRef(false);

  const handleSelect = useCallback(
    (hex: string) => {
      if (showAnswer.current) return;
      setSelected(hex);
      showAnswer.current = true;
      play(hex === question.answer ? 'correctAnswer' : 'wrongAnswer');
    },
    [gameState]
  );

  const handleNextRound = () => {
    const currentGameState = { ...gameState };
    const isCorrect = selected === question.answer;
    if (isCorrect) currentGameState.score += 1;
    currentGameState.answers.push({
      questionColor: question.answer,
      selected: [{ color: selected!, result: isCorrect ? 'correct' : 'wrong' }],
      correct: question.answer,
    });
    onAnswerSubmit(currentGameState);
  };

  return (
    <>
      <QuestionTitle>What's this color Hex</QuestionTitle>
      <div
        className="w-40 h-40 rounded-xl mb-10 border border-zinc-700"
        style={{ backgroundColor: question.answer }}
      />
      <div className="grid grid-cols-2 gap-4 w-full">
        {question.options.map((hex) => {
          const isSelected = selected === hex;
          const isRight = showAnswer.current && hex === question.answer;
          const isWrong =
            showAnswer.current && isSelected && hex !== question.answer;
          return (
            <motion.button
              key={hex}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(hex)}
              className={`py-3 px-4 rounded-xl font-mono text-sm text-white duration-300 border cursor-pointer
                    ${isRight ? 'bg-green-500 text-black border-green-500' : ''}
                    ${isWrong ? 'bg-red-500 text-black border-red-500' : ''}
                    ${!isRight && !isWrong ? 'bg-zinc-700 hover:bg-zinc-600 border-zinc-600' : ''}
                  `}
              animate={
                isRight
                  ? {
                      scale: [1, 1.1, 1.1],
                      rotate: [0, -15, 15, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.6 }}
            >
              {hex}
            </motion.button>
          );
        })}
      </div>
      {showAnswer.current && (
        <Button
          onClick={handleNextRound}
          variant={'secondary'}
          size={'lg'}
          className={'mt-5'}
        >
          Next round
        </Button>
      )}
    </>
  );
};

export default QuizQuestion;
