import { create } from 'zustand';
import type { MCQ, FeedbackItem, StoredQuestion } from '../services/types';

const REVIEW_COUNT = 3;

interface InterviewStore {
  jobCategory: string;
  jobTitle: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  mcqs: MCQ[];
  currentIndex: number;
  selectedAnswers: number[];
  allFeedback: FeedbackItem[];
  startTime: number | null;
  isLoading: boolean;
  error: string | null;
  reviewIndices: number[];

  setJobConfig: (category: string, title: string, difficulty: string) => void;
  setMCQs: (mcqs: MCQ[]) => void;
  selectAnswer: (optionIndex: number) => void;
  nextQuestion: () => void;
  setLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
  resetSession: () => void;
  getScore: () => number;
  getResults: () => { correct: number; incorrect: number; total: number };
}

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  jobCategory: '',
  jobTitle: '',
  difficulty: 'intermediate',
  mcqs: [],
  currentIndex: 0,
  selectedAnswers: [],
  allFeedback: [],
  startTime: null,
  isLoading: false,
  error: null,
  reviewIndices: [],

  setJobConfig: (jobCategory, jobTitle, difficulty) =>
    set({
      jobCategory,
      jobTitle,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'expert',
    }),

  setMCQs: (mcqs) => {
    const state = get();
    const { mixed, reviewIndices } = mixQuestions(mcqs, state.jobCategory);
    set({
      mcqs: mixed,
      currentIndex: 0,
      selectedAnswers: new Array(mixed.length).fill(-1),
      allFeedback: [],
      startTime: Date.now(),
      error: null,
      reviewIndices,
    });
  },

  selectAnswer: (optionIndex) =>
    set((s) => {
      const newAnswers = [...s.selectedAnswers];
      newAnswers[s.currentIndex] = optionIndex;
      return { selectedAnswers: newAnswers };
    }),

  nextQuestion: () => {
    const state = get();
    const nextIdx = state.currentIndex + 1;
    if (nextIdx >= state.mcqs.length) {
      const feedback = buildFeedback(state.mcqs, state.selectedAnswers);
      saveToQuestionBank(state.mcqs, state.selectedAnswers, state.jobCategory);
      set({ currentIndex: nextIdx, allFeedback: feedback });
    } else {
      set({ currentIndex: nextIdx });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (err) => set({ error: err }),

  resetSession: () =>
    set({
      mcqs: [],
      currentIndex: 0,
      selectedAnswers: [],
      allFeedback: [],
      startTime: null,
      isLoading: false,
      error: null,
      reviewIndices: [],
    }),

  getScore: () => {
    const s = get();
    if (s.mcqs.length === 0) return 0;
    const correct = s.mcqs.filter((q, i) => s.selectedAnswers[i] === q.correctOptionIndex).length;
    return Math.round((correct / s.mcqs.length) * 100);
  },

  getResults: () => {
    const s = get();
    const correct = s.mcqs.filter((q, i) => s.selectedAnswers[i] === q.correctOptionIndex).length;
    return { correct, incorrect: s.mcqs.length - correct, total: s.mcqs.length };
  },
}));

function buildFeedback(mcqs: MCQ[], selectedAnswers: number[]): FeedbackItem[] {
  return mcqs.map((mcq, i) => {
    const isCorrect = selectedAnswers[i] === mcq.correctOptionIndex;
    const chosenOption = selectedAnswers[i] >= 0 ? mcq.options[selectedAnswers[i]] : '(not answered)';
    const correctOption = mcq.options[mcq.correctOptionIndex];
    const strongPoints = isCorrect
      ? ['Correct answer selected']
      : [];

    let improvementAreas: string[];
    if (isCorrect) {
      improvementAreas = [];
    } else {
      const q = mcq.question.toLowerCase();
      const isTechnical = /(time complexity|algorithm|database|programming|code|software|api|sql|protocol|function|variable|debugging|syntax|server|client|data structure)/.test(q);
      const isCommunication = /(communicat|speak|present|explain|describe|convince|negotiate|persuade|listen)/.test(q);
      const isConfidence = /(confiden|nervous|hesitat|pressure|stress|stage fright|public)/.test(q);
      const isRelevance = /(relevan|focus|summarize|priority|organize|plan|strategy|goal)/.test(q);

      if (isTechnical) {
        improvementAreas = [
          `Technical knowledge gap: The correct answer was "${correctOption}". Study this concept in more depth.`,
          `Improvement tip: ${mcq.explanation}`,
        ];
      } else if (isCommunication) {
        improvementAreas = [
          `Communication weakness: Focus on clarity and structure when answering. Correct answer: "${correctOption}"`,
          `Improvement tip: ${mcq.explanation}`,
        ];
      } else if (isConfidence) {
        improvementAreas = [
          `Confidence gap: Answer with more conviction. The correct answer was: "${correctOption}"`,
          `Improvement tip: ${mcq.explanation}`,
        ];
      } else if (isRelevance) {
        improvementAreas = [
          `Answer relevance: Read the question carefully and stay on topic. Correct answer: "${correctOption}"`,
          `Improvement tip: ${mcq.explanation}`,
        ];
      } else {
        improvementAreas = [
          `The correct answer was "${correctOption}" — more practice needed on this topic.`,
          `Improvement tip: ${mcq.explanation}`,
        ];
      }
    }

    return {
      questionNumber: mcq.questionNumber,
      question: mcq.question,
      userAnswer: chosenOption,
      feedback: {
        overallScore: isCorrect ? 100 : 0,
        communicationScore: isCorrect ? 100 : 0,
        technicalScore: isCorrect ? 100 : 0,
        confidenceScore: isCorrect ? 100 : 0,
        relevanceScore: isCorrect ? 100 : 0,
        questionScore: isCorrect ? 100 : 0,
        strongPoints,
        improvementAreas,
        detailedFeedback: mcq.explanation,
        idealAnswer: correctOption,
      },
    };
  });
}

