import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SelectJobPage from './pages/SelectJobPage';
import InterviewPage from './pages/InterviewPage';
import FeedbackPage from './pages/FeedbackPage';
import { useThemeStore } from './store/themeStore';

export default function App() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen font-sans text-darkgreen dark:text-lime-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select-job" element={<SelectJobPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}
