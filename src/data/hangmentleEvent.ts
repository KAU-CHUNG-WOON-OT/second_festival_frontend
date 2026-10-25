// 항멘틀 이벤트 회차: 정답은 서버만 알고, 채점·기록·랭킹도 서버가 한다.
// 이 파일에는 화면에서 쓰는 순수 도우미만 둔다 (정답 단어는 프론트 어디에도 두지 않는다)
import { ApiError } from '@/lib/apiClient';
import type {
  HangmentleGuessResponse,
  HangmentleMyRecord,
  HangmentleRoundInfo,
  HangmentleRoundsOverview,
} from '@/lib/api/hangmentle';
import type { HangmentleProgress } from '@/lib/hangmentleProgress';
import type { HangmentleGuess } from './hangmentleData';
import { parseServerTime } from './hangmentleClock';

export interface HangmentleEventRound {
  round: number;
  // 랭킹 제목 등에 붙는 짧은 이름 (10시)
  label: string;
  labelEn: string;
  // 카드 제목 (10시 문제)
  title: string;
  titleEn: string;
  // 안내에 쓰는 예정 시각 (서울). 실제로 열리는 시각은 서버의 opensAt을 따른다
  scheduledAt: string;
}

export const HANGMENTLE_EVENT_ROUNDS: HangmentleEventRound[] = [
  {
    round: 1,
    label: '10시',
    labelEn: '10 PM',
    title: '10시 문제',
    titleEn: '10 PM Puzzle',
    scheduledAt: '2026-10-28T22:00:00',
  },
  {
    round: 2,
    label: '11시',
    labelEn: '11 PM',
    title: '11시 문제',
    titleEn: '11 PM Puzzle',
    scheduledAt: '2026-10-28T23:00:00',
  },
];

// 실제 이벤트 전에 흐름을 시험해 보는 숨은 회차 (정답은 서버에만). 첫 화면 카드·자동 이동에는 넣지 않고
// 주소(/game/hangmentle?round=9)로만 들어간다. 이벤트 전에 백엔드 9회차와 함께 지운다
export const HANGMENTLE_TEST_ROUND: HangmentleEventRound = {
  round: 9,
  label: '테스트',
  labelEn: 'Test',
  title: '테스트 문제',
  titleEn: 'Test Puzzle',
  scheduledAt: '2026-10-25T00:00:00',
};

export const findEventRound = (round: number) =>
  HANGMENTLE_EVENT_ROUNDS.find((event) => event.round === round) ??
  (round === HANGMENTLE_TEST_ROUND.round ? HANGMENTLE_TEST_ROUND : null);

// 랭킹에 오르는 사람 수 (이 안이면 'n등', 밖이면 'n번째')
export const HANGMENTLE_RANKING_SIZE = 10;

const OFFSET_PATTERN = /(Z|[+-]\d{2}:?\d{2})$/i;
const CLOCK_PATTERN = /T(\d{2}):(\d{2})(?::(\d{2}))?/;
const SEOUL_CLOCK = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Seoul',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

// 서버 시각을 서울 기준 'HH:mm:ss'(withSeconds가 false면 'HH:mm')로.
// 오프셋이 없는 값(LocalDateTime)은 이미 서울 시각이라 그대로 읽고, 오프셋이 있으면 서울로 바꾼다
export const formatKstTime = (iso: string, withSeconds = true): string => {
  let clock: [string, string, string] | null = null;
  const match = CLOCK_PATTERN.exec(iso);
  if (match && !OFFSET_PATTERN.test(iso)) {
    clock = [match[1], match[2], match[3] ?? '00'];
  } else {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const parts = SEOUL_CLOCK.formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value ?? '00';
    clock = [part('hour'), part('minute'), part('second')];
  }
  return withSeconds ? clock.join(':') : `${clock[0]}:${clock[1]}`;
};

