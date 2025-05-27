type QuestionType = 'quiz' | 'match';

interface GameRound {
  questionType: QuestionType;
  difficulty: number;
}

export type { GameRound, QuestionType };
