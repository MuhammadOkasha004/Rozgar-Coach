import type { JobCategory } from '../services/types';
import { Building2, Landmark, Code2, GraduationCap, TrendingUp, HeartPulse } from 'lucide-react';

export const jobCategories: JobCategory[] = [
  {
    id: 'government',
    title: 'Government / BPS Jobs',
    description: 'FPSC, PPSC, SPSC, NTS, PTS — BPS scale interviews',
    icon: 'Building2',
    difficulty: 'intermediate',
    questionCount: 500,
    color: 'from-lime-400 to-lime-600',
  },
  {
    id: 'banking',
    title: 'Banking & Finance',
    description: 'HBL, UBL, Meezan, State Bank — OG-1, OG-2, OG-3',
    icon: 'Landmark',
    difficulty: 'intermediate',
    questionCount: 350,
    color: 'from-green-400 to-lime-500',
  },
  {
    id: 'it',
    title: 'IT & Software',
    description: 'Software engineers, web dev, data science, DevOps',
    icon: 'Code2',
    difficulty: 'expert',
    questionCount: 700,
    color: 'from-lime-500 to-green-600',
  },
  {
    id: 'teaching',
    title: 'Teaching / Education',
    description: 'School teachers, lecturers, professors, trainers',
    icon: 'GraduationCap',
    difficulty: 'beginner',
    questionCount: 280,
    color: 'from-lime-300 to-lime-500',
  },
  {
    id: 'sales',
    title: 'Sales & Marketing',
    description: 'B2B, B2C, digital marketing, brand management',
    icon: 'TrendingUp',
    difficulty: 'beginner',
    questionCount: 320,
    color: 'from-green-300 to-lime-500',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'Doctors, nurses, pharmacists, medical officers',
    icon: 'HeartPulse',
    difficulty: 'expert',
    questionCount: 410,
    color: 'from-lime-400 to-green-500',
  },
];

export const getIcon = (name: string) => {
  const map: Record<string, any> = {
    Building2,
    Landmark,
    Code2,
    GraduationCap,
    TrendingUp,
    HeartPulse,
  };
  return map[name] || Building2;
};
