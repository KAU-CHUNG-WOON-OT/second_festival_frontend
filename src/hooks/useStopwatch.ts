import { useEffect, useState } from 'react';

// startedAt(performance.now() 기준)부터 지난 시간(ms). limitMs에 닿으면 멈춘다.
export const useStopwatch = (startedAt: number | null, limitMs = Infinity) => {
  const [now, setNow] = useState(() => performance.now());

  useEffect(() => {
    if (startedAt === null) return;
    let frame = 0;
    const tick = () => {
      const current = performance.now();
      setNow(current);
      if (current - startedAt < limitMs) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [startedAt, limitMs]);

  if (startedAt === null) return 0;
  return Math.min(Math.max(0, now - startedAt), limitMs);
};
