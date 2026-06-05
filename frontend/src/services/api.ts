import axios from 'axios';
import type { QuestionRequest, AnswerRequest, FeedbackResponse, QuestionsBankRequest, MCQSet } from './types';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 90000,
  headers: { 'Content-Type': 'application/json' },
});

export const getNextQuestion = async (data: QuestionRequest): Promise<string> => {
  const response = await api.post<{ question: string }>('/interview/question', data);
  return response.data.question;
};

export const evaluateAnswer = async (data: AnswerRequest): Promise<FeedbackResponse> => {
  const response = await api.post<FeedbackResponse>('/interview/evaluate', data);
  return response.data;
};

export const getQuestionsBank = async (data: QuestionsBankRequest): Promise<MCQSet> => {
  const response = await api.post<MCQSet>('/interview/questions-bank', data);
  return response.data;
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/interview/health');
    return response.status === 200;
  } catch {
    return false;
  }
};

export default api;
