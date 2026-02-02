export interface Period {
  id: string;
  title: string;
  years: string;
  shortDescription: string;
  image: string;
  gallery?: string[]; // Array of additional images
  audioUrl?: string; // Path to the audio file
  staticContent?: PeriodContent;
  staticQuiz?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

export interface PeriodContent {
  fullText: string;
  keyEvents: string[];
}

export interface ScoreRecord {
  periodId: string;
  periodName: string;
  score: number;
  total: number;
  date: string;
}