function generateQuestionId(question: string): string {
  const clean = question.toLowerCase().replace(/\s+/g, ' ').trim();
  return clean.substring(0, 30) + ':' + clean.length;
}

function getBankKey(category: string): string {
  return `rozgar-bank-${category}`;
}

function loadQuestionBank(category: string): StoredQuestion[] {
  if (!category) return [];
  try {
    const raw = localStorage.getItem(getBankKey(category));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToQuestionBank(mcqs: MCQ[], selectedAnswers: number[], category: string) {
  if (!category) return;
  const bank = loadQuestionBank(category);
  const map = new Map(bank.map((q) => [q.id, q]));

  mcqs.forEach((mcq, i) => {
    const id = generateQuestionId(mcq.question);
    const wasCorrect = selectedAnswers[i] === mcq.correctOptionIndex;
    const existing = map.get(id);

    if (existing) {
      existing.timesSeen += 1;
      existing.timesCorrect += wasCorrect ? 1 : 0;
      existing.lastSeenAt = Date.now();
    } else {
      map.set(id, {
        id,
        question: mcq.question,
        options: mcq.options,
        correctOptionIndex: mcq.correctOptionIndex,
        explanation: mcq.explanation,
        timesSeen: 1,
        timesCorrect: wasCorrect ? 1 : 0,
        lastSeenAt: Date.now(),
      });
    }
  });

  localStorage.setItem(getBankKey(category), JSON.stringify(Array.from(map.values())));
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function mixQuestions(
  newQuestions: MCQ[],
  category: string,
): { mixed: MCQ[]; reviewIndices: number[] } {
  const bank = loadQuestionBank(category);
  if (!category || newQuestions.length === 0 || bank.length === 0) {
    const shuffled = shuffleArray(newQuestions);
    const mixed = shuffled.map((q, i) => ({ ...q, questionNumber: i + 1 }));
    return { mixed, reviewIndices: [] };
  }

  const candidates = [...bank].sort((a, b) => {
    const aAcc = a.timesSeen > 0 ? a.timesCorrect / a.timesSeen : 0;
    const bAcc = b.timesSeen > 0 ? b.timesCorrect / b.timesSeen : 0;
    if (a.timesSeen !== b.timesSeen) return a.timesSeen - b.timesSeen;
    if (a.lastSeenAt !== b.lastSeenAt) return a.lastSeenAt - b.lastSeenAt;
    return aAcc - bAcc;
  });

  const count = Math.min(REVIEW_COUNT, candidates.length, Math.floor(newQuestions.length * 0.4));
  const picked = candidates.slice(0, count);
  const reviewIds = new Set(picked.map((sq) => sq.id));

  const reviewMCQs: MCQ[] = picked.map((sq) => ({
    questionNumber: 0,
    question: sq.question,
    options: sq.options,
    correctOptionIndex: sq.correctOptionIndex,
    explanation: sq.explanation,
  }));

  const remaining = [...newQuestions];
  const toRemove = new Set<number>();
  while (toRemove.size < count) {
    toRemove.add(Math.floor(Math.random() * remaining.length));
  }
  const mix = remaining.filter((_, i) => !toRemove.has(i));
  mix.push(...reviewMCQs);

  const shuffled = shuffleArray(mix);
  const reviewIndices: number[] = [];
  const final = shuffled.map((q, i) => {
    const id = generateQuestionId(q.question);
    if (reviewIds.has(id)) {
      reviewIndices.push(i);
    }
    return { ...q, questionNumber: i + 1 };
  });

  return { mixed: final, reviewIndices };
}
