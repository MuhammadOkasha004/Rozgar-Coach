export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface QuestionRequest {
  jobCategory: string;
  difficulty: string;
  language: string;
  questionNumber: number;
  history: ConversationMessage[];
}

export interface AnswerRequest {
  jobCategory: string;
  question: string;
  userAnswer: string;
  language: string;
  questionNumber: number;
}

export interface FeedbackResponse {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  relevanceScore: number;
  strongPoints: string[];
  improvementAreas: string[];
  detailedFeedback: string;
  idealAnswer: string;
  questionScore: number;
}

export interface FeedbackItem {
  questionNumber: number;
  question: string;
  userAnswer: string;
  feedback: FeedbackResponse;
}

export interface MCQ {
  questionNumber: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface MCQSet {
  jobCategory: string;
  language: string;
  questions: MCQ[];
}

export interface QuestionsBankRequest {
  jobCategory: string;
  difficulty: string;
  language: string;
}

export interface JobCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  questionCount: number;
  color: string;
}

export interface StoredQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  timesSeen: number;
  timesCorrect: number;
  lastSeenAt: number;
}
