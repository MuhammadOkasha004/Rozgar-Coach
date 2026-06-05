interface Props {
  message: string;
  submessage?: string;
}

export default function LoadingSpinner({ message, submessage }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-lime-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-lime-500 border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-darkgreen dark:text-lime-100">{message}</p>
        {submessage && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{submessage}</p>}
      </div>
    </div>
  );
}
