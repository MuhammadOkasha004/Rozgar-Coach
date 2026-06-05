import { useEffect, useState } from 'react';

interface Props {
  startTime: number;
  running: boolean;
}

export default function Timer({ startTime, running }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    const tick = () => setElapsed(Math.floor((Date.now() - startTime) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime, running]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-wider text-lime-700 font-semibold mb-1">Elapsed Time</div>
      <div className="text-3xl font-extrabold text-darkgreen tabular-nums">
        {mm}:{ss}
      </div>
    </div>
  );
}
