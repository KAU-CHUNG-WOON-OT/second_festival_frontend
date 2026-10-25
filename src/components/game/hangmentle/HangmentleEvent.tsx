import { useEffect, useState, type ReactNode } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsLogin } from '@/hooks/useIsLogin';
import { useServerNowAt } from '@/hooks/useServerNow';
import { ApiError } from '@/lib/apiClient';
import { serverNow } from '@/lib/serverClock';
import { GAME_CARD, SECONDARY_BUTTON } from '../gameStyles';
import HangmentleBoard, {
  GuessListCard,
  HintCard,
  type HangmentleGuessOutcome,
} from './HangmentleBoard';
import CountdownText from './HangmentleCountdown';
import { LoginCard } from './HangmentleLogin';
import HangmentleRanking from './HangmentleRanking';
import NearestList from './NearestList';
import {
  HANGMENTLE_NEAREST_PAGE as NEAREST_PAGE,
  HANGMENTLE_TOP_RANK,
  createScoreScale,
  formatSimilarity,
  normalizeGuess,
} from '@/data/hangmentleData';
import { formatOpensAt, parseServerTime } from '@/data/hangmentleClock';
import {
  OPENING_FAST_RETRY_MS,
  classifyGuessError,
  classifyRoundError,
  guessErrorText,
  guessFromResponse,
  isNotSolvedError,
  resolveEventProgress,
  roundPhase,
  roundPollInterval,
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

interface StatusCardProps {
  label: string;
  title: string;
  children?: ReactNode;
}

// 문제를 풀 수 없는 동안(불러오는 중·곧 열림·준비 중) 보여 주는 카드
const StatusCard = ({ label, title, children }: StatusCardProps) => (
  <section className={`${GAME_CARD} text-center`}>
    <p className="font-typewriter text-[12px] leading-4 opacity-60">{label}</p>
    <p className="pt-2 font-display text-[22px] leading-[30px]">{title}</p>
    {children}
  </section>
);

const StatusNote = ({ children }: { children: ReactNode }) => (
  <p className="pt-1 font-body-kr text-[14px] leading-5 opacity-70">{children}</p>
);

// 받아 둔 회차 정보는 그대로 보여 주면서, 다시 받기에 실패했다는 것만 작게 알린다
const UnstableNote = ({ isEng }: { isEng: boolean }) => (
  <p
    role="status"
    className="-mb-3 flex items-center justify-center gap-1.5 font-body-kr text-[13px] font-semibold leading-5 text-paper/80"
  >
    <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-mustard" />
    {isEng ? 'Connection is unstable' : '연결이 불안정해요'}
  </p>
);

interface HangmentleEventProps {
  event: HangmentleEventRound;
  // 없는 회차일 때 이벤트 안내로 돌아가기
  onShowHub: () => void;
}

// 이벤트 회차: 정답은 서버만 알고, 추측할 때마다 서버가 채점한다. 비회원은 힌트와 랭킹만 본다.
// 열리기 전에는 서버 시계로 센 카운트다운을 보여 주고, 0이 되는 순간 서버에 다시 물어 열리면 바로 문제 화면으로 바꾼다
const HangmentleEvent = ({ event, onShowHub }: HangmentleEventProps) => {
  const { round } = event;
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const label = isEng ? event.labelEn : event.label;
  const title = isEng ? event.titleEn : event.title;
  const isLogin = useIsLogin();
  const queryClient = useQueryClient();

  const storageKey = eventProgressKey(round);
  const [localProgress, setLocalProgress] = useState(() => loadProgress(storageKey));
  const [nearestCount, setNearestCount] = useState(NEAREST_PAGE);
  // 입력하던 단어. 잠깐 닫혔다(409) 다시 열려 입력판을 새로 그려도 이어서 보낼 수 있게 여기에 둔다
  const [draft, setDraft] = useState('');

  const infoQuery = useQuery({
    queryKey: hangmentleEventKeys.round(round),
    queryFn: () => fetchHangmentleRound(round),
    refetchInterval: (query) =>
      query.state.data ? roundPollInterval(query.state.data, serverNow()) : false,
    // 없는 회차는 다시 물어도 같으므로 바로 안내한다
    retry: (failureCount, error) => classifyRoundError(error) !== 'notFound' && failureCount < 1,
  });
  const info = infoQuery.data;
  const opensAtMs = parseServerTime(info?.opensAt);
  // 열리는 순간과, 열린 뒤에도 서버가 닫혀 있다고 할 때 1초마다 묻기를 멈추는 순간에 다시 그린다
  const now = useServerNowAt([
    opensAtMs,
    opensAtMs === null ? null : opensAtMs + OPENING_FAST_RETRY_MS,
  ]);
  const phase = info ? roundPhase(info, now) : null;

  // 카운트다운이 0이 되면 바로 서버에 묻는다 (이후 서버가 아직 닫혀 있다고 하면 refetchInterval이 1초마다 다시 묻는다)
  const { refetch: refetchInfo } = infoQuery;
  const passedOpensAt = !!info && !info.open && opensAtMs !== null && now >= opensAtMs;
  useEffect(() => {
    if (passedOpensAt) refetchInfo();
  }, [passedOpensAt, refetchInfo]);

  // 다른 기기에서 맞혔거나 기기 기록이 지워졌어도 맞힌 상태를 되살린다
  const recordQuery = useQuery({
    queryKey: hangmentleEventKeys.myRecord(round),
    queryFn: () => fetchMyHangmentleRecord(round),
    enabled: isLogin && phase === 'open',
  });
  const record = isLogin ? recordQuery.data : undefined;
  const progress = resolveEventProgress(localProgress, record);
  const solved = progress.status === 'solved';
  // 이 기기에서 맞혔으면 정답을 안다 (서버는 정답을 따로 알려 주지 않는다)
  const answer = progress.guesses.find((guess) => guess.rank === 0)?.word ?? null;
  const myRank = record?.solved ? record.rank : null;
  // 서버 기록(records/me)을 받지 못해 맞혔는지 아직 모름
  const recordFailed = isLogin && recordQuery.isError && !record;

  // 유사도 순위는 서버가 맞혔다고 할 때만 묻는다 (기기 기록만으로 물으면 403)
  const nearestQuery = useQuery({
    queryKey: hangmentleEventKeys.nearest(round, nearestCount),
    queryFn: () => fetchHangmentleNearest(round, nearestCount),
    enabled: isLogin && record?.solved === true && phase === 'open',
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    retry: (failureCount, error) => !isNotSolvedError(error) && failureCount < 1,
  });
  // 서버가 아직 안 맞혔다고(403 GAME-403) 하면 내 기록을 다시 받아 맞힌 상태를 서버에 맞춘다
  const nearestError = nearestQuery.error;
  useEffect(() => {
    if (isNotSolvedError(nearestError)) {
      queryClient.invalidateQueries({ queryKey: hangmentleEventKeys.myRecord(round) });
    }
  }, [nearestError, queryClient, round]);

  useEffect(() => {
    saveProgress(storageKey, localProgress);
  }, [storageKey, localProgress]);

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
      // 서버가 아직 안 열렸다거나 준비 중이라고 하면 회차 정보를 다시 받아 화면을 맞춘다 (입력하던 단어는 draft에 남는다)
      if (kind === 'notOpen' || kind === 'notReady') {
        queryClient.invalidateQueries({ queryKey: hangmentleEventKeys.round(round) });
      }
      return {
        kind: 'error',
        message: guessErrorText(kind, isEng, error instanceof ApiError ? error.message : undefined),
      };
    }
  };

  const ranking = (
    <HangmentleRanking round={round} label={label} myRank={myRank} live={phase === 'open'} />
  );
  const cardLabel = `EVENT ${String(round).padStart(2, '0')} · ${title}`;
  const loginCard = !isLogin && <LoginCard round={round} />;

  const retryButton = (text: string) => (
    <button type="button" onClick={() => refetchInfo()} className={`${SECONDARY_BUTTON} mt-4`}>
      {text}
    </button>
  );

  // 처음 받는 중이거나 처음부터 받지 못했을 때만 이 화면. 받아 둔 정보가 있으면 다시 받기에 실패해도 아래에서 그대로 보여 준다
  if (!info) {
    if (!infoQuery.isError) {
      return (
        <>
          <StatusCard
            label={cardLabel}
            title={isEng ? 'Loading the puzzle…' : '문제를 불러오는 중이에요…'}
          />
          {ranking}
        </>
      );
    }
    const notFound = classifyRoundError(infoQuery.error) === 'notFound';
    return (
      <>
        <StatusCard
          label={cardLabel}
          title={
            notFound
              ? isEng
                ? 'This round does not exist.'
                : '없는 문제예요'
              : isEng
                ? 'Could not load the puzzle.'
                : '문제를 불러오지 못했어요'
          }
        >
          {notFound ? (
            <button type="button" onClick={onShowHub} className={`${SECONDARY_BUTTON} mt-4`}>
              {isEng ? 'Back to the event page' : '이벤트 안내로 가기'}
            </button>
          ) : (
            retryButton(isEng ? 'Try Again' : '다시 시도')
          )}
        </StatusCard>
        {!notFound && ranking}
      </>
    );
  }

  // 여기부터 info가 있다
  const loaded = info;
  // 받아 둔 정보로 계속 보여 주는 중에 다시 받기가 실패함 (열리기 전에는 원래 간격대로 다시 묻는다)
  const unstableNote = infoQuery.isError && <UnstableNote isEng={isEng} />;

  if (phase === 'countdown' && opensAtMs !== null) {
    return (
      <>
        {unstableNote}
        <section className={`${GAME_CARD} text-center`}>
          <p className="font-typewriter text-[12px] leading-4 opacity-60">{cardLabel}</p>
          <p className="pt-4 font-body-kr text-[14px] font-semibold leading-5 opacity-70">
            {isEng ? 'Starts in' : '시작까지'}
          </p>
          <p className="pt-1">
            <CountdownText
              targetMs={opensAtMs}
              compactDays
              className="font-condensed text-[52px] font-bold leading-[60px] tracking-[-0.5px]"
            />
          </p>
          <p className="pt-1 font-body-kr text-[14px] leading-5 opacity-70">
            {isEng
              ? `Opens ${formatOpensAt(opensAtMs, true)}`
              : `${formatOpensAt(opensAtMs, false)}에 열려요`}
          </p>
          <p className="mt-4 border-t border-dashed border-ink/50 pt-4 font-body-kr text-[13px] leading-5 opacity-70">
            {isEng
              ? 'Keep this page open — it turns into the puzzle the moment it opens.'
              : '이 화면을 켜 두면 시간이 되는 순간 바로 문제로 바뀌어요.'}
          </p>
        </section>
        {loginCard}
        {ranking}
      </>
    );
  }

  if (phase === 'opening') {
    // 기기 시계로는 열릴 시각이 지났는데 서버는 아직 닫혀 있다고 함 → 잠깐 기다리며 1초마다 다시 묻는다
    const waitedLong = opensAtMs !== null && now >= opensAtMs + OPENING_FAST_RETRY_MS;
    return (
      <>
        {unstableNote}
        <StatusCard label={cardLabel} title={isEng ? 'Opening soon…' : '곧 열려요'}>
          <StatusNote>
            {isEng
              ? 'Hang on a moment. The puzzle appears as soon as it opens.'
              : '잠시만 기다려 주세요. 열리면 바로 문제가 나와요.'}
          </StatusNote>
          {waitedLong && retryButton(isEng ? 'Check Again' : '다시 확인')}
        </StatusCard>
        {loginCard}
        {ranking}
      </>
    );
  }

  if (phase === 'notReady' || !loaded.hints) {
    return (
      <>
        {unstableNote}
        <StatusCard
          label={cardLabel}
          title={isEng ? 'The puzzle is being prepared' : '문제를 준비하고 있어요'}
        >
          <StatusNote>
            {isEng ? 'Please check again in a moment.' : '잠시 후 다시 확인해 주세요.'}
          </StatusNote>
          {retryButton(isEng ? 'Check Again' : '다시 확인')}
        </StatusCard>
        {ranking}
      </>
    );
  }

  if (phase === 'closed') {
    return (
      <>
        {unstableNote}
        <StatusCard label={cardLabel} title={isEng ? 'Not open yet' : '아직 열리지 않은 문제예요'} />
        {loginCard}
        {ranking}
      </>
    );
  }

  // 화면에는 회차마다 늘린 점수를 보여 준다 (연습 문제와 같은 방식, 순서는 원래 유사도와 같음)
  const { hints } = loaded;
  const toScore = createScoreScale(hints.first, hints.tenth, hints.thousandth);
  const showScore = (similarity: number) => formatSimilarity(toScore(similarity));

  if (!isLogin) {
    return (
      <>
        {unstableNote}
        <HintCard label={cardLabel} hints={hints} showScore={showScore} />
        {loginCard}
        {ranking}
      </>
    );
  }

  return (
    <>
      {unstableNote}
      <HangmentleBoard
        label={cardLabel}
        hints={hints}
        showScore={showScore}
        guesses={progress.guesses}
        solved={solved}
        onGuess={handleGuess}
        initialInput={draft}
        onInputChange={setDraft}
        solvedCard={
          <section className="rounded-[16px] border-2 border-ink bg-rust p-5 text-center text-paper shadow-[5px_5px_0px_0px_var(--color-ink)]">
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
          // 서버 기록을 받기 전에는 순위를 묻지 않으므로 기록을 못 받았으면 그쪽을 다시 받는다
          loading={!recordFailed && (nearestQuery.isPending || nearestQuery.isPlaceholderData)}
          error={recordFailed || nearestQuery.isError}
          onRetry={() => (recordFailed ? recordQuery.refetch() : nearestQuery.refetch())}
        />
      )}

      {solved && progress.guesses.length > 0 && (
        <GuessListCard guesses={progress.guesses} showScore={showScore} />
      )}
    </>
  );
};

export default HangmentleEvent;
