import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle, X, ArrowRight, ClipboardList, Trophy, RefreshCw, Briefcase, Star, RotateCcw } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import WeakPointsCard from '../components/WeakPointsCard';
import { useInterviewStore } from '../store/interviewStore';
import { getQuestionsBank } from '../services/api';
import { buildWeakPoints } from '../services/weakPoints';

export default function InterviewPage() {
  const navigate = useNavigate();
  const {
    jobCategory,
    jobTitle,
    difficulty,
    mcqs,
    currentIndex,
    selectedAnswers,
    allFeedback,
    isLoading,
    error,
    reviewIndices,
    setMCQs,
    selectAnswer,
    nextQuestion,
    setLoading,
    setError,
    resetSession,
  } = useInterviewStore();

  const [answered, setAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!jobCategory) {
      navigate('/select-job');
      return;
    }
    if (mcqs.length > 0) return;
    fetchMCQs();
  }, []);

  useEffect(() => {
    setAnswered(false);
  }, [currentIndex]);

  const fetchMCQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQuestionsBank({
        jobCategory: jobTitle,
        difficulty,
        language: 'english',
      });
      setMCQs(data.questions);
    } catch (e: any) {
      setError(
        e?.response?.data?.error || e?.message || 'Failed to load questions.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (answered) return;
    selectAnswer(idx);
    setAnswered(true);
  };

  const handleNext = () => {
    if (isLast) {
      nextQuestion();
      setShowResults(true);
    } else {
      nextQuestion();
    }
  };

  const handleEndEarly = () => {
    if (window.confirm('Are you sure you want to end this interview?')) {
      resetSession();
      navigate('/select-job');
    }
  };

  if (isLoading && mcqs.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <LoadingSpinner message="Preparing your questions..." submessage="AI generating your question bank..." />
      </div>
    );
  }

  if (error && mcqs.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="card-static max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-darkgreen dark:text-lime-100 mb-2">Error</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <p className="text-xs text-red-600 mb-6">
            Make sure backend is running at http://localhost:5000 and the API key is configured.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={fetchMCQs} className="btn-primary">Try Again</button>
            <button onClick={() => navigate('/select-job')} className="btn-secondary">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && allFeedback.length > 0) {
    const correct = mcqs.filter((q, i) => selectedAnswers[i] === q.correctOptionIndex).length;
    const total = mcqs.length;
    const score = Math.round((correct / total) * 100);

    const weakPoints = buildWeakPoints(
      allFeedback.map((f) => ({
        questionNumber: f.questionNumber,
        improvementAreas: f.feedback.improvementAreas ?? [],
      })),
    );

    const handleRetry = () => {
      resetSession();
      fetchMCQs();
      setShowResults(false);
    };

    const handleNewCategory = () => {
      resetSession();
      navigate('/select-job');
    };

    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* RESULT HEADER */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-100 border border-lime-300 rounded-full text-lime-700 text-xs font-bold mb-4 dark:bg-gray-800 dark:border-gray-600 dark:text-lime-400">
              <Trophy className="w-3.5 h-3.5" />
              INTERVIEW COMPLETE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-darkgreen dark:text-lime-100 mb-2">
              Your Results
            </h1>
            <p className="text-lime-700 dark:text-lime-400">
              {jobTitle} · English · {total} questions
            </p>
          </div>

          {/* SCORE CARD */}
          <div className="card-static bg-gradient-to-br from-lime-50 to-white dark:from-gray-800 dark:to-gray-950 border-2 border-lime-200 dark:border-gray-600 p-8 mb-6 text-center animate-fade-up shadow-lime-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 text-lime-700 dark:bg-gray-700 dark:text-lime-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Star className="w-3.5 h-3.5" />
              Total Score
            </div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-6xl sm:text-7xl font-extrabold text-lime-600 dark:text-lime-400 tabular-nums">{score}</span>
              <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">/100</span>
            </div>
            <div className="text-lg font-semibold text-darkgreen dark:text-lime-100">
              {correct}/{total} correct answers
            </div>
            {score >= 80 ? (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500 text-white font-bold shadow">
                Outstanding! 🎉
              </div>
            ) : score >= 60 ? (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-400 text-white font-bold shadow">
                Good! 👍
              </div>
            ) : (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-400 text-white font-bold shadow">
                Keep Practicing
              </div>
            )}
          </div>

          {/* WEAK POINTS */}
          <div className="mb-6 animate-fade-up">
            <WeakPointsCard weakPoints={weakPoints} />
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid sm:grid-cols-2 gap-3 animate-fade-up">
            <button onClick={handleRetry} className="btn-primary flex items-center justify-center gap-2 py-4">
              <RefreshCw className="w-5 h-5" />
              Practice Again
            </button>
            <button onClick={handleNewCategory} className="btn-secondary flex items-center justify-center gap-2 py-4">
              <Briefcase className="w-5 h-5" />
              New Category
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mcqs.length === 0) return null;

  const mcq = mcqs[currentIndex];
  const selected = selectedAnswers[currentIndex];
  const isCorrect = selected === mcq.correctOptionIndex;
  const isLast = currentIndex + 1 >= mcqs.length;
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <ProgressBar current={currentIndex + 1} total={mcqs.length} label={`Question ${currentIndex + 1} / ${mcqs.length}`} />
        </div>

        {reviewIndices.length > 0 && currentIndex === 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-200 rounded-xl mb-4 text-xs text-purple-700 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300">
            <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Includes <strong>{reviewIndices.length} review question{reviewIndices.length > 1 ? 's' : ''}</strong> from your previous practice to reinforce learning</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-darkgreen dark:text-lime-100">{jobTitle}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">English · MCQ</div>
            </div>
          </div>
          <button
            onClick={handleEndEarly}
            className="text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            End
          </button>
        </div>

        <div className="card-static p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-lime-700 dark:text-lime-400 uppercase tracking-wider">
              Question {mcq.questionNumber}
            </span>
            {reviewIndices.includes(currentIndex) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 border border-purple-300 rounded-full text-purple-700 text-[10px] font-bold dark:bg-purple-900/40 dark:border-purple-600 dark:text-purple-300">
                <RotateCcw className="w-3 h-3" />
                Review
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-darkgreen dark:text-lime-100 mb-6 leading-relaxed">
            {mcq.question}
          </h2>

          <div className="space-y-3">
            {mcq.options.map((opt, idx) => {
              let btnClass = 'w-full text-left p-4 rounded-xl border-2 border-lime-200 bg-white hover:border-lime-400 transition-all font-medium dark:bg-gray-800 dark:border-gray-600 dark:hover:border-lime-500 dark:text-lime-100';
              if (!answered && selected === idx) {
                btnClass = 'w-full text-left p-4 rounded-xl border-2 border-lime-500 bg-lime-50 transition-all font-medium dark:bg-gray-700 dark:border-lime-400 dark:text-lime-100';
              } else if (answered) {
                if (idx === mcq.correctOptionIndex) {
                  btnClass = 'w-full text-left p-4 rounded-xl border-2 border-green-500 bg-green-50 transition-all font-medium dark:bg-green-900/30 dark:border-green-600 dark:text-lime-100';
                } else if (idx === selected && !isCorrect) {
                  btnClass = 'w-full text-left p-4 rounded-xl border-2 border-red-500 bg-red-50 transition-all font-medium dark:bg-red-900/30 dark:border-red-600 dark:text-lime-100';
                } else {
                  btnClass = 'w-full text-left p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-400 transition-all font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500';
                }
              }
              const showIcon = answered && idx === selected;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={btnClass}
                  disabled={answered}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      answered && idx === mcq.correctOptionIndex
                        ? 'bg-green-500 text-white'
                        : answered && idx === selected && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-lime-100 text-lime-700 dark:bg-gray-700 dark:text-lime-400'
                    }`}>
                      {optionLabels[idx]}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {showIcon && (
                      isCorrect
                        ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {answered && (
          <div className={`card-static p-5 mb-4 ${isCorrect ? 'bg-gradient-to-r from-green-50 to-lime-50 border-green-200 dark:from-green-900/20 dark:to-lime-900/20 dark:border-green-700' : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200 dark:from-red-900/20 dark:to-orange-900/20 dark:border-red-700'}`}>
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div className={`font-bold ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isCorrect ? '✅ Correct Answer!' : '❌ Wrong Answer'}
                </div>
                {!isCorrect && (
                  <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Correct answer: <span className="font-bold text-green-700 dark:text-green-400">{optionLabels[mcq.correctOptionIndex]}: {mcq.options[mcq.correctOptionIndex]}</span>
                  </div>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  {mcq.explanation}
                </div>
              </div>
            </div>
          </div>
        )}

        {answered && (
          <button onClick={handleNext} className="btn-primary w-full py-4 text-lg">
            {isLast ? 'View Results' : 'Next Question'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {error && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3 mt-4 dark:bg-red-900/30 dark:border-red-700">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            <button onClick={() => setError(null)}>
              <X className="w-4 h-4 text-red-500 dark:text-red-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}