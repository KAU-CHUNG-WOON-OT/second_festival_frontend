import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStopwatch } from '@/hooks/useStopwatch';
import { CHOSUNG_QUIZZES, CHOSUNG_TURN_MS, type ChosungQuiz } from '@/data/chosungGameData';
import { pickRandom } from '@/util/random';
import { GAME_CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from './gameStyles';

const ChosungGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const [quiz, setQuiz] = useState<ChosungQuiz | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [answerCount, setAnswerCount] = useState(0);
  const elapsed = useStopwatch(startedAt, CHOSUNG_TURN_MS);
  const isTimeUp = startedAt !== null && elapsed >= CHOSUNG_TURN_MS;

  useEffect(() => {
    if (isTimeUp) navigator.vibrate?.([300, 100, 300]);
  }, [isTimeUp]);

  const startNewQuiz = () => {
    setQuiz(pickRandom(CHOSUNG_QUIZZES.filter((q) => q !== quiz)));
    setAnswerCount(0);
    setStartedAt(performance.now());
  };

  const handleCorrect = () => {
    setAnswerCount(answerCount + 1);
    setStartedAt(performance.now());
  };

  if (!quiz) {
    return (
      <div className="flex flex-col gap-6">
        <section className={GAME_CARD}>
          <p className="font-typewriter text-[12px] leading-4 opacity-60">HOW TO PLAY</p>
          <ol className="list-decimal pt-3 pl-5 font-body-kr text-[14px] leading-6 opacity-80">
            {isEng ? (
              <>
                <li>A pair of Korean initial consonants appears (e.g. ㄱㅅ).</li>
                <li>Take turns saying a word with those initials within 10 seconds (e.g. 가수).</li>
                <li>No repeats! Tap "Correct" to pass the turn.</li>
                <li>Whoever runs out of time gets the penalty.</li>
              </>
            ) : (
              <>
                <li>초성 두 개가 나와요. (예: ㄱㅅ)</li>
                <li>돌아가며 10초 안에 그 초성으로 된 단어를 말해요. (예: 가수)</li>
                <li>이미 나온 단어는 안 돼요! 맞히면 ‘성공’을 눌러 넘겨요.</li>
                <li>시간 안에 못 말한 사람이 벌칙!</li>
              </>
            )}
          </ol>
        </section>
        <button type="button" onClick={startNewQuiz} className={PRIMARY_BUTTON}>
          {isEng ? 'Start Game' : '게임 시작'}
        </button>
      </div>
    );
  }

  if (isTimeUp) {
    return (
      <div className="flex flex-col gap-6">
        <section className="rounded-[16px] border-2 border-ink bg-rust p-5 text-center text-paper drop-shadow-[5px_5px_0px_var(--color-ink)]">
          <p className="font-condensed text-[64px] font-bold leading-[64px]">{isEng ? "TIME'S UP" : '땡!'}</p>
          <p className="pt-2 font-display text-[24px] leading-8">
            {isEng ? 'Whoever was answering gets the penalty' : '지금 차례인 사람이 벌칙!'}
          </p>
          <div className="mt-5 border-t border-dashed border-paper/50 pt-5">
            <p className="font-typewriter text-[12px] leading-4 opacity-70">
              {isEng ? `${quiz.chosung} · ${answerCount} answers` : `${quiz.chosung} · ${answerCount}개 성공`}
            </p>
            <p className="pt-2 font-body-kr text-[14px] leading-5">
              {isEng ? 'You could have said: ' : '이런 단어도 있어요: '}
              {quiz.examples.join(', ')}
            </p>
          </div>
        </section>
        <button type="button" onClick={startNewQuiz} className={PRIMARY_BUTTON}>
          {isEng ? 'Next Round' : '새 문제로 한 판 더'}
        </button>
      </div>
    );
  }

  const remainingSeconds = Math.ceil((CHOSUNG_TURN_MS - elapsed) / 1000);

  return (
    <div className="flex flex-col gap-6">
      <section className={`${GAME_CARD} text-center`}>
        <p className="font-typewriter text-[12px] leading-4 opacity-60">
          {isEng ? `ANSWERS · ${answerCount}` : `성공 · ${answerCount}개`}
        </p>
        <p className="pt-3 font-display text-[96px] leading-[104px] tracking-[8px]">{quiz.chosung}</p>
        <p
          className={`pt-3 font-condensed text-[64px] font-bold leading-[64px] ${
            remainingSeconds <= 3 ? 'text-rust' : 'text-tape-blue'
          }`}
        >
          {remainingSeconds}
        </p>
        <div className="mt-4 h-3 overflow-hidden rounded-full border border-ink bg-cream">
          <div
            className="h-full bg-rust"
            style={{ width: `${((CHOSUNG_TURN_MS - elapsed) / CHOSUNG_TURN_MS) * 100}%` }}
          />
        </div>
      </section>
      <button type="button" onClick={handleCorrect} className={PRIMARY_BUTTON}>
        {isEng ? 'Correct! Next person' : '성공! 다음 사람'}
      </button>
      <button type="button" onClick={startNewQuiz} className={SECONDARY_BUTTON}>
        {isEng ? 'Change Letters' : '문제 바꾸기'}
      </button>
    </div>
  );
};

export default ChosungGame;
