import { Bot, User } from 'lucide-react';

interface Props {
  role: 'user' | 'assistant';
  content: string;
  questionNumber?: number;
}

export default function ChatBubble({ role, content, questionNumber }: Props) {
  const isAI = role === 'assistant';

  return (
    <div className={`flex gap-3 mb-4 animate-fade-up ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-lime-500 flex items-center justify-center shadow-lime">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
          isAI
            ? 'bg-lime-100 border border-lime-300 text-darkgreen dark:bg-gray-800 dark:border-gray-600 dark:text-lime-100 rounded-tl-sm'
            : 'bg-white border border-gray-200 text-darkgreen dark:bg-gray-800 dark:border-gray-600 dark:text-lime-100 rounded-tr-sm'
        }`}
      >
        {isAI && questionNumber !== undefined && (
          <div className="text-[10px] font-bold text-lime-700 dark:text-lime-400 uppercase tracking-wider mb-1">
            Question {questionNumber}
          </div>
        )}
        <p className="text-sm leading-relaxed">{content}</p>
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-darkgreen dark:bg-gray-700 flex items-center justify-center">
          <User className="w-5 h-5 text-lime-300" />
        </div>
      )}
    </div>
  );
}
