import { useEffect, useRef, useState, type FormEvent, type ReactNode, type Ref } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BandStars } from '../../common/StickyBar';
import { STICKY_BAND_TOP, skyBackground } from '../../common/retroLayout';
import { useStickyOverlap } from '@/hooks/useStickyOverlap';
import { GAME_CARD } from '../gameStyles';
import {
  HANGMENTLE_TOP_RANK,
  HANGMENTLE_WORD_MAX_LENGTH,
  sortGuesses,
  type HangmentleGuess,
  type HangmentleGuessResult,
  type HangmentleRound,
} from '@/data/hangmentleData';

type Hints = HangmentleRound['hints'];

// 채점 결과. 이벤트 회차는 서버에 물어보다 실패할 수 있어서 오류 문구를 돌려받는다
export type HangmentleGuessOutcome = HangmentleGuessResult | { kind: 'error'; message: string };

// 목록이 끝나 갈 때도 이만큼은 늘 보이게 한다. 남은 목록이 이보다 짧아지면 힌트·입력창도 목록과 함께 위로 올라간다
const LIST_MIN_VISIBLE = 360;

interface HintCardProps {
  label: string;
  hints: Hints;
  showScore: (similarity: number) => string;
}

export const HintCard = ({ label, hints, showScore }: HintCardProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <section className={GAME_CARD}>
      <p className="font-typewriter text-[12px] leading-4 opacity-60">{label}</p>
      <p className="pt-3 font-body-kr text-[14px] leading-6">
        {isEng ? (
          <>
            The closest word is <b>{showScore(hints.first)}</b> similar, the 10th{' '}
            <b>{showScore(hints.tenth)}</b>, and the 1000th <b>{showScore(hints.thousandth)}</b>.
          </>
        ) : (
          <>
            정답과 가장 가까운 단어의 유사도는 <b>{showScore(hints.first)}</b>, 10번째는{' '}
            <b>{showScore(hints.tenth)}</b>, 1000번째는 <b>{showScore(hints.thousandth)}</b>예요.
          </>
        )}
      </p>
    </section>
  );
};

export const GuessHeader = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <div className="flex items-center gap-3 font-typewriter text-[11px] leading-4 opacity-50">
      <span className="w-6">#</span>
      <span className="flex-1">{isEng ? 'WORD' : '단어'}</span>
      <span>{isEng ? 'SCORE' : '유사도'}</span>
      <span className="w-[84px] text-right">{isEng ? 'RANK' : '순위'}</span>
    </div>
  );
};

interface GuessRowProps {
  guess: HangmentleGuess;
  showScore: (similarity: number) => string;
  highlight?: boolean;
  rowRef?: Ref<HTMLLIElement>;
}

export const GuessRow = ({ guess, showScore, highlight = false, rowRef }: GuessRowProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const rankLabel = () => {
    if (guess.rank === 0) return isEng ? 'Answer!' : '정답!';
    if (guess.rank === null)
      return isEng ? `${HANGMENTLE_TOP_RANK}+` : `${HANGMENTLE_TOP_RANK}위 밖`;
    return isEng ? `#${guess.rank}` : `${guess.rank}위`;
  };

  return (
    <li
      ref={rowRef}
      className={`flex items-center gap-3 border-b border-dashed border-ink/30 py-3 last:border-b-0 ${
        highlight ? '-mx-2 rounded-[8px] border-b-0 bg-mustard/30 px-2' : ''
      }`}
    >
      <span className="w-6 shrink-0 font-typewriter text-[12px] leading-4 opacity-50">
        {guess.order}
      </span>
      <span className="min-w-0 flex-1 truncate font-display text-[17px] leading-6">
        {guess.word}
      </span>
      <span className="shrink-0 font-condensed text-[17px] font-bold leading-6">
        {showScore(guess.similarity)}
      </span>
      <span className="flex w-[84px] shrink-0 flex-col items-end gap-1">
        <span
          className={`font-body-kr text-[12px] font-semibold leading-4 ${
            guess.rank === 0 ? 'text-rust' : guess.rank === null ? 'text-ink/40' : 'text-ink/70'
          }`}
        >
          {rankLabel()}
        </span>
        {guess.rank !== null && guess.rank > 0 && (
          <span className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
            <span
              className="block h-full rounded-full bg-tape-blue"
              style={{
                width: `${((HANGMENTLE_TOP_RANK - guess.rank + 1) / HANGMENTLE_TOP_RANK) * 100}%`,
              }}
            />
          </span>
        )}
      </span>
    </li>
  );
};

interface GuessListCardProps {
  guesses: HangmentleGuess[];
  showScore: (similarity: number) => string;
}

