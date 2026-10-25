// 항멘틀 이벤트 회차: 정답은 서버만 알고, 채점·기록·랭킹도 서버가 한다.
// 이 파일에는 화면에서 쓰는 순수 도우미만 둔다 (정답 단어는 프론트 어디에도 두지 않는다)
import { ApiError } from '@/lib/apiClient';
import type { HangmentleGuessResponse, HangmentleMyRecord } from '@/lib/api/hangmentle';
import type { HangmentleProgress } from '@/lib/hangmentleProgress';
import type { HangmentleGuess } from './hangmentleData';

export interface HangmentleEventRound {
  round: number;
  label: string;
  labelEn: string;
}

export const HANGMENTLE_EVENT_ROUNDS: HangmentleEventRound[] = [
  { round: 1, label: '10시', labelEn: '10:00' },
  { round: 2, label: '11시', labelEn: '11:00' },
];

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

export type GuessErrorKind = 'notOpen' | 'auth' | 'network' | 'server';

// 추측을 보내다 난 오류의 종류. 서버가 답하지 못한 경우(fetch 실패)는 연결 문제로 본다
export const classifyGuessError = (error: unknown): GuessErrorKind => {
  if (!(error instanceof ApiError)) return 'network';
  if (error.status === 401) return 'auth';
  // 아직 열리지 않은 회차는 403 또는 409 (GAME-*)
  if (error.status === 403 || error.status === 409) return 'notOpen';
  return 'server';
};

export const guessErrorText = (kind: GuessErrorKind, isEng: boolean) => {
  switch (kind) {
    case 'notOpen':
      return isEng ? 'This round is not open yet.' : '아직 열리지 않은 문제예요';
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
