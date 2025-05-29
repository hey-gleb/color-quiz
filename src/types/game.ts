type QuestionType = 'quiz' | 'match' | 'mathExpression';

interface GameRound {
  questionType: QuestionType;
  difficulty: number;
}

export type { GameRound, QuestionType };
