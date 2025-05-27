import React, { useCallback, useRef, useState } from 'react';
import useGameState from '@/hooks/useGameState.ts';
import useAudio from '@/hooks/useAudio.ts';
import { generateQuestion } from '@/colors.ts';
import { motion } from 'framer-motion';
import type { QuestionProps } from '@/components/questions/index.ts';

const QuizQuestion: React.FC<QuestionProps> = (props) => {
  const { onAnswerSubmit } = props;
  const { gameState } = useGameState();
  const { play } = useAudio();

  const [selected, setSelected] = useState<string | null>(null);
  const [question, setQuestion] = useState(generateQuestion(gameState.round));

  const showAnswer = useRef(false);

  const handleSelect = useCallback(
    (hex: string) => {
      if (showAnswer.current) return;
      setSelected(hex);
      showAnswer.current = true;

      const currentGameState = { ...gameState };

      if (hex === question.answer) currentGameState.score += 1;
      play(hex === question.answer ? 'correctAnswer' : 'wrongAnswer');

      setTimeout(() => {
        currentGameState.answers.push({
          questionColor: question.answer,
          selected: hex,
          correct: question.answer,
          isCorrect: hex === question.answer,
        });
        onAnswerSubmit(currentGameState);
        setQuestion(generateQuestion(currentGameState.round));
        setSelected(null);
        showAnswer.current = false;
      }, 1500);
    },
    [gameState]
  );

  return (
    <>
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
    </>
  );
};

export default QuizQuestion;
