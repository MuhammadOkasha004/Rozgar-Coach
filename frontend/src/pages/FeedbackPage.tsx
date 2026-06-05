import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Briefcase, Download, Trophy, CheckCircle2, ArrowLeft, Star } from 'lucide-react';
import CircularScore from '../components/CircularScore';
import ScoreBar from '../components/ScoreBar';
import QAReview from '../components/QAReview';
import WeakPointsCard from '../components/WeakPointsCard';
import { useInterviewStore } from '../store/interviewStore';
import { buildWeakPoints } from '../services/weakPoints';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { allFeedback, jobTitle, resetSession } = useInterviewStore();

  useEffect(() => {
    if (allFeedback.length === 0) {
      navigate('/select-job');
    }
  }, [allFeedback.length, navigate]);

  const summary = useMemo(() => {
    if (allFeedback.length === 0)
      return {
        overall: 0,
        communication: 0,
        technical: 0,
        confidence: 0,
        relevance: 0,
        strong: [],
      };
    return {
      overall: Math.round(allFeedback.reduce((s, f) => s + f.feedback.overallScore, 0) / allFeedback.length),
      communication: Math.round(
        allFeedback.reduce((s, f) => s + f.feedback.communicationScore, 0) / allFeedback.length
      ),
      technical: Math.round(
        allFeedback.reduce((s, f) => s + f.feedback.technicalScore, 0) / allFeedback.length
      ),
      confidence: Math.round(
        allFeedback.reduce((s, f) => s + f.feedback.confidenceScore, 0) / allFeedback.length
      ),
      relevance: Math.round(
        allFeedback.reduce((s, f) => s + f.feedback.relevanceScore, 0) / allFeedback.length
      ),
      strong: Array.from(new Set(allFeedback.flatMap((f) => f.feedback.strongPoints))).slice(0, 5),
    };
  }, [allFeedback]);

  const weakPoints = useMemo(
    () =>
      buildWeakPoints(
        allFeedback.map((f) => ({
          questionNumber: f.questionNumber,
          improvementAreas: f.feedback.improvementAreas ?? [],
        })),
      ),
    [allFeedback],
  );

  const getGrade = (score: number) => {
    if (score >= 85) return { label: 'Outstanding', color: 'text-green-600' };
    if (score >= 70) return { label: 'Excellent', color: 'text-lime-700' };
    if (score >= 55) return { label: 'Good', color: 'text-lime-600' };
    if (score >= 40) return { label: 'Needs Work', color: 'text-yellow-600' };
    return { label: 'Practice More', color: 'text-orange-600' };
  };

  const grade = getGrade(summary.overall);

  const handleRetry = () => {
    if (window.confirm('Do you want to practice the same category again?')) {
      resetSession();
      navigate('/interview');
    }
  };

  const handleNewCategory = () => {
    resetSession();
    navigate('/select-job');
  };

  const handleDownload = () => {
    window.print();
  };

  if (allFeedback.length === 0) return null;

  return (
    <div className="min-h-screen bg-lime-50/30 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* HEADER */}
        <div className="text-center mb-10 animate-fade-up no-print">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lime-100 border border-lime-300 rounded-full text-lime-700 text-xs font-bold mb-4 dark:bg-gray-800 dark:border-gray-600 dark:text-lime-400">
            <Trophy className="w-3.5 h-3.5" />
            INTERVIEW COMPLETE
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-darkgreen dark:text-lime-100 mb-2">Your Performance Report</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {jobTitle} · English · {allFeedback.length} questions completed
          </p>
        </div>

        {/* TOTAL SCORE CARD */}
        <div className="card-static bg-white border-2 border-lime-200 p-8 sm:p-10 mb-8 animate-fade-up shadow-lime-lg dark:bg-gray-900 dark:border-gray-600">
          <div className="grid md:grid-cols-[260px_1fr] gap-8 items-center">
            <div className="flex justify-center">
              <CircularScore
                score={summary.overall}
                size={240}
                color="#84cc16"
                trackColor="#ecfccb"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 text-lime-700 text-xs font-bold uppercase tracking-wider mb-3 dark:bg-gray-800 dark:text-lime-400">
                <Star className="w-3.5 h-3.5" />
                Final Result
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-darkgreen dark:text-lime-100">
                Your Total Score:{' '}
                <span className="text-lime-600 dark:text-lime-400">{summary.overall}/100</span>
              </h2>
              <p className="text-sm text-lime-600 dark:text-lime-400 mt-1">
                Average of all question scores
              </p>
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500 text-white font-extrabold text-lg shadow">
                {grade.label}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed max-w-xl">
                {summary.overall >= 70
                  ? 'Great job! You are well prepared for your interview.'
                  : summary.overall >= 50
                  ? 'Good progress! A bit more practice and you will be ready.'
                  : 'Keep practicing — you will improve next time!'}
              </p>
            </div>
          </div>
        </div>

        {/* SCORE BREAKDOWN */}
        <div className="card-static mb-8 animate-fade-up stagger-1">
          <h2 className="text-xl font-bold text-darkgreen dark:text-lime-100 mb-5 flex items-center gap-2">
            Score Breakdown
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(out of 100)</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
            <ScoreBar
              label="Communication Skills"
              score={summary.communication}
              comment="Clarity, fluency, structure"
              color="bg-gradient-to-r from-lime-500 to-green-500"
            />
            <ScoreBar
              label="Technical Knowledge"
              score={summary.technical}
              comment="Subject matter expertise"
              color="bg-gradient-to-r from-lime-500 to-lime-700"
            />
            <ScoreBar
              label="Confidence Level"
              score={summary.confidence}
              comment="Tone, conviction, presence"
              color="bg-gradient-to-r from-lime-400 to-lime-600"
            />
            <ScoreBar
              label="Answer Relevance"
              score={summary.relevance}
              comment="On-topic, complete answers"
              color="bg-gradient-to-r from-lime-500 to-green-600"
            />
          </div>
        </div>

        {/* WEAK POINTS */}
        <div className="mb-8 animate-fade-up stagger-2">
          <WeakPointsCard weakPoints={weakPoints} />
        </div>

        {/* STRONG POINTS */}
        <div className="card-static mb-8 animate-fade-up stagger-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-lg text-darkgreen dark:text-lime-100">
              Strong Points
            </h3>
          </div>
          {summary.strong.length > 0 ? (
            <ul className="space-y-2.5">
              {summary.strong.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No specific strong points found — try again next time.</p>
          )}
        </div>

        {/* Q&A REVIEW */}
        <div className="mb-8 no-print">
          <h2 className="text-2xl font-bold text-darkgreen dark:text-lime-100 mb-5 flex items-center gap-2">
            Question-by-Question Review
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({allFeedback.length} questions)</span>
          </h2>
          <div className="space-y-3">
            {allFeedback.map((item) => (
              <QAReview key={item.questionNumber} item={item} />
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="card-static bg-gradient-to-br from-lime-50 to-lime-100 animate-fade-up dark:from-gray-800 dark:to-gray-900">
          <h3 className="text-xl font-bold text-darkgreen dark:text-lime-100 mb-2 text-center">What Next?</h3>
          <p className="text-lime-700 dark:text-lime-400 text-center mb-6">Continue your interview preparation journey</p>
          <div className="grid sm:grid-cols-3 gap-3 no-print">
            <button onClick={handleRetry} className="btn-primary flex-col py-5">
              <RefreshCw className="w-5 h-5 mb-1" />
              <span>Practice Again</span>
              <span className="text-xs font-normal text-lime-100">Retry same job</span>
            </button>
            <button onClick={handleNewCategory} className="btn-secondary flex-col py-5">
              <Briefcase className="w-5 h-5 mb-1" />
              <span>New Category</span>
              <span className="text-xs font-normal text-lime-700 dark:text-lime-400">Choose different field</span>
            </button>
            <button onClick={handleDownload} className="btn-dark flex-col py-5">
              <Download className="w-5 h-5 mb-1" />
              <span>Download Report</span>
              <span className="text-xs font-normal text-lime-300">Save as PDF / Print</span>
            </button>
          </div>
          <div className="text-center mt-6 no-print">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-lime-700 hover:text-lime-900 dark:text-lime-400 dark:hover:text-lime-300 font-semibold inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