// 정답을 맞힌 뒤 아래에 보여 주는 추측 목록
export const GuessListCard = ({ guesses, showScore }: GuessListCardProps) => (
  <section className={GAME_CARD}>
    <div className="pb-2">
      <GuessHeader />
    </div>
    <ul>
      {sortGuesses(guesses).map((guess) => (
        <GuessRow key={`${guess.order}-${guess.word}`} guess={guess} showScore={showScore} />
      ))}
    </ul>
  </section>
);

interface HangmentleBoardProps {
  // 힌트 카드 맨 위 라벨 (PUZZLE 01, EVENT 10시 …). 뒤에 추측 횟수가 붙는다
  label: string;
  hints: Hints;
  showScore: (similarity: number) => string;
  guesses: HangmentleGuess[];
  solved: boolean;
  // 맞힌 뒤 입력창 자리에 보여 줄 카드
  solvedCard: ReactNode;
  // 입력한 글자를 채점하고 목록에 넣는다. 서버에 물어보는 동안(Promise)은 추측 버튼을 막는다
  onGuess: (input: string) => HangmentleGuessOutcome | Promise<HangmentleGuessOutcome>;
  // 판이 다시 그려져도(이벤트 회차가 잠깐 닫힘 등) 입력하던 글자를 잃지 않도록 처음 값과 바뀐 값을 주고받는다
  initialInput?: string;
  onInputChange?: (input: string) => void;
}

