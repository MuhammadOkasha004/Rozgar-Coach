interface Props {
  tips: string[];
  title?: string;
}

export default function TipsSidebar({ tips, title = 'Interview Tips' }: Props) {
  return (
    <div className="card-static bg-gradient-to-br from-lime-50 to-white dark:from-gray-800 dark:to-gray-900">
      <h3 className="font-bold text-darkgreen dark:text-lime-100 mb-3 flex items-center gap-2">
        <span className="w-7 h-7 bg-lime-500 rounded-lg flex items-center justify-center text-white text-sm">
          💡
        </span>
        {title}
      </h3>
      <ul className="space-y-2.5">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-lime-200 text-lime-700 dark:bg-gray-700 dark:text-lime-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
