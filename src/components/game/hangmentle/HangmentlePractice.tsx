import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { GAME_CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from '../gameStyles';
import HangmentleBoard, { GuessListCard, type HangmentleGuessOutcome } from './HangmentleBoard';
import NearestList from './NearestList';
import {
  HANGMENTLE_NEAREST_PAGE as NEAREST_PAGE,
  HANGMENTLE_TOP_RANK,
  createHangmentleRound,
  formatSimilarity,
  hangmentlePuzzleUrl,
  hangmentleVocabUrl,
  type HangmentlePuzzleFile,
} from '@/data/hangmentleData';
import {
  EMPTY_PROGRESS,
  loadProgress,
  practiceProgressKey,
  saveProgress,
} from '@/lib/hangmentleProgress';

const fetchJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json() as Promise<T>;
};

interface HangmentlePracticeProps {
  puzzleNo: number;
}

// 연습 문제: 단어 목록·유사도를 받아 브라우저에서 채점한다. 서버 API는 부르지 않는다
const HangmentlePractice = ({ puzzleNo }: HangmentlePracticeProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const storageKey = practiceProgressKey(puzzleNo);
  const [progress, setProgress] = useState(() => loadProgress(storageKey));
  const [nearestCount, setNearestCount] = useState(NEAREST_PAGE);
  // 처음부터 다시 하면 입력창·강조 줄도 새로 시작하도록 판을 다시 만든다
  const [playId, setPlayId] = useState(0);

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
    saveProgress(storageKey, progress);
  }, [storageKey, progress]);

  if (vocabQuery.isPending || puzzleQuery.isPending) {
    return (
      <section className={`${GAME_CARD} text-center`}>
        <p className="font-body-kr text-[15px] font-semibold opacity-70">
          {isEng ? 'Loading words…' : '단어를 불러오는 중입니다…'}
        </p>
      </section>
    );
  }

  if (!round) {
    return (
      <section className={`${GAME_CARD} text-center`}>
        <p className="font-body-kr text-[15px] font-semibold opacity-70">
          {isEng ? 'Could not load the word list.' : '단어 데이터를 불러오지 못했습니다.'}
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
    );
  }

  const solved = progress.status === 'solved';
  // 화면에는 문제마다 늘린 점수를 보여 준다 (순서는 원래 유사도와 같음)
  const showScore = (similarity: number) => formatSimilarity(round.toScore(similarity));

  const handleGuess = (input: string): HangmentleGuessOutcome => {
    const result = round.evaluate(input, progress.guesses);
    if (result.kind === 'ok') {
      setProgress((prev) => ({
        guesses: [...prev.guesses, result.guess],
        status: result.guess.rank === 0 ? 'solved' : prev.status,
      }));
    }
    return result;
  };

  const restart = () => {
    setProgress(EMPTY_PROGRESS);
    setNearestCount(NEAREST_PAGE);
    setPlayId((id) => id + 1);
  };

  return (
    <>
      <HangmentleBoard
        key={playId}
        label={`PUZZLE ${String(puzzleNo).padStart(2, '0')}`}
        hints={round.hints}
        showScore={showScore}
        guesses={progress.guesses}
        solved={solved}
        onGuess={handleGuess}
        solvedCard={
          <section className="rounded-[16px] border-2 border-ink bg-rust p-5 text-center text-paper shadow-[5px_5px_0px_0px_var(--color-ink)]">
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
        }
      />

      {solved && (
        <NearestList
          answer={round.answer}
          neighbors={round.nearest(nearestCount)}
          count={nearestCount}
          onMore={() =>
            setNearestCount((count) => Math.min(count + NEAREST_PAGE, HANGMENTLE_TOP_RANK))
          }
          guessedWords={new Set(progress.guesses.map((guess) => guess.word))}
          showScore={showScore}
        />
      )}

      {solved && progress.guesses.length > 0 && (
        <GuessListCard guesses={progress.guesses} showScore={showScore} />
      )}

      {solved && (
        <button type="button" onClick={restart} className={PRIMARY_BUTTON}>
          {isEng ? 'Play Again' : '처음부터 다시'}
        </button>
      )}
    </>
  );
};

export default HangmentlePractice;
