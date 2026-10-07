import { describe, expect, it } from 'vitest';
import { formatStopTime, rankStopResults } from './stopGameData';

describe('rankStopResults', () => {
  it('10초에 가까운 순서로 줄 세우고, 마지막 사람이 벌칙이다', () => {
    const ranked = rankStopResults([
      { player: 0, elapsedMs: 11200 },
      { player: 1, elapsedMs: 9950 },
      { player: 2, elapsedMs: 8000 },
    ]);
    expect(ranked.map((r) => r.player)).toEqual([1, 0, 2]);
    expect(ranked.map((r) => r.diffMs)).toEqual([50, 1200, 2000]);
  });

  it('10초보다 빠르든 늦든 차이만 본다', () => {
    const ranked = rankStopResults([
      { player: 0, elapsedMs: 10300 },
      { player: 1, elapsedMs: 9800 },
    ]);
    expect(ranked.map((r) => r.player)).toEqual([1, 0]);
  });

  it('차이가 같으면 먼저 한 사람이 앞선다', () => {
    const ranked = rankStopResults([
      { player: 0, elapsedMs: 10100 },
      { player: 1, elapsedMs: 9900 },
    ]);
    expect(ranked.map((r) => r.player)).toEqual([0, 1]);
  });
});

describe('formatStopTime', () => {
  it('초 단위 소수 둘째 자리까지 보여준다', () => {
    expect(formatStopTime(10000)).toBe('10.00');
    expect(formatStopTime(9876)).toBe('9.87');
    expect(formatStopTime(0)).toBe('0.00');
  });
});
