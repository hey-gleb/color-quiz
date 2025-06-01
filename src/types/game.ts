type QuestionType = 'quiz' | 'match' | 'mathExpression' | 'sortBySaturation';

interface GameRound {
  questionType: QuestionType;
  difficulty: number;
}

export type { GameRound, QuestionType };
