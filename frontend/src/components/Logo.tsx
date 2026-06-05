interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  textLight?: boolean;
}

const sizes = {
  sm: { icon: 28, text: 'text-sm' },
  md: { icon: 36, text: 'text-lg' },
  lg: { icon: 48, text: 'text-xl' },
};

export default function Logo({ showText = true, size = 'md', className = '', textLight = false }: LogoProps) {
  const d = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={d.icon} height={d.icon} viewBox="0 0 32 32" className="flex-shrink-0">
        <rect width="32" height="32" rx="9" fill="#1a2e05" />
        <g fill="none" stroke="#84cc16" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 4v24" />
          <path d="M10 4h7a7 7 0 0 1 0 14H10" />
          <path d="M17 18l7 7" />
        </g>
      </svg>
      {showText && (
        <div className={`font-extrabold ${d.text} ${textLight ? 'text-white dark:text-lime-100' : 'text-darkgreen dark:text-lime-100'} leading-tight`}>
          Rozgar Coach
        </div>
      )}
    </div>
  );
}
