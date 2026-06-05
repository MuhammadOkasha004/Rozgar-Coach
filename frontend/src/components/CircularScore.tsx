interface Props {
  score: number;
  size?: number;
  label?: string;
  color?: string;
  trackColor?: string;
}

export default function CircularScore({
  score,
  size = 200,
  label = 'Overall',
  color = '#84cc16',
  trackColor = '#ecfccb',
}: Props) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out', filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="-mt-[140px] text-center">
        <div className="text-5xl font-extrabold text-darkgreen dark:text-lime-100 tabular-nums">{score}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">/ 100</div>
      </div>
      {label && <div className="mt-20 text-sm font-semibold text-lime-700 dark:text-lime-400 uppercase tracking-wider">{label}</div>}
    </div>
  );
}
