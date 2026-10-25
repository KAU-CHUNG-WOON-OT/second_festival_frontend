import { describe, expect, it } from 'vitest';
import {
  CONGESTION_INFO,
  CONGESTION_LEVELS,
  congestionDescription,
  congestionLabel,
  congestionOf,
  congestionStep,
  formatSeoulClock,
  formatUpdatedAgo,
  parseCongestionLevel,
  patchStoreCongestion,
  type StoreCongestionOverview,
} from './storeCongestion';
import { parseServerTime } from './hangmentleClock';

describe('혼잡도 단계', () => {
  it('서버 enum 문자열과 한국어·영어 이름이 맞다', () => {
    expect(CONGESTION_LEVELS.map((level) => congestionLabel(level, false))).toEqual([
      '여유',
      '보통',
      '혼잡',
      '만석',
    ]);
    expect(CONGESTION_LEVELS.map((level) => congestionLabel(level, true))).toEqual([
      'Relaxed',
      'Normal',
      'Busy',
      'Full',
    ]);
  });

  it('단계마다 설명과 색이 있고, 색은 토큰만 쓴다', () => {
    const colors = {
      RELAXED: 'bg-olive',
      NORMAL: 'bg-mustard',
      BUSY: 'bg-rust',
      FULL: 'bg-ink',
    };
    for (const level of CONGESTION_LEVELS) {
      expect(congestionDescription(level, false).trim(), level).not.toBe('');
      expect(congestionDescription(level, true).trim(), level).not.toBe('');
      expect(CONGESTION_INFO[level].colorClass.split(' ')[0]).toBe(colors[level]);
      expect(CONGESTION_INFO[level].colorClass).not.toMatch(/#|\[/);
    }
  });

  it('여유 1 → 만석 4', () => {
    expect(CONGESTION_LEVELS.map(congestionStep)).toEqual([1, 2, 3, 4]);
  });

  it('모르는 값·null은 현황 없음(null)', () => {
    expect(parseCongestionLevel('BUSY')).toBe('BUSY');
    expect(parseCongestionLevel('busy')).toBeNull();
    expect(parseCongestionLevel('CLOSED')).toBeNull();
    expect(parseCongestionLevel(null)).toBeNull();
    expect(parseCongestionLevel(undefined)).toBeNull();
    expect(parseCongestionLevel(3)).toBeNull();
  });
});

describe('formatUpdatedAgo', () => {
  const updated = parseServerTime('2026-10-28T21:00:00')!;
  const at = (iso: string) => parseServerTime(iso)!;

  it('1분 안이면 방금', () => {
    expect(formatUpdatedAgo(updated, at('2026-10-28T21:00:59'), false)).toBe('방금 업데이트');
    expect(formatUpdatedAgo(updated, at('2026-10-28T21:00:59'), true)).toBe('Updated just now');
  });

  it('분·시간·일 단위 (내림)', () => {
    expect(formatUpdatedAgo(updated, at('2026-10-28T21:03:10'), false)).toBe('3분 전 업데이트');
    expect(formatUpdatedAgo(updated, at('2026-10-28T21:03:10'), true)).toBe('Updated 3 min ago');
    expect(formatUpdatedAgo(updated, at('2026-10-28T21:59:59'), false)).toBe('59분 전 업데이트');
    expect(formatUpdatedAgo(updated, at('2026-10-28T23:30:00'), false)).toBe('2시간 전 업데이트');
    expect(formatUpdatedAgo(updated, at('2026-10-28T23:30:00'), true)).toBe('Updated 2 hr ago');
    expect(formatUpdatedAgo(updated, at('2026-10-29T21:00:00'), false)).toBe('1일 전 업데이트');
    expect(formatUpdatedAgo(updated, at('2026-10-29T21:00:00'), true)).toBe('Updated 1 day ago');
    expect(formatUpdatedAgo(updated, at('2026-10-31T21:00:00'), true)).toBe('Updated 3 days ago');
  });

  it('서버 시계보다 앞선 시각(미래)이면 방금으로', () => {
    expect(formatUpdatedAgo(updated, at('2026-10-28T20:58:00'), false)).toBe('방금 업데이트');
  });

  it('서울 시각으로 HH:MM', () => {
    expect(formatSeoulClock(updated)).toBe('21:00');
    expect(formatSeoulClock(parseServerTime('2026-10-29T00:05:00+09:00')!)).toBe('00:05');
  });
});

describe('가게별 값 고르기·바꾸기', () => {
  const overview: StoreCongestionOverview = {
    serverTime: '2026-10-28T21:00:00',
    stores: [
      { storeId: 401, level: 'BUSY', updatedAt: '2026-10-28T20:50:00' },
      { storeId: 402, level: null, updatedAt: null },
    ],
  };

  it('가게 id로 찾는다 (없으면 null)', () => {
    expect(congestionOf(overview, 401)?.level).toBe('BUSY');
    expect(congestionOf(overview, 999)).toBeNull();
    expect(congestionOf(undefined, 401)).toBeNull();
  });

  it('한 가게 값만 바꾸고 나머지는 그대로 (원본은 건드리지 않음)', () => {
    const next = patchStoreCongestion(overview, { storeId: 402, level: 'FULL', updatedAt: null });
    expect(next?.stores).toEqual([
      overview.stores[0],
      { storeId: 402, level: 'FULL', updatedAt: null },
    ]);
    expect(overview.stores[1].level).toBeNull();
  });

  it('목록에 없던 가게는 뒤에 붙이고, 목록이 없으면 그대로', () => {
    const next = patchStoreCongestion(overview, {
      storeId: 403,
      level: 'RELAXED',
      updatedAt: null,
    });
    expect(next?.stores.map((s) => s.storeId)).toEqual([401, 402, 403]);
    expect(patchStoreCongestion(undefined, overview.stores[0])).toBeUndefined();
  });
});