// 힌트·입력창·추측 목록. 진행 중에는 스크롤해도 힌트·입력창·목록 머리줄이 상단바 아래에 붙어 있다
const HangmentleBoard = ({
  label,
  hints,
  showScore,
  guesses,
  solved,
  solvedCard,
  onGuess,
  initialInput = '',
  onInputChange,
}: HangmentleBoardProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const [input, setInput] = useState(initialInput);
  const [message, setMessage] = useState<string | null>(null);
  const [lastGuess, setLastGuess] = useState<HangmentleGuess | null>(null);
  const [busy, setBusy] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const lastRowRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    onInputChange?.(input);
  }, [input, onInputChange]);

  // 정답을 맞히면 키보드를 내리고 페이지 맨 위로 올려 정답 카드·순위표가 바로 보이게 한다
  const scrollToPageTop = () => {
    (document.activeElement as HTMLElement | null)?.blur();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    stickyRef.current
      ?.closest('.overflow-y-auto')
      ?.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || !input.trim()) return;

    const submitted = input;
    const pending = onGuess(submitted);
    let result: HangmentleGuessOutcome;
    if (pending instanceof Promise) {
      setBusy(true);
      try {
        result = await pending;
      } finally {
        setBusy(false);
      }
    } else {
      result = pending;
    }

    if (result.kind === 'error') {
      // 입력한 단어는 그대로 두어 바로 다시 보낼 수 있게
      setMessage(result.message);
      return;
    }
    if (result.kind === 'unknown') {
      setMessage(
        isEng
          ? `"${result.word}" is not in the word list`
          : `'${result.word}'은(는) 모르는 단어입니다.`,
      );
      return;
    }
    if (result.kind === 'duplicate') {
      // 이미 추측한 단어라고 알려 주면서, 검색처럼 결과를 맨 위 강조 줄에 다시 보여 준다 (횟수는 그대로)
      setMessage(
        isEng
          ? `You already tried "${result.guess.word}"`
          : `'${result.guess.word}'은(는) 이미 추측한 단어입니다.`,
      );
      setInput('');
      setLastGuess({ ...result.guess });
      return;
    }
    setMessage(null);
    // 서버 답을 기다리는 동안 새로 입력한 글자는 지우지 않는다
    setInput((current) => (current === submitted ? '' : current));
    setLastGuess(result.guess);
    if (result.guess.rank === 0) scrollToPageTop();
  };

  // 힌트·입력창 묶음이 목록 위에 겹쳐 있는지 (상단바 아래에 붙어 있거나, 목록 끝에서 목록과 함께 올라가는 중)
  const hasListBody = !solved && guesses.length > 0;
  const isOverList = useStickyOverlap(stickyRef);

  // 방금 입력한 단어 줄이 보이도록 스크롤한다. 줄은 힌트·입력창 묶음 바로 밑에 있어서 묶음이 붙어 있으면
  // (목록 끝에서 밀려 올라간 중이어도) 그 밑에 가려진다. 위로 올리면 묶음은 붙는 자리로 내려오므로,
  // 붙었을 때의 아래 끝과 머리줄 밑 페이드(20px)를 기준으로 목표를 한 번에 정한다.
  // 줄이 화면(키보드가 열려 있으면 그 위) 아래로 벗어나 있으면, 묶음이 다시 붙지 않는 데까지만 내린다
  useEffect(() => {
    const row = lastRowRef.current;
    const band = stickyRef.current;
    const container = row?.closest('.overflow-y-auto');
    if (!row || !band || !container) return;
    const { top, bottom } = row.getBoundingClientRect();
    const minTop = STICKY_BAND_TOP + band.offsetHeight + 24;
    const viewport = window.visualViewport;
    const maxBottom = (viewport ? viewport.offsetTop + viewport.height : window.innerHeight) - 16;
    const isBandStuck = band.getBoundingClientRect().top < STICKY_BAND_TOP + 0.5;
    let delta = 0;
    if (isBandStuck) delta = top - minTop;
    else if (bottom > maxBottom) delta = Math.max(0, Math.min(bottom - maxBottom, top - minTop));
    if (delta !== 0) container.scrollBy({ top: delta, behavior: 'smooth' });
  }, [lastGuess]);

  return (
    // 고정 범위: 힌트·입력창 묶음은 이 안에서만 붙어 있다. 목록 몸통의 음수 아래 여백으로 범위를 목록 끝보다
    // LIST_MIN_VISIBLE만큼 앞에서 끝내고, 같은 크기의 양수 여백으로 아래 배치는 그대로 둔다
    <div
      className="flex flex-col"
      style={hasListBody ? { marginBottom: LIST_MIN_VISIBLE } : undefined}
    >
      {/* 진행 중에는 스크롤해도 힌트·입력창·추측 목록 카드 윗부분(머리줄)이 화면 위에 붙어 있고 그 아래 목록만 움직인다.
          붙으면 뒤 하늘과 같은 그라디언트·별을 깔아 경계가 보이지 않게 한다 */}
      <div
        ref={stickyRef}
        className={`-mx-5 -mt-3 px-5 pt-3 ${solved ? '' : 'sticky z-20'}`}
        style={
          solved
            ? undefined
            : {
                top: STICKY_BAND_TOP,
                background: isOverList ? skyBackground('var(--band-top)') : undefined,
              }
        }
      >
        {isOverList && !solved && <BandStars />}
        <div className="relative z-10 flex flex-col gap-4">
          <HintCard
            label={`${label} · ${isEng ? `${guesses.length} GUESSES` : `${guesses.length}번 추측`}`}
            hints={hints}
            showScore={showScore}
          />

          {solved ? (
            solvedCard
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setMessage(null);
                  }}
                  enterKeyHint="send"
                  maxLength={HANGMENTLE_WORD_MAX_LENGTH}
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder={isEng ? 'Type a Korean word' : '단어를 입력하세요'}
                  aria-label={isEng ? 'Your guess' : '추측할 단어'}
                  className="h-12 min-w-0 flex-1 rounded-full bg-paper px-5 font-body-kr text-[16px] text-ink outline-none placeholder:text-ink/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-busy={busy}
                  className="h-12 shrink-0 rounded-full border-2 border-ink bg-rust px-5 font-display text-[16px] text-paper shadow-[3px_3px_0px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-40"
                >
                  {isEng ? 'Guess' : '추측'}
                </button>
              </div>
              {message && (
                <p role="alert" className="px-2 font-body-kr text-[13px] font-semibold text-paper">
                  {message}
                </p>
              )}
            </form>
          )}

          {/* 추측 목록 카드의 윗부분. 아래 몸통과 맞붙어 카드 하나로 보인다 */}
          {hasListBody && (
            <div className="relative mt-2 rounded-t-[16px] border-x-2 border-t-2 border-ink bg-paper px-5 pt-5 shadow-[5px_0_0_0_var(--color-ink)]">
              <div className="pb-2">
                <GuessHeader />
              </div>
              {/* 붙었을 때 머리줄 밑으로 들어가는 줄이 선에 잘리지 않고 서서히 사라지게 */}
              {isOverList && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-full h-5 bg-linear-to-b from-paper to-paper/0"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* 진행 중: 위 고정 영역의 카드 윗부분과 맞붙는 몸통. 그림자는 카드 하나처럼 이어지게 */}
      {hasListBody && (
        <section
          className="rounded-b-[16px] border-x-2 border-b-2 border-ink bg-paper px-5 pb-5 pt-1 shadow-[5px_0_0_0_var(--color-ink),5px_5px_0_0_var(--color-ink)]"
          style={{ marginBottom: -LIST_MIN_VISIBLE }}
        >
          {lastGuess && (
            <ul className="pb-2">
              <GuessRow guess={lastGuess} showScore={showScore} highlight rowRef={lastRowRef} />
            </ul>
          )}
          <ul>
            {sortGuesses(guesses).map((guess) => (
              <GuessRow key={`${guess.order}-${guess.word}`} guess={guess} showScore={showScore} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default HangmentleBoard;
