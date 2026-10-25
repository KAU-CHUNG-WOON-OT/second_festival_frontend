import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsLogin } from '@/hooks/useIsLogin';
import { ApiError } from '@/lib/apiClient';
import { getKakaoLoginUrl } from '@/lib/kakaoLogin';
import { track } from '@/lib/mixpanel';
import kakaoIcon from '@/assets/kakao_icon.svg';
import { GAME_CARD, SECONDARY_BUTTON } from '../gameStyles';
import HangmentleBoard, {
  GuessListCard,
  HintCard,
  type HangmentleGuessOutcome,
} from './HangmentleBoard';
import HangmentleRanking from './HangmentleRanking';
import NearestList from './NearestList';
import {
  HANGMENTLE_NEAREST_PAGE as NEAREST_PAGE,
  HANGMENTLE_TOP_RANK,
  createScoreScale,
  formatSimilarity,
  normalizeGuess,
} from '@/data/hangmentleData';
import {
  HANGMENTLE_RANKING_SIZE,
  classifyGuessError,
  formatKstTime,
  guessErrorText,
  guessFromResponse,
  resolveEventProgress,
  solveRankText,
  type HangmentleEventRound,
} from '@/data/hangmentleEvent';
import {
  fetchHangmentleNearest,
  fetchHangmentleRound,
  fetchMyHangmentleRecord,
  hangmentleEventKeys,
  postHangmentleGuess,
  type HangmentleMyRecord,
} from '@/lib/api/hangmentle';
import { eventProgressKey, loadProgress, saveProgress } from '@/lib/hangmentleProgress';

// 열리기 전에는 이 간격으로 다시 물어 열리면 바로 풀 수 있게 한다
const CLOSED_REFRESH_MS = 30_000;

interface HangmentleEventProps {
  event: HangmentleEventRound;
}

