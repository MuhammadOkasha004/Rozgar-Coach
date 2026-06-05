import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, MessageCircle, BarChart3, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import Logo from './Logo';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const { theme, toggleTheme } = useThemeStore();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-lime-200 dark:bg-gray-950/80 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="group">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" icon={<Home className="w-4 h-4" />} label="Home" active={isActive('/')} />
            <NavLink
              to="/select-job"
              icon={<Briefcase className="w-4 h-4" />}
              label="Select Job"
              active={isActive('/select-job')}
            />
            <NavLink
              to="/interview"
              icon={<MessageCircle className="w-4 h-4" />}
              label="Interview"
              active={isActive('/interview')}
            />
            <NavLink
              to="/feedback"
              icon={<BarChart3 className="w-4 h-4" />}
              label="Report"
              active={isActive('/feedback')}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-lime-50 hover:text-lime-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-lime-400 transition-all"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/select-job" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
              Start Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
        active
          ? 'bg-lime-100 text-lime-700 dark:bg-gray-800 dark:text-lime-400'
          : 'text-gray-600 hover:bg-lime-50 hover:text-lime-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-lime-400'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
