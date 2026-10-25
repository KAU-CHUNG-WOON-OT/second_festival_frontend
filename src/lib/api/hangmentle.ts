import { apiFetch } from '@/lib/apiClient';
import { withServerTime } from '@/lib/serverClock';

// 항멘틀 이벤트 회차(1 = 10시, 2 = 11시) API. 채점·기록·랭킹은 모두 서버가 한다.
// 유사도는 코사인 유사도 × 10000 정수 (정답은 10000)

export interface HangmentleHints {
  first: number;
  tenth: number;
  thousandth: number;
}

export interface HangmentleRoundInfo {
  round: number;
  open: boolean;
  // 열리는 시각 (서울 기준 ISO 날짜·시간)
  opensAt: string | null;
  // 정답을 뺀 가장 가까운 단어·10번째·1000번째의 유사도. 서버가 문제 데이터를 못 읽었으면 null
  hints: HangmentleHints | null;
  // 응답을 만든 서버 시각 (서울 기준, ms까지). 카운트다운을 서버 시계에 맞추는 데 쓴다
  serverTime?: string;
}

// 모든 회차 요약 (이벤트 안내 카드·시계 맞추기)
export interface HangmentleRoundsOverview {
  serverTime: string;
  rounds: HangmentleRoundInfo[];
}

export interface HangmentleGuessResponse {
  // 서버가 띄어쓰기를 지운 단어
  word: string;
  // false면 단어 목록에 없는 말 (similarity는 null)
  known: boolean;
  similarity: number | null;
  // 정답과 가까운 순위 1~1000, 그 밖이면 null
  similarityRank: number | null;
  correct: boolean;
  // 정답을 맞혔을 때 몇 번째로 맞혔는지 (이미 맞힌 적이 있으면 그때 기록)
  solved: { rank: number; solvedAt: string } | null;
}

export interface HangmentleRankingEntry {
  rank: number;
  // 가운데를 가린 이름 (김*수)
  displayName: string;
  department: string | null;
  solvedAt: string;
}

export interface HangmentleMyRecord {
  solved: boolean;
  rank: number | null;
  solvedAt: string | null;
}

export interface HangmentleNearestWord {
  word: string;
  similarity: number;
  rank: number;
}

// react-query 키. 연습 문제 키(['hangmentle', 'vocab'] 등)와 겹치지 않게 'event' 아래에 둔다
export const hangmentleEventKeys = {
  overview: ['hangmentle', 'event', 'rounds'] as const,
  round: (round: number) => ['hangmentle', 'event', round, 'info'] as const,
  rankings: (round: number) => ['hangmentle', 'event', round, 'rankings'] as const,
  myRecord: (round: number) => ['hangmentle', 'event', round, 'me'] as const,
  nearest: (round: number, limit: number) =>
    ['hangmentle', 'event', round, 'nearest', limit] as const,
};

const ROUNDS_PATH = '/api/game/hangmentle/rounds';
const roundPath = (round: number) => `${ROUNDS_PATH}/${round}`;

// 공개 API는 토큰·쿠키 없이 부른다 (비회원도 보고, 간단한 요청이라 사전 요청도 생기지 않음)
const PUBLIC = { auth: false, credentials: 'omit' } as const;
// 서버 시각을 담은 응답은 캐시된 값을 받으면 시계가 어긋나므로 늘 새로 받는다
const PUBLIC_FRESH = { ...PUBLIC, cache: 'no-store' } as const;

export const fetchHangmentleRounds = (): Promise<HangmentleRoundsOverview> =>
  withServerTime(() => apiFetch<HangmentleRoundsOverview>(ROUNDS_PATH, PUBLIC_FRESH));

export const fetchHangmentleRound = (round: number): Promise<HangmentleRoundInfo> =>
  withServerTime(() => apiFetch<HangmentleRoundInfo>(roundPath(round), PUBLIC_FRESH));

export const postHangmentleGuess = (
  round: number,
  word: string,
): Promise<HangmentleGuessResponse> =>
  apiFetch<HangmentleGuessResponse>(`${roundPath(round)}/guesses`, {
    method: 'POST',
    body: { word },
  });

export const fetchHangmentleRankings = (round: number): Promise<HangmentleRankingEntry[]> =>
  apiFetch<HangmentleRankingEntry[]>(`${roundPath(round)}/rankings`, PUBLIC);

export const fetchMyHangmentleRecord = (round: number): Promise<HangmentleMyRecord> =>
  apiFetch<HangmentleMyRecord>(`${roundPath(round)}/records/me`);

// 정답을 맞힌 사람만 볼 수 있다 (아니면 403)
export const fetchHangmentleNearest = (
  round: number,
  limit: number,
): Promise<HangmentleNearestWord[]> =>
  apiFetch<HangmentleNearestWord[]>(`${roundPath(round)}/nearest?limit=${limit}`);
