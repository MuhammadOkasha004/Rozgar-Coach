import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gauge } from 'lucide-react';
import JobCard from '../components/JobCard';
import { jobCategories } from '../services/jobData';
import { useInterviewStore } from '../store/interviewStore';

export default function SelectJobPage() {
  const navigate = useNavigate();
  const { setJobConfig } = useInterviewStore();
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');

  const canStart = selectedJob !== '';

  const handleStart = () => {
    if (!canStart) return;
    const job = jobCategories.find((j) => j.id === selectedJob)!;
    setJobConfig(job.id, job.title, difficulty);
    navigate('/interview');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-block px-4 py-1.5 bg-lime-100 border border-lime-300 rounded-full text-lime-700 text-xs font-bold mb-4 dark:bg-gray-800 dark:border-gray-600 dark:text-lime-400">
            STEP 1 OF 3
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-darkgreen dark:text-lime-100 mb-3">
            Choose Your <span className="text-lime-600 dark:text-lime-400">Job Category</span>
          </h1>
        </div>

        <div className="card-static mb-8 bg-gradient-to-br from-lime-50 to-white dark:from-gray-800 dark:to-gray-900 animate-fade-up stagger-1">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                <h3 className="font-bold text-darkgreen dark:text-lime-100">Difficulty Level</h3>
              </div>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'expert'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm capitalize transition-all ${
                      difficulty === d
                        ? 'bg-lime-500 text-white shadow-lime'
                        : 'bg-white border-2 border-lime-200 text-darkgreen hover:border-lime-400 dark:bg-gray-800 dark:border-gray-600 dark:text-lime-100 dark:hover:border-lime-500'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-darkgreen dark:text-lime-100 mb-6">Choose Your Field</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {jobCategories.map((job, i) => (
            <div key={job.id} className={`animate-fade-up stagger-${i + 1}`}>
              <JobCard
                job={job}
                selected={selectedJob === job.id}
                onSelect={() => setSelectedJob(job.id)}
              />
            </div>
          ))}
        </div>

        <div className="sticky bottom-4 z-10">
          <div className="card-static bg-gradient-to-r from-lime-500 to-lime-600 text-white p-5 flex items-center justify-between shadow-lime-lg animate-fade-up">
            <div>
              <div className="font-bold text-lg">
                {canStart
                  ? `${jobCategories.find((j) => j.id === selectedJob)?.title} Selected`
                  : 'Select a job to continue'}
              </div>
              <div className="text-sm text-lime-100">
                Difficulty: {difficulty} · 10 Questions
              </div>
            </div>
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="bg-white text-lime-700 hover:bg-lime-50 dark:bg-gray-800 dark:text-lime-400 dark:hover:bg-gray-700 font-bold px-6 py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Start Interview
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
