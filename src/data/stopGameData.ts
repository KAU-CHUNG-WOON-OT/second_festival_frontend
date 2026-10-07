export const STOP_TARGET_MS = 10000;
// 이 시간이 지나면 화면의 시간을 가린다
export const STOP_BLIND_AFTER_MS = 3000;
export const STOP_MIN_PLAYERS = 2;
export const STOP_MAX_PLAYERS = 10;

export interface StopResult {
  // 0부터 시작하는 플레이어 번호
  player: number;
  elapsedMs: number;
}

export interface RankedStopResult extends StopResult {
  diffMs: number;
}

// 10초에 가까운 순. 차이가 같으면 먼저 한 사람이 앞선다(sort는 안정 정렬).
export const rankStopResults = (results: StopResult[]): RankedStopResult[] =>
  results
    .map((result) => ({ ...result, diffMs: Math.abs(result.elapsedMs - STOP_TARGET_MS) }))
    .sort((a, b) => a.diffMs - b.diffMs);

export const formatStopTime = (ms: number) => (Math.floor(ms / 10) / 100).toFixed(2);
