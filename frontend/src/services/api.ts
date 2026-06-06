import axios from 'axios';
import type { QuestionRequest, AnswerRequest, FeedbackResponse, QuestionsBankRequest, MCQSet } from './types';


export const BASE_URL = 'https://okasha25:okasha123@okasha25-001-site1.site4future.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 90000,
  headers: { 'Content-Type': 'application/json' },
});

export const getNextQuestion = async (data: QuestionRequest): Promise<string> => {
  const response = await api.post<{ question: string }>('/Interview/question', data);
  return response.data.question;
};

export const evaluateAnswer = async (data: AnswerRequest): Promise<FeedbackResponse> => {
  const response = await api.post<FeedbackResponse>('/Interview/evaluate', data);
  return response.data;
};

export const getQuestionsBank = async (data: QuestionsBankRequest): Promise<MCQSet> => {
  const response = await api.post<MCQSet>('/Interview/questions-bank', data);
  return response.data;
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/Interview/health');
    return response.status === 200;
  } catch {
    return false;
  }
};

export default api;
