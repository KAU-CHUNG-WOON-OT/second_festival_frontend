import { useEffect, useReducer, type PointerEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStopwatch } from '@/hooks/useStopwatch';
import { FINGER_HOLD_MS as HOLD_MS, FINGER_INITIAL_STATE, fingerReducer } from '@/data/fingerGameData';

const FingerGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const [{ fingers, holdStartedAt, winner }, dispatch] = useReducer(fingerReducer, FINGER_INITIAL_STATE);
  const elapsed = useStopwatch(holdStartedAt, HOLD_MS);
  const fingerCount = Object.keys(fingers).length;

  useEffect(() => {
    if (holdStartedAt === null) return;
    const timer = setTimeout(() => {
      navigator.vibrate?.(200);
      dispatch({ type: 'pick', random: Math.random() });
    }, HOLD_MS);
    return () => clearTimeout(timer);
  }, [holdStartedAt]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    dispatch({
      type: 'down',
      id: event.pointerId,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      at: performance.now(),
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    dispatch({ type: 'up', id: event.pointerId, at: performance.now() });
  };

  const message = winner
    ? isEng
      ? 'Winner!'
      : '당첨!'
    : holdStartedAt !== null
      ? String(Math.ceil((HOLD_MS - elapsed) / 1000) || 1)
      : fingerCount === 1
        ? isEng
          ? 'Need one more finger'
          : '한 명 더 올려주세요'
        : isEng
          ? 'Everyone, put a finger on the screen'
          : '다 같이 화면에 손가락을 올려주세요';

  return (
    <div className="flex flex-col gap-4">
      <p className="font-body-kr text-[14px] leading-5 opacity-70">
        {isEng
          ? 'Hold still for 3 seconds and one finger gets picked at random.'
          : '손가락을 올리고 3초 동안 가만히 있으면 한 명이 무작위로 뽑혀요.'}
      </p>
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={(event) => event.preventDefault()}
        className="relative h-[460px] touch-none select-none overflow-hidden rounded-[24px] border-2 border-ink bg-paper drop-shadow-[5px_5px_0px_var(--color-ink)] [-webkit-touch-callout:none]"
      >
        <p
          className={`pointer-events-none absolute inset-x-5 top-1/2 -translate-y-1/2 text-center font-display ${
            holdStartedAt !== null ? 'text-[96px] leading-none opacity-20' : 'text-[24px] leading-8 opacity-60'
          }`}
        >
          {message}
        </p>

        {winner ? (
          <span
            className="pointer-events-none absolute size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink"
            style={{ left: winner.x, top: winner.y, background: winner.color }}
          />
        ) : (
          Object.entries(fingers).map(([id, finger]) => (
            <span
              key={id}
              className="pointer-events-none absolute size-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink"
              style={{ left: finger.x, top: finger.y, background: finger.color }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FingerGame;