// 이벤트 회차: 정답은 서버만 알고, 추측할 때마다 서버가 채점한다. 비회원은 힌트와 랭킹만 본다
const HangmentleEvent = ({ event }: HangmentleEventProps) => {
  const { round } = event;
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const label = isEng ? event.labelEn : event.label;
  const isLogin = useIsLogin();
  const queryClient = useQueryClient();

  const storageKey = eventProgressKey(round);
  const [localProgress, setLocalProgress] = useState(() => loadProgress(storageKey));
  const [nearestCount, setNearestCount] = useState(NEAREST_PAGE);

  const infoQuery = useQuery({
    queryKey: hangmentleEventKeys.round(round),
    queryFn: () => fetchHangmentleRound(round),
    refetchInterval: (query) =>
      query.state.data && !query.state.data.open ? CLOSED_REFRESH_MS : false,
  });
  // 다른 기기에서 맞혔거나 기기 기록이 지워졌어도 맞힌 상태를 되살린다
  const recordQuery = useQuery({
    queryKey: hangmentleEventKeys.myRecord(round),
    queryFn: () => fetchMyHangmentleRecord(round),
    enabled: isLogin,
  });
  const record = isLogin ? recordQuery.data : undefined;
  const progress = resolveEventProgress(localProgress, record);
  const solved = progress.status === 'solved';
  // 이 기기에서 맞혔으면 정답을 안다 (서버는 정답을 따로 알려 주지 않는다)
  const answer = progress.guesses.find((guess) => guess.rank === 0)?.word ?? null;
  const myRank = record?.solved ? record.rank : null;

  const nearestQuery = useQuery({
    queryKey: hangmentleEventKeys.nearest(round, nearestCount),
    queryFn: () => fetchHangmentleNearest(round, nearestCount),
    enabled: isLogin && solved,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  useEffect(() => {
    saveProgress(storageKey, localProgress);
  }, [storageKey, localProgress]);

  const handleLogin = () => {
    const loginUrl = getKakaoLoginUrl();
    if (!loginUrl) return;
    track('hangmentle_kakao_login_clicked', { round });
    window.location.href = loginUrl;
  };

  const handleGuess = async (input: string): Promise<HangmentleGuessOutcome> => {
    const word = normalizeGuess(input);
    // 이미 추측한 단어는 서버에 묻지 않고 그때 결과를 다시 보여 준다
    const existing = progress.guesses.find((guess) => guess.word === word);
    if (existing) return { kind: 'duplicate', guess: existing };

    try {
      const res = await postHangmentleGuess(round, word);
      const guess = guessFromResponse(res, progress.guesses.length + 1);
      if (!guess) return { kind: 'unknown', word: res.word || word };
      const sameWord = progress.guesses.find((prev) => prev.word === guess.word);
      if (sameWord) return { kind: 'duplicate', guess: sameWord };

      if (res.correct) {
        // 늦게 도착한 '안 맞힘' 응답이 덮어쓰지 않도록 진행 중인 조회를 멈추고 바로 맞힌 기록을 넣는다
        const recordKey = hangmentleEventKeys.myRecord(round);
        await queryClient.cancelQueries({ queryKey: recordKey });
        if (res.solved) {
          queryClient.setQueryData<HangmentleMyRecord>(recordKey, {
            solved: true,
            rank: res.solved.rank,
            solvedAt: res.solved.solvedAt,
          });
        } else {
          queryClient.invalidateQueries({ queryKey: recordKey });
        }
        queryClient.invalidateQueries({ queryKey: hangmentleEventKeys.rankings(round) });
      }
      setLocalProgress({
        guesses: [...progress.guesses, guess],
        status: res.correct ? 'solved' : 'playing',
      });
      return { kind: 'ok', guess };
    } catch (error) {
      const kind = classifyGuessError(error);
      // 아직 안 열렸다고 하면 회차 정보를 다시 받아 '열리지 않은 문제' 안내로 바꾼다
      if (kind === 'notOpen') {
        queryClient.invalidateQueries({ queryKey: hangmentleEventKeys.round(round) });
      }
      return { kind: 'error', message: guessErrorText(kind, isEng) };
    }
  };

  const ranking = <HangmentleRanking round={round} label={label} myRank={myRank} />;
  const cardLabel = `EVENT ${label}`;

  const loginCard = (
    <section className={`${GAME_CARD} text-center`}>
      <p className="font-display text-[20px] leading-7">
        {isEng ? 'Log in to join the event' : '로그인하면 참여할 수 있어요'}
      </p>
      <p className="pt-2 font-body-kr text-[14px] leading-5 opacity-70">
        {isEng
          ? `Guests can only see the hints and the ranking. The first ${HANGMENTLE_RANKING_SIZE} to solve it make the ranking.`
          : `비회원은 힌트와 랭킹만 볼 수 있어요. 먼저 맞힌 ${HANGMENTLE_RANKING_SIZE}명이 랭킹에 올라요.`}
      </p>
      <button
        type="button"
        onClick={handleLogin}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-[#fee500] font-body-kr text-[15px] font-bold text-ink drop-shadow-[3px_3px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
      >
        <img src={kakaoIcon} alt="" width={18} height={17} />
        {isEng ? 'Log in with Kakao' : '카카오로 로그인하기'}
      </button>
    </section>
  );

  if (infoQuery.isPending) {
    return (
      <>
        <section className={`${GAME_CARD} text-center`}>
          <p className="font-body-kr text-[15px] font-semibold opacity-70">
            {isEng ? 'Loading the puzzle…' : '문제를 불러오는 중이에요…'}
          </p>
        </section>
        {ranking}
      </>
    );
  }

  if (infoQuery.isError) {
    const notFound = infoQuery.error instanceof ApiError && infoQuery.error.status === 404;
    return (
      <>
        <section className={`${GAME_CARD} text-center`}>
          <p className="font-body-kr text-[15px] font-semibold opacity-70">
            {notFound
              ? isEng
                ? 'This round does not exist.'
                : '없는 문제예요.'
              : isEng
                ? 'Could not load the puzzle.'
                : '문제를 불러오지 못했어요.'}
          </p>
          {!notFound && (
            <button
              type="button"
              onClick={() => infoQuery.refetch()}
              className={`${SECONDARY_BUTTON} mt-4`}
            >
              {isEng ? 'Try Again' : '다시 시도'}
            </button>
          )}
        </section>
        {ranking}
      </>
    );
  }

  const info = infoQuery.data;

  if (!info.open) {
    return (
      <>
        <section className={`${GAME_CARD} text-center`}>
          <p className="font-typewriter text-[12px] leading-4 opacity-60">{cardLabel}</p>
          <p className="pt-2 font-display text-[20px] leading-7">
            {isEng ? 'Not open yet' : '아직 열리지 않은 문제예요'}
          </p>
          {info.opensAt && (
            <p className="pt-1 font-body-kr text-[14px] leading-5 opacity-70">
              {isEng
                ? `Opens at ${formatKstTime(info.opensAt, false)}`
                : `${formatKstTime(info.opensAt, false)}에 열려요`}
            </p>
          )}
        </section>
        {!isLogin && loginCard}
        {ranking}
      </>
    );
  }

  // 화면에는 회차마다 늘린 점수를 보여 준다 (연습 문제와 같은 방식, 순서는 원래 유사도와 같음)
  const toScore = createScoreScale(info.hints.first, info.hints.tenth, info.hints.thousandth);
  const showScore = (similarity: number) => formatSimilarity(toScore(similarity));

  if (!isLogin) {
    return (
      <>
        <HintCard label={cardLabel} hints={info.hints} showScore={showScore} />
        {loginCard}
        {ranking}
      </>
    );
  }

  return (
    <>
      <HangmentleBoard
        label={cardLabel}
        hints={info.hints}
        showScore={showScore}
        guesses={progress.guesses}
        solved={solved}
        onGuess={handleGuess}
        solvedCard={
          <section className="rounded-[16px] border-2 border-ink bg-rust p-5 text-center text-paper drop-shadow-[5px_5px_0px_var(--color-ink)]">
            <p className="font-typewriter text-[12px] leading-4 opacity-80">
              {isEng ? 'YOU GOT IT!' : '정답!'}
            </p>
            {answer && <p className="pt-2 font-display text-[40px] leading-[48px]">{answer}</p>}
            {myRank !== null && (
              <p className="pt-2 font-display text-[22px] leading-7">
                {solveRankText(myRank, isEng)}
              </p>
            )}
            {answer && (
              <p className="pt-1 font-body-kr text-[14px] leading-5 opacity-90">
                {isEng
                  ? `Solved in ${progress.guesses.length} guesses`
                  : `${progress.guesses.length}번 만에 맞혔어요`}
              </p>
            )}
          </section>
        }
      />

      {ranking}

      {solved && (
        <NearestList
          answer={answer}
          neighbors={nearestQuery.data ?? []}
          count={nearestCount}
          onMore={() =>
            setNearestCount((count) => Math.min(count + NEAREST_PAGE, HANGMENTLE_TOP_RANK))
          }
          guessedWords={new Set(progress.guesses.map((guess) => guess.word))}
          showScore={showScore}
          loading={nearestQuery.isPending || nearestQuery.isPlaceholderData}
          error={nearestQuery.isError}
          onRetry={() => nearestQuery.refetch()}
        />
      )}

      {solved && progress.guesses.length > 0 && (
        <GuessListCard guesses={progress.guesses} showScore={showScore} />
      )}
    </>
  );
};

export default HangmentleEvent;
