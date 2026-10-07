import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStopwatch } from '@/hooks/useStopwatch';
import {
  STOP_BLIND_AFTER_MS,
  STOP_MAX_PLAYERS,
  STOP_MIN_PLAYERS,
  formatStopTime,
  rankStopResults,
  type StopResult,
} from '@/data/stopGameData';
import PlayerCountStepper from './PlayerCountStepper';
import { GAME_CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from './gameStyles';

const BIG_BUTTON =
  'mx-auto flex size-56 flex-col items-center justify-center rounded-full border-2 border-ink font-display text-[36px] leading-10 drop-shadow-[6px_6px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]';

const StopGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const [playerCount, setPlayerCount] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState<StopResult[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const elapsed = useStopwatch(startedAt);

  const currentPlayer = results.length;
  const lastResult = results[results.length - 1];
  const playerName = (index: number) => (isEng ? `Player ${index + 1}` : `${index + 1}번 플레이어`);

  const handleStop = () => {
    if (startedAt === null) return;
    setResults([...results, { player: currentPlayer, elapsedMs: performance.now() - startedAt }]);
    setStartedAt(null);
  };

  const restart = () => {
    setResults([]);
    setStartedAt(null);
  };

  if (!isPlaying) {
    return (
      <div className="flex flex-col gap-6">
        <section className={GAME_CARD}>
          <p className="font-typewriter text-[12px] leading-4 opacity-60">HOW TO PLAY</p>
          <ol className="list-decimal pt-3 pl-5 font-body-kr text-[14px] leading-6 opacity-80">
            {isEng ? (
              <>
                <li>Take turns pressing START and try to STOP at exactly 10.00 seconds.</li>
                <li>The timer disappears after 3 seconds — count in your head.</li>
                <li>Whoever ends up furthest from 10 seconds gets the penalty.</li>
              </>
            ) : (
              <>
                <li>차례대로 시작을 누르고 정확히 10.00초에 멈춰요.</li>
                <li>3초가 지나면 시간이 가려져요. 속으로 세세요!</li>
                <li>10초에서 가장 많이 벗어난 사람이 벌칙!</li>
              </>
            )}
          </ol>
        </section>
        <PlayerCountStepper
          value={playerCount}
          min={STOP_MIN_PLAYERS}
          max={STOP_MAX_PLAYERS}
          onChange={setPlayerCount}
        />
        <button
          type="button"
          onClick={() => {
            restart();
            setIsPlaying(true);
          }}
          className={PRIMARY_BUTTON}
        >
          {isEng ? 'Start Game' : '게임 시작'}
        </button>
      </div>
    );
  }

  if (results.length === playerCount) {
    const ranked = rankStopResults(results);
    return (
      <div className="flex flex-col gap-6">
        <ol className="flex flex-col gap-3">
          {ranked.map((result, rank) => {
            const isLoser = rank === ranked.length - 1;
            return (
              <li
                key={result.player}
                className={`flex items-center gap-4 rounded-[16px] border-2 border-ink px-5 py-4 drop-shadow-[4px_4px_0px_var(--color-ink)] ${
                  isLoser ? 'bg-rust text-paper' : 'bg-paper'
                }`}
              >
                <span className="w-8 font-condensed text-[28px] font-bold leading-8">{rank + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[20px] leading-7">{playerName(result.player)}</p>
                  {isLoser && <p className="font-body-kr text-[14px] leading-5">{isEng ? 'Penalty!' : '벌칙!'}</p>}
                </div>
                <div className="text-right">
                  <p className="font-condensed text-[28px] font-bold leading-8">{formatStopTime(result.elapsedMs)}</p>
                  <p className="font-typewriter text-[12px] leading-4 opacity-70">±{formatStopTime(result.diffMs)}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={restart} className={PRIMARY_BUTTON}>
          {isEng ? 'Play Again' : '한 판 더'}
        </button>
        <button type="button" onClick={() => setIsPlaying(false)} className={SECONDARY_BUTTON}>
          {isEng ? 'Change Settings' : '설정 바꾸기'}
        </button>
      </div>
    );
  }

  const isRunning = startedAt !== null;
  const isBlind = isRunning && elapsed >= STOP_BLIND_AFTER_MS;

  return (
    <div className="flex flex-col gap-6">
      <p className="font-typewriter text-[12px] leading-4 tracking-[3.6px]">{`${currentPlayer + 1} / ${playerCount}`}</p>
      <section className={`${GAME_CARD} text-center`}>
        <p className="font-display text-[24px] leading-8">{playerName(currentPlayer)}</p>
        <p className="pt-3 font-condensed text-[80px] font-bold leading-[80px]">
          {isBlind ? '??.??' : formatStopTime(elapsed)}
        </p>
        {lastResult && !isRunning && (
          <p className="pt-3 font-body-kr text-[14px] leading-5 opacity-70">
            {isEng
              ? `${playerName(lastResult.player)}: ${formatStopTime(lastResult.elapsedMs)}s`
              : `${playerName(lastResult.player)}: ${formatStopTime(lastResult.elapsedMs)}초`}
          </p>
        )}
      </section>
      {isRunning ? (
        <button type="button" onClick={handleStop} className={`${BIG_BUTTON} bg-rust text-paper`}>
          STOP
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setStartedAt(performance.now())}
          className={`${BIG_BUTTON} bg-mustard text-ink`}
        >
          START
        </button>
      )}
    </div>
  );
};

export default StopGame;
