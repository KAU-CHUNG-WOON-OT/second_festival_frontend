import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import CategoryList from '../common/CategoryList';
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

type Status = 'playing' | 'solved' | 'gaveUp';

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
    return raw ? (JSON.parse(raw) as SavedProgress) : EMPTY_PROGRESS;
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

const HangmentleGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const [puzzleNo, setPuzzleNo] = useState(1);
  const [progress, setProgress] = useState<SavedProgress>(() => loadProgress(1));
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [lastGuess, setLastGuess] = useState<HangmentleGuess | null>(null);

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
    () => (vocabQuery.data && puzzleQuery.data ? createHangmentleRound(vocabQuery.data, puzzleQuery.data.sims) : null),
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
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!round || !input.trim()) return;

    const result = round.evaluate(input, progress.guesses);
    if (result.kind === 'unknown') {
      setMessage(isEng ? `"${result.word}" is not in the word list` : `'${result.word}'은(는) 모르는 단어예요`);
      return;
    }
    if (result.kind === 'duplicate') {
      setMessage(isEng ? `You already tried "${result.word}"` : `'${result.word}'은(는) 이미 추측했어요`);
      return;
    }
    setMessage(null);
    setInput('');
    setLastGuess(result.guess);
    setProgress((prev) => ({
      guesses: [...prev.guesses, result.guess],
      status: result.guess.rank === 0 ? 'solved' : prev.status,
    }));
  };

  const restart = () => {
    setProgress(EMPTY_PROGRESS);
    setLastGuess(null);
    setMessage(null);
  };

  const rankLabel = (guess: HangmentleGuess) => {
    if (guess.rank === 0) return isEng ? 'Answer!' : '정답!';
    if (guess.rank === null) return isEng ? `${HANGMENTLE_TOP_RANK}+` : `${HANGMENTLE_TOP_RANK}위 밖`;
    return isEng ? `#${guess.rank}` : `${guess.rank}위`;
  };

  const renderGuessRow = (guess: HangmentleGuess, highlight = false) => (
    <li
      key={`${guess.order}-${guess.word}`}
      className={`flex items-center gap-3 border-b border-dashed border-ink/30 py-3 last:border-b-0 ${
        highlight ? '-mx-2 rounded-[8px] border-b-0 bg-mustard/30 px-2' : ''
      }`}
    >
      <span className="w-6 shrink-0 font-typewriter text-[12px] leading-4 opacity-50">{guess.order}</span>
      <span className="min-w-0 flex-1 truncate font-display text-[17px] leading-6">{guess.word}</span>
      <span className="shrink-0 font-condensed text-[17px] font-bold leading-6">{formatSimilarity(guess.similarity)}</span>
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
              style={{ width: `${((HANGMENTLE_TOP_RANK - guess.rank + 1) / HANGMENTLE_TOP_RANK) * 100}%` }}
            />
          </span>
        )}
      </span>
    </li>
  );

  const isLoading = vocabQuery.isPending || puzzleQuery.isPending;
  const isError = vocabQuery.isError || puzzleQuery.isError;
  const finished = progress.status !== 'playing';

  return (
    <div className="flex flex-col gap-6">
      <p className="font-body-kr text-[14px] leading-5 text-paper/80">
        {isEng
          ? 'Guess the secret Korean word. Each guess shows how close its meaning is — use the scores as clues.'
          : '정답 단어와 뜻이 얼마나 가까운지 점수로 알려 줘요. 점수가 높은 단어를 실마리 삼아 정답을 찾아보세요.'}
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
          <section className={GAME_CARD}>
            <p className="font-typewriter text-[12px] leading-4 opacity-60">
              {`PUZZLE ${String(puzzleNo).padStart(2, '0')} · ${
                isEng ? `${progress.guesses.length} GUESSES` : `${progress.guesses.length}번 추측`
              }`}
            </p>
            <p className="pt-3 font-body-kr text-[14px] leading-6">
              {isEng ? (
                <>
                  The closest word scores <b>{formatSimilarity(round.hints.first)}</b>, the 10th{' '}
                  <b>{formatSimilarity(round.hints.tenth)}</b>, and the 1000th{' '}
                  <b>{formatSimilarity(round.hints.thousandth)}</b>.
                </>
              ) : (
                <>
                  정답과 가장 가까운 단어는 <b>{formatSimilarity(round.hints.first)}</b>점, 10번째는{' '}
                  <b>{formatSimilarity(round.hints.tenth)}</b>점, 1000번째는{' '}
                  <b>{formatSimilarity(round.hints.thousandth)}</b>점이에요.
                </>
              )}
            </p>
          </section>

          {finished ? (
            <section
              className={`rounded-[16px] border-2 border-ink p-5 text-center drop-shadow-[5px_5px_0px_var(--color-ink)] ${
                progress.status === 'solved' ? 'bg-rust text-paper' : 'bg-ink text-paper'
              }`}
            >
              <p className="font-typewriter text-[12px] leading-4 opacity-80">
                {progress.status === 'solved' ? (isEng ? 'YOU GOT IT' : '정답') : isEng ? 'THE ANSWER WAS' : '정답은'}
              </p>
              <p className="pt-2 font-display text-[40px] leading-[48px]">{round.answer}</p>
              <p className="pt-2 font-body-kr text-[14px] leading-5 opacity-90">
                {progress.status === 'solved'
                  ? isEng
                    ? `Solved in ${progress.guesses.length} guesses`
                    : `${progress.guesses.length}번 만에 맞혔어요!`
                  : isEng
                    ? 'Better luck next time'
                    : '다음엔 꼭 맞혀 봐요'}
              </p>
              <div className="mt-5 border-t border-dashed border-paper/50 pt-4">
                <p className="font-typewriter text-[12px] leading-4 opacity-80">{isEng ? 'CLOSEST WORDS' : '가장 가까운 단어'}</p>
                <p className="pt-2 font-body-kr text-[14px] leading-6">{round.nearest(10).join(' · ')}</p>
              </div>
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
                <p role="alert" className="px-2 font-body-kr text-[13px] font-semibold text-paper">
                  {message}
                </p>
              )}
            </form>
          )}

          {progress.guesses.length > 0 && (
            <section className={GAME_CARD}>
              <div className="flex items-center gap-3 pb-1 font-typewriter text-[11px] leading-4 opacity-50">
                <span className="w-6">#</span>
                <span className="flex-1">{isEng ? 'WORD' : '단어'}</span>
                <span>{isEng ? 'SCORE' : '유사도'}</span>
                <span className="w-[84px] text-right">{isEng ? 'RANK' : '순위'}</span>
              </div>
              {lastGuess && !finished && <ul className="pb-2">{renderGuessRow(lastGuess, true)}</ul>}
              <ul>{sortGuesses(progress.guesses).map((guess) => renderGuessRow(guess))}</ul>
            </section>
          )}

          {finished ? (
            <button type="button" onClick={restart} className={PRIMARY_BUTTON}>
              {isEng ? 'Play Again' : '처음부터 다시'}
            </button>
          ) : (
            progress.guesses.length > 0 && (
              <button
                type="button"
                onClick={() => setProgress((prev) => ({ ...prev, status: 'gaveUp' }))}
                className={SECONDARY_BUTTON}
              >
                {isEng ? 'Give Up & Show Answer' : '포기하고 정답 보기'}
              </button>
            )
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