const ordinal = (n: number) => {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`;
};

// 몇 번째로 맞혔는지. 랭킹 안이면 '3등으로', 밖이면 '15번째로'
export const solveRankText = (rank: number, isEng: boolean) => {
  if (rank <= HANGMENTLE_RANKING_SIZE) {
    return isEng ? `You placed ${ordinal(rank)}!` : `${rank}등으로 맞혔어요!`;
  }
  return isEng ? `You were the ${ordinal(rank)} to solve it` : `${rank}번째로 맞혔어요`;
};

// 서버 채점 결과를 추측 목록 한 줄로. 모르는 단어면 null
export const guessFromResponse = (
  res: HangmentleGuessResponse,
  order: number,
): HangmentleGuess | null => {
  if (!res.known || (res.similarity === null && !res.correct)) return null;
  return {
    word: res.word,
    similarity: res.correct ? 10000 : (res.similarity ?? 0),
    rank: res.correct ? 0 : res.similarityRank,
    order,
  };
};

export type GuessErrorKind =
  | 'notOpen'
  | 'tooMany'
  | 'invalid'
  | 'notReady'
  | 'notFound'
  | 'auth'
  | 'network'
  | 'server';

const hasCode = (error: ApiError, status: number, code: string) =>
  error.status === status && error.code === code;

// 추측을 보내다 난 오류의 종류. 서버가 답하지 못한 경우(fetch 실패)는 연결 문제로 본다.
// '아직 안 열림'은 409 GAME-409일 때만 (다른 409·403을 열리지 않은 문제로 착각하지 않게)
export const classifyGuessError = (error: unknown): GuessErrorKind => {
  if (!(error instanceof ApiError)) return 'network';
  if (error.status === 401) return 'auth';
  if (hasCode(error, 409, 'GAME-409')) return 'notOpen';
  if (error.status === 429) return 'tooMany';
  // 50자를 넘는 단어 등 서버가 받지 않는 입력
  if (error.status === 400) return 'invalid';
  if (hasCode(error, 503, 'GAME-503')) return 'notReady';
  if (hasCode(error, 404, 'GAME-404')) return 'notFound';
  return 'server';
};

// 오류 안내 문구. 너무 많이 추측했을 때(429)는 서버가 보낸 문구를 그대로 보여 준다
export const guessErrorText = (kind: GuessErrorKind, isEng: boolean, serverMessage?: string) => {
  switch (kind) {
    case 'notOpen':
      return isEng ? 'This round is not open yet.' : '아직 열리지 않은 문제예요';
    case 'tooMany':
      if (isEng) return 'Too many guesses. Please wait a moment and try again.';
      return serverMessage?.trim() || '너무 빨리 추측하고 있어요. 잠시 후 다시 시도해 주세요';
    case 'invalid':
      return isEng
        ? 'Please check the word (up to 50 characters).'
        : '단어를 확인해 주세요 (50자까지 입력할 수 있어요)';
    case 'notReady':
      return isEng
        ? 'The puzzle is being prepared. Please try again shortly.'
        : '문제를 준비하고 있어요. 잠시 후 다시 시도해 주세요';
    case 'notFound':
      return isEng ? 'This round does not exist.' : '없는 문제예요';
    case 'auth':
      return isEng ? 'Please log in again.' : '로그인이 풀렸어요. 다시 로그인해 주세요';
    case 'network':
      return isEng
        ? 'Connection problem. Please try again.'
        : '연결이 불안정해요. 다시 시도해 주세요';
    default:
      return isEng ? 'Something went wrong. Please try again.' : '잠시 후 다시 시도해 주세요';
  }
};

// 회차 정보를 못 불러온 이유. 404 GAME-404일 때만 '없는 문제', 나머지는 다시 시도할 수 있다
export const classifyRoundError = (error: unknown): 'notFound' | 'failed' =>
  error instanceof ApiError && hasCode(error, 404, 'GAME-404') ? 'notFound' : 'failed';

// 유사도 순위(nearest)를 서버가 '아직 맞히지 않음'(403 GAME-403)으로 거절했는지. 다시 물어도 같으므로 재시도하지 않는다
export const isNotSolvedError = (error: unknown) =>
  error instanceof ApiError && hasCode(error, 403, 'GAME-403');

// 회차 화면 상태
// open: 풀 수 있음 / countdown: 열리기 전 / opening: 열릴 시각이 지났는데 서버는 아직 닫혀 있다고 함(시계 차이) /
// notReady: 문제 데이터를 준비 중(힌트 없음) / closed: 열리는 시각이 정해지지 않음
export type RoundPhase = 'open' | 'countdown' | 'opening' | 'notReady' | 'closed';

export const roundPhase = (
  info: Pick<HangmentleRoundInfo, 'open' | 'opensAt' | 'hints'>,
  nowMs: number,
): RoundPhase => {
  // 열렸는지는 서버 말을 따른다. 시계로는 열리기 전이라도 서버가 열렸다고 하면 연다
  if (info.open) return info.hints ? 'open' : 'notReady';
  const opensAtMs = parseServerTime(info.opensAt);
  if (opensAtMs !== null && nowMs < opensAtMs) return 'countdown';
  // 열릴 시각이 지났는데 힌트가 없으면 '곧 열려요'라고 하지 않는다
  if (!info.hints) return 'notReady';
  return opensAtMs === null ? 'closed' : 'opening';
};

// 열릴 시각이 지났는데 서버가 아직 닫혀 있다고 하면 이 시간 동안은 1초마다 다시 묻는다
export const OPENING_FAST_RETRY_MS = 8_000;
const OPENING_FAST_POLL_MS = 1_000;
const OPENING_SLOW_POLL_MS = 5_000;
const NOT_READY_POLL_MS = 10_000;
// 열리기 전에는 가끔만 다시 묻는다 (0초가 되는 순간에는 따로 바로 묻는다)
const WAITING_POLL_MS = 60_000;

// 회차 정보를 다시 물을 간격 (false면 묻지 않음)
export const roundPollInterval = (
  info: Pick<HangmentleRoundInfo, 'open' | 'opensAt' | 'hints'>,
  nowMs: number,
): number | false => {
  switch (roundPhase(info, nowMs)) {
    case 'open':
      return false;
    case 'opening': {
      const sinceOpen = nowMs - (parseServerTime(info.opensAt) ?? nowMs);
      return sinceOpen < OPENING_FAST_RETRY_MS ? OPENING_FAST_POLL_MS : OPENING_SLOW_POLL_MS;
    }
    case 'notReady':
      return NOT_READY_POLL_MS;
    default:
      return WAITING_POLL_MS;
  }
};

export interface RoundPhaseEntry {
  round: number;
  // 아직 모르면 null (불러오는 중·실패)
  phase: RoundPhase | null;
}

// 이 화면을 보는 동안 '열리기 전'으로 본 회차를 기억한다. 바뀐 게 없으면 같은 배열을 돌려준다
export const watchClosedRounds = (watched: readonly number[], phases: readonly RoundPhaseEntry[]) => {
  const added = phases
    .filter((entry) => entry.phase === 'countdown' && !watched.includes(entry.round))
    .map((entry) => entry.round);
  return added.length > 0 ? [...watched, ...added] : watched;
};

// 열리기 전으로 봤던 회차 가운데 지금 열린(열릴 시각이 지난) 회차. 여럿이면 나중 회차
export const openedWhileWatching = (
  watched: readonly number[],
  phases: readonly RoundPhaseEntry[],
  ignore: readonly number[] = [],
): number | null => {
  const opened = phases.filter(
    (entry) =>
      watched.includes(entry.round) &&
      !ignore.includes(entry.round) &&
      entry.phase !== null &&
      entry.phase !== 'countdown' &&
      entry.phase !== 'closed',
  );
  return opened.length > 0 ? opened[opened.length - 1].round : null;
};

// 기기에 남은 기록과 서버 기록을 합친다. 서버가 아직 안 맞혔다고 하는데 기기에는 맞힌 기록이 있으면
// (같은 기기에서 다른 계정으로 풀었던 기록) 기기 기록을 버리고 처음부터 풀게 한다
export const resolveEventProgress = (
  local: HangmentleProgress,
  record: HangmentleMyRecord | undefined,
): HangmentleProgress => {
  if (record && !record.solved && local.status === 'solved') {
    return { guesses: [], status: 'playing' };
  }
  return record?.solved ? { ...local, status: 'solved' } : local;
};

// 연습 화면은 평소 이벤트 API를 부르지 않는다. 회차가 열리기 이만큼 전부터 서버가 열렸다고 할 때까지만 회차 요약을 받는다
export const PRACTICE_SYNC_LEAD_MS = 5 * 60_000;

export interface PracticeSyncRound {
  // 열리는 시각. 서버 요약이 없거나 비어 있으면 예정 시각
  opensAtMs: number | null;
  // 서버가 열렸다고 했는지 (요약을 받기 전에는 false)
  open: boolean;
}

export const practiceSyncRounds = (
  overview: Pick<HangmentleRoundsOverview, 'rounds'> | undefined,
): PracticeSyncRound[] =>
  HANGMENTLE_EVENT_ROUNDS.map((event) => {
    const info = overview?.rounds.find((round) => round.round === event.round);
    return {
      opensAtMs: parseServerTime(info?.opensAt ?? event.scheduledAt),
      open: info?.open ?? false,
    };
  });

// 연습 화면이 회차 요약을 받기 시작하는 시각들 (아직 열리지 않은 회차의 열리기 5분 전)
export const practiceSyncStarts = (rounds: readonly PracticeSyncRound[]): number[] =>
  rounds.flatMap((round) =>
    !round.open && round.opensAtMs !== null ? [round.opensAtMs - PRACTICE_SYNC_LEAD_MS] : [],
  );

// 연습 화면에서 지금 회차 요약을 받아야 하는지. 서버 시계를 맞추기 전이므로 기기 시계(Date.now)로 정한다
export const isPracticeSyncWindow = (rounds: readonly PracticeSyncRound[], deviceNowMs: number) =>
  practiceSyncStarts(rounds).some((start) => deviceNowMs >= start);
