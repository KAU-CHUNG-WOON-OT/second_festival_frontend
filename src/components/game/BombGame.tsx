import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { createBombFuse } from '@/data/bombGameData';
import { GAME_CARD, PRIMARY_BUTTON } from './gameStyles';

type Phase = 'ready' | 'ticking' | 'boom';

const BombGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const [phase, setPhase] = useState<Phase>('ready');

  useEffect(() => {
    if (phase !== 'ticking') return;
    const timer = setTimeout(() => {
      navigator.vibrate?.([300, 100, 300]);
      setPhase('boom');
    }, createBombFuse());
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === 'ticking') {
    return (
      <div className="flex flex-col gap-6">
        <section className="flex min-h-80 flex-col items-center justify-center rounded-[16px] border-2 border-ink bg-mustard p-5 text-center drop-shadow-[5px_5px_0px_var(--color-ink)]">
          <span className="animate-[bomb-shake_0.3s_ease-in-out_infinite] text-[96px] leading-none">💣</span>
          <p className="pt-6 font-display text-[32px] leading-10">{isEng ? 'Pass it on!' : '옆 사람에게 넘겨!'}</p>
          <p className="pt-2 font-body-kr text-[14px] leading-5 opacity-80">
            {isEng ? 'Say one word for the topic, then pass.' : '주제에 맞는 단어를 하나 말하고 넘기세요.'}
          </p>
        </section>
      </div>
    );
  }

  if (phase === 'boom') {
    return (
      <div className="flex flex-col gap-6">
        <section className="flex min-h-80 flex-col items-center justify-center rounded-[16px] border-2 border-ink bg-rust p-5 text-center text-paper drop-shadow-[5px_5px_0px_var(--color-ink)]">
          <span className="text-[96px] leading-none">💥</span>
          <p className="pt-6 font-condensed text-[64px] font-bold leading-[64px]">BOOM!</p>
          <p className="pt-2 font-display text-[24px] leading-8">
            {isEng ? 'Whoever holds the phone gets the penalty' : '지금 폰 든 사람이 벌칙!'}
          </p>
        </section>
        <button type="button" onClick={() => setPhase('ticking')} className={PRIMARY_BUTTON}>
          {isEng ? 'Play Again' : '한 판 더'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className={GAME_CARD}>
        <p className="font-typewriter text-[12px] leading-4 opacity-60">HOW TO PLAY</p>
        <ol className="list-decimal pt-3 pl-5 font-body-kr text-[14px] leading-6 opacity-80">
          {isEng ? (
            <>
              <li>Pick a topic together (e.g. fruits, subway stations).</li>
              <li>Say one word for the topic and pass the phone.</li>
              <li>The bomb goes off at a random moment between 5 and 20 seconds.</li>
              <li>Whoever is holding the phone when it explodes gets the penalty.</li>
            </>
          ) : (
            <>
              <li>다 같이 주제를 정해요. (예: 과일, 지하철역)</li>
              <li>주제에 맞는 단어를 하나 말하고 옆 사람에게 폰을 넘겨요.</li>
              <li>폭탄은 5~20초 사이 아무 때나 터져요.</li>
              <li>터지는 순간 폰을 들고 있는 사람이 벌칙!</li>
            </>
          )}
        </ol>
      </section>
      <button type="button" onClick={() => setPhase('ticking')} className={PRIMARY_BUTTON}>
        {isEng ? 'Light the Fuse' : '폭탄 점화'}
      </button>
    </div>
  );
};

export default BombGame;
