interface Props {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: Props) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-darkgreen dark:text-lime-100">
          {label || `Question ${current} / ${total}`}
        </span>
        <span className="text-xs text-lime-700 dark:text-lime-400 font-bold">{Math.round(pct)}%</span>
      </div>
      <div className="w-full h-2.5 bg-lime-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-lime-400 to-lime-600 rounded-full transition-all duration-500 shadow-lime"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
