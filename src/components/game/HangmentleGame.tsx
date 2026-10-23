import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import CategoryList from '../common/CategoryList';
import { BandStars } from '../common/StickyBar';
import { STICKY_BAND_TOP, skyBackground } from '../common/retroLayout';
import { useStickyOverlap } from '@/hooks/useStickyOverlap';
import { GAME_CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from './gameStyles';
import {
  HANGMENTLE_PUZZLE_COUNT,
  HANGMENTLE_TOP_RANK,
  createHangmentleRound,
  formatSimilarity,
  hangmentlePuzzleUrl,
  hangmentleVocabUrl,
  sortGuesses,
  type HangmentleGuess,
  type HangmentlePuzzleFile,
} from '@/data/hangmentleData';

type Status = 'playing' | 'solved';

interface SavedProgress {
  guesses: HangmentleGuess[];
  status: Status;
}

const EMPTY_PROGRESS: SavedProgress = { guesses: [], status: 'playing' };
const storageKey = (puzzleNo: number) => `hangmentle:${puzzleNo}`;

// 새로고침해도 추측 기록이 남도록 기기에만 저장 (실패해도 게임은 그대로 진행)
const loadProgress = (puzzleNo: number): SavedProgress => {
  try {
    const raw = localStorage.getItem(storageKey(puzzleNo));
    if (!raw) return EMPTY_PROGRESS;
    const saved = JSON.parse(raw) as SavedProgress;
    // 예전 '포기' 기록은 이어서 풀 수 있게 진행 중으로 돌린다
    return { guesses: saved.guesses, status: saved.status === 'solved' ? 'solved' : 'playing' };
  } catch {
    return EMPTY_PROGRESS;
  }
};

const saveProgress = (puzzleNo: number, progress: SavedProgress) => {
  try {
    localStorage.setItem(storageKey(puzzleNo), JSON.stringify(progress));
  } catch {
    // 저장 공간을 못 쓰는 환경(사생활 보호 모드 등)
  }
};

const fetchJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json() as Promise<T>;
};

const PUZZLE_LABELS = Array.from({ length: HANGMENTLE_PUZZLE_COUNT }, (_, i) => `문제 ${i + 1}`);
// 정답을 맞힌 뒤 보여 주는 유사도 순위를 몇 개씩 늘릴지
const RANKING_PAGE = 50;
// 목록이 끝나 갈 때도 이만큼은 늘 보이게 한다. 남은 목록이 이보다 짧아지면 힌트·입력창도 목록과 함께 위로 올라간다
const LIST_MIN_VISIBLE = 360;

const HangmentleGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const [puzzleNo, setPuzzleNo] = useState(1);
  const [progress, setProgress] = useState<SavedProgress>(() => loadProgress(1));
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [lastGuess, setLastGuess] = useState<HangmentleGuess | null>(null);
  const [rankingCount, setRankingCount] = useState(RANKING_PAGE);
  const stickyRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const lastRowRef = useRef<HTMLLIElement>(null);

  const vocabQuery = useQuery({
    queryKey: ['hangmentle', 'vocab'],
    queryFn: () => fetchJson<string[]>(hangmentleVocabUrl),
    staleTime: Infinity,
  });
  const puzzleQuery = useQuery({
    queryKey: ['hangmentle', 'puzzle', puzzleNo],
    queryFn: () => fetchJson<HangmentlePuzzleFile>(hangmentlePuzzleUrl(puzzleNo)),
    staleTime: Infinity,
  });

  const round = useMemo(
    () =>
      vocabQuery.data && puzzleQuery.data
        ? createHangmentleRound(vocabQuery.data, puzzleQuery.data.sims)
        : null,
    [vocabQuery.data, puzzleQuery.data],
  );

  useEffect(() => {
    saveProgress(puzzleNo, progress);
  }, [puzzleNo, progress]);

  const changePuzzle = (no: number) => {
    setPuzzleNo(no);
    setProgress(loadProgress(no));
    setInput('');
    setMessage(null);
    setLastGuess(null);
    setRankingCount(RANKING_PAGE);
  };

  // 정답을 맞히면 키보드를 내리고 페이지 맨 위로 올려 정답 카드·순위표가 바로 보이게 한다
  const scrollToPageTop = () => {
    (document.activeElement as HTMLElement | null)?.blur();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rootRef.current
      ?.closest('.overflow-y-auto')
      ?.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!round || !input.trim()) return;

    const result = round.evaluate(input, progress.guesses);
    if (result.kind === 'unknown') {
      setMessage(
        isEng
          ? `"${result.word}" is not in the word list`
          : `'${result.word}'은(는) 모르는 단어예요`,
      );
      return;
    }
    if (result.kind === 'duplicate') {
      // 이미 추측한 단어라고 알려 주면서, 검색처럼 결과를 맨 위 강조 줄에 다시 보여 준다 (횟수는 그대로)
      setMessage(
        isEng
          ? `You already tried "${result.guess.word}"`
          : `'${result.guess.word}'은(는) 이미 추측했어요`,
      );
      setInput('');
      setLastGuess({ ...result.guess });
      return;
    }
    setMessage(null);
    setInput('');
    setLastGuess(result.guess);
    setProgress((prev) => ({
      guesses: [...prev.guesses, result.guess],
      status: result.guess.rank === 0 ? 'solved' : prev.status,
    }));
    if (result.guess.rank === 0) scrollToPageTop();
  };

  const restart = () => {
    setProgress(EMPTY_PROGRESS);
    setLastGuess(null);
    setMessage(null);
    setRankingCount(RANKING_PAGE);
  };

  const rankLabel = (guess: HangmentleGuess) => {
    if (guess.rank === 0) return isEng ? 'Answer!' : '정답!';
    if (guess.rank === null)
      return isEng ? `${HANGMENTLE_TOP_RANK}+` : `${HANGMENTLE_TOP_RANK}위 밖`;
    return isEng ? `#${guess.rank}` : `${guess.rank}위`;
  };

  // 화면에는 문제마다 늘린 점수를 보여 준다 (순서는 원래 유사도와 같음)
  const showScore = (similarity: number) =>
    formatSimilarity(round ? round.toScore(similarity) : similarity);

  const renderGuessRow = (guess: HangmentleGuess, highlight = false) => (
    <li
      key={`${guess.order}-${guess.word}`}
      ref={highlight ? lastRowRef : undefined}
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
          {rankLabel(guess)}
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

  const isLoading = vocabQuery.isPending || puzzleQuery.isPending;
  const isError = vocabQuery.isError || puzzleQuery.isError;
  const finished = progress.status !== 'playing';
  const guessedWords = new Set(progress.guesses.map((guess) => guess.word));

  // 힌트·입력창 묶음이 목록 위에 겹쳐 있는지 (상단바 아래에 붙어 있거나, 목록 끝에서 목록과 함께 올라가는 중)
  const hasListBody = !finished && progress.guesses.length > 0;
  const isOverList = useStickyOverlap(stickyRef, Boolean(round));

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

  const guessHeader = (
    <div className="flex items-center gap-3 font-typewriter text-[11px] leading-4 opacity-50">
      <span className="w-6">#</span>
      <span className="flex-1">{isEng ? 'WORD' : '단어'}</span>
      <span>{isEng ? 'SCORE' : '유사도'}</span>
      <span className="w-[84px] text-right">{isEng ? 'RANK' : '순위'}</span>
    </div>
  );
  const showGuessList = progress.guesses.length > 0;

  return (
    <div ref={rootRef} className="flex flex-col gap-6">
      <p className="font-body-kr text-[14px] leading-5 text-paper/80">
        {isEng
          ? 'Guess the secret Korean word. Each guess shows how close its meaning is — use the scores as clues.'
          : '정답 단어와 뜻이 얼마나 가까운지 유사도(%)로 알려 줘요. 유사도가 높은 단어를 실마리 삼아 정답을 찾아보세요.'}
      </p>

      {HANGMENTLE_PUZZLE_COUNT > 1 && (
        <CategoryList
          categories={PUZZLE_LABELS}
          selectedCategory={PUZZLE_LABELS[puzzleNo - 1]}
          onSelect={(label) => changePuzzle(PUZZLE_LABELS.indexOf(label) + 1)}
        />
      )}

      {isLoading && (
        <section className={`${GAME_CARD} text-center`}>
          <p className="font-body-kr text-[15px] font-semibold opacity-70">
            {isEng ? 'Loading words…' : '단어를 불러오는 중이에요…'}
          </p>
        </section>
      )}

      {isError && (
        <section className={`${GAME_CARD} text-center`}>
          <p className="font-body-kr text-[15px] font-semibold opacity-70">
            {isEng ? 'Could not load the word list.' : '단어 데이터를 불러오지 못했어요.'}
          </p>
          <button
            type="button"
            onClick={() => {
              vocabQuery.refetch();
              puzzleQuery.refetch();
            }}
            className={`${SECONDARY_BUTTON} mt-4`}
          >
            {isEng ? 'Try Again' : '다시 시도'}
          </button>
        </section>
      )}

      {round && (
        <>
          {/* 고정 범위: 힌트·입력창 묶음은 이 안에서만 붙어 있다. 목록 몸통의 음수 아래 여백으로 범위를 목록 끝보다
              LIST_MIN_VISIBLE만큼 앞에서 끝내고, 같은 크기의 양수 여백으로 아래 배치는 그대로 둔다 */}
          <div
            className="flex flex-col"
            style={hasListBody ? { marginBottom: LIST_MIN_VISIBLE } : undefined}
          >
            {/* 진행 중에는 스크롤해도 힌트·입력창·추측 목록 카드 윗부분(머리줄)이 화면 위에 붙어 있고 그 아래 목록만 움직인다.
              붙으면 뒤 하늘과 같은 그라디언트·별을 깔아 경계가 보이지 않게 한다 */}
            <div
              ref={stickyRef}
              className={`-mx-5 -mt-3 px-5 pt-3 ${finished ? '' : 'sticky z-20'}`}
              style={
                finished
                  ? undefined
                  : {
                      top: STICKY_BAND_TOP,
                      background: isOverList ? skyBackground('var(--band-top)') : undefined,
                    }
              }
            >
              {isOverList && !finished && <BandStars />}
              <div className="relative z-10 flex flex-col gap-4">
                <section className={GAME_CARD}>
                  <p className="font-typewriter text-[12px] leading-4 opacity-60">
                    {`PUZZLE ${String(puzzleNo).padStart(2, '0')} · ${
                      isEng
                        ? `${progress.guesses.length} GUESSES`
                        : `${progress.guesses.length}번 추측`
                    }`}
                  </p>
                  <p className="pt-3 font-body-kr text-[14px] leading-6">
                    {isEng ? (
                      <>
                        The closest word is <b>{showScore(round.hints.first)}</b> similar, the 10th{' '}
                        <b>{showScore(round.hints.tenth)}</b>, and the 1000th{' '}
                        <b>{showScore(round.hints.thousandth)}</b>.
                      </>
                    ) : (
                      <>
                        정답과 가장 가까운 단어의 유사도는 <b>{showScore(round.hints.first)}</b>,
                        10번째는 <b>{showScore(round.hints.tenth)}</b>, 1000번째는{' '}
                        <b>{showScore(round.hints.thousandth)}</b>예요.
                      </>
                    )}
                  </p>
                </section>

                {finished ? (
                  <section className="rounded-[16px] border-2 border-ink bg-rust p-5 text-center text-paper drop-shadow-[5px_5px_0px_var(--color-ink)]">
                    <p className="font-typewriter text-[12px] leading-4 opacity-80">
                      {isEng ? 'YOU GOT IT' : '정답'}
                    </p>
                    <p className="pt-2 font-display text-[40px] leading-[48px]">{round.answer}</p>
                    <p className="pt-2 font-body-kr text-[14px] leading-5 opacity-90">
                      {isEng
                        ? `Solved in ${progress.guesses.length} guesses`
                        : `${progress.guesses.length}번 만에 맞혔어요!`}
                    </p>
                  </section>
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
                        autoComplete="off"
                        autoCorrect="off"
                        placeholder={isEng ? 'Type a Korean word' : '단어를 입력하세요'}
                        aria-label={isEng ? 'Your guess' : '추측할 단어'}
                        className="h-12 min-w-0 flex-1 rounded-full bg-paper px-5 font-body-kr text-[16px] text-ink outline-none placeholder:text-ink/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                      />
                      <button
                        type="submit"
                        disabled={!input.trim()}
                        className="h-12 shrink-0 rounded-full border-2 border-ink bg-rust px-5 font-display text-[16px] text-paper drop-shadow-[3px_3px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-40"
                      >
                        {isEng ? 'Guess' : '추측'}
                      </button>
                    </div>
                    {message && (
                      <p
                        role="alert"
                        className="px-2 font-body-kr text-[13px] font-semibold text-paper"
                      >
                        {message}
                      </p>
                    )}
                  </form>
                )}

                {/* 추측 목록 카드의 윗부분. 아래 몸통과 맞붙어 카드 하나로 보인다 */}
                {hasListBody && (
                  <div className="relative mt-2 rounded-t-[16px] border-x-2 border-t-2 border-ink bg-paper px-5 pt-5 shadow-[5px_0_0_0_var(--color-ink)]">
                    <div className="pb-2">{guessHeader}</div>
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
                {lastGuess && <ul className="pb-2">{renderGuessRow(lastGuess, true)}</ul>}
                <ul>{sortGuesses(progress.guesses).map((guess) => renderGuessRow(guess))}</ul>
              </section>
            )}
          </div>

          {finished && (
            <section className={GAME_CARD}>
              <p className="font-typewriter text-[12px] leading-4 opacity-60">
                {isEng ? 'SIMILARITY RANKING' : '유사도 순위'}
              </p>
              <ul className="pt-2">
                {[
                  { word: round.answer, similarity: 10000, rank: 0 },
                  ...round.nearest(rankingCount),
                ].map((neighbor) => (
                  <li
                    key={neighbor.word}
                    className={`flex items-center gap-3 border-b border-dashed border-ink/30 py-2 last:border-b-0 ${
                      guessedWords.has(neighbor.word)
                        ? '-mx-2 rounded-[8px] border-b-0 bg-mustard/30 px-2'
                        : ''
                    }`}
                  >
                    <span
                      className={`w-10 shrink-0 font-typewriter text-[12px] leading-4 ${
                        neighbor.rank === 0 ? 'font-bold text-rust' : 'opacity-50'
                      }`}
                    >
                      {neighbor.rank === 0 ? (isEng ? 'ANS' : '정답') : neighbor.rank}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-display text-[16px] leading-6">
                      {neighbor.word}
                    </span>
                    <span className="shrink-0 font-condensed text-[15px] font-bold leading-6">
                      {showScore(neighbor.similarity)}
                    </span>
                  </li>
                ))}
              </ul>
              {rankingCount < HANGMENTLE_TOP_RANK && (
                <button
                  type="button"
                  onClick={() =>
                    setRankingCount((count) => Math.min(count + RANKING_PAGE, HANGMENTLE_TOP_RANK))
                  }
                  className="mt-3 h-10 w-full rounded-full border border-ink/20 font-body-kr text-[14px] font-semibold active:bg-ink/5"
                >
                  {isEng ? 'Show more' : `더 보기 (${rankingCount}/${HANGMENTLE_TOP_RANK})`}
                </button>
              )}
              <p className="pt-3 font-body-kr text-[12px] leading-4 opacity-60">
                {isEng
                  ? 'Highlighted words are ones you guessed.'
                  : '노란 줄은 내가 추측했던 단어예요.'}
              </p>
            </section>
          )}

          {finished && showGuessList && (
            <section className={GAME_CARD}>
              <div className="pb-2">{guessHeader}</div>
              <ul>{sortGuesses(progress.guesses).map((guess) => renderGuessRow(guess))}</ul>
            </section>
          )}

          {finished && (
            <button type="button" onClick={restart} className={PRIMARY_BUTTON}>
              {isEng ? 'Play Again' : '처음부터 다시'}
            </button>
          )}

          <p className="text-center font-body-kr text-[11px] leading-4 text-ink/50">
            {isEng ? 'Word similarity' : '단어 유사도'}: fastText Korean vectors (CC BY-SA 3.0)
          </p>
        </>
      )}
    </div>
  );
};

export default HangmentleGame;
