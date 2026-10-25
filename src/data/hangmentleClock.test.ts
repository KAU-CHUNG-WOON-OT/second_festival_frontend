import { describe, expect, it } from 'vitest';
import {
  CLOCK_SAMPLE_MAX_AGE_MS,
  clockSample,
  countdownParts,
  formatCountdown,
  formatOpensAt,
  parseServerTime,
  pickClockSample,
  type ClockSample,
} from './hangmentleClock';

describe('parseServerTime', () => {
  it('오프셋 없는 서버 시각은 서울(+09:00)로 읽는다', () => {
    expect(parseServerTime('2026-10-28T22:00:00')).toBe(Date.parse('2026-10-28T13:00:00Z'));
    expect(parseServerTime('2026-10-28T22:00')).toBe(Date.parse('2026-10-28T13:00:00Z'));
    // 자정을 넘기는 날짜도
    expect(parseServerTime('2026-10-29T08:30:00')).toBe(Date.parse('2026-10-28T23:30:00Z'));
  });

  it('소수 초는 ms까지 (자릿수와 상관없이)', () => {
    expect(parseServerTime('2026-10-28T21:59:55.123')).toBe(Date.parse('2026-10-28T12:59:55.123Z'));
    expect(parseServerTime('2026-10-28T21:59:55.5')).toBe(Date.parse('2026-10-28T12:59:55.500Z'));
    expect(parseServerTime('2026-10-28T21:59:55.123456789')).toBe(
      Date.parse('2026-10-28T12:59:55.123Z'),
    );
  });

  it('오프셋이 있으면 그대로 따른다', () => {
    expect(parseServerTime('2026-10-28T13:00:00Z')).toBe(Date.parse('2026-10-28T13:00:00Z'));
    expect(parseServerTime('2026-10-28T22:00:00+09:00')).toBe(Date.parse('2026-10-28T13:00:00Z'));
    expect(parseServerTime('2026-10-28T22:00:00+0900')).toBe(Date.parse('2026-10-28T13:00:00Z'));
    expect(parseServerTime('2026-10-28T08:00:00-05:00')).toBe(Date.parse('2026-10-28T13:00:00Z'));
  });

  it('비었거나 읽을 수 없으면 null', () => {
    expect(parseServerTime(null)).toBeNull();
    expect(parseServerTime(undefined)).toBeNull();
    expect(parseServerTime('')).toBeNull();
    expect(parseServerTime('내일 밤')).toBeNull();
  });
});

describe('clockSample', () => {
  it('받은 순간의 서버 시각 = serverTime + 왕복 시간의 절반', () => {
    // 1000에 보내 1200에 받음(왕복 200ms), 서버가 적은 시각 5100 → 받은 순간 서버는 5200
    // 그때 기기 시계(Date.now)가 1_000_000이면 오프셋은 5200 - 1_000_000
    const sample = clockSample(5100, 1000, 1200, 1_000_000);
    expect(sample.rtt).toBe(200);
    expect(sample.offset).toBe(5200 - 1_000_000);
    expect(1_000_000 + sample.offset).toBe(5200);
  });

  it('기기 시계가 10분 느려도 서버 시각을 맞게 계산한다', () => {
    const server = parseServerTime('2026-10-28T21:59:55.000')!;
    const phoneAtReceipt = server - 10 * 60_000 + 40; // 기기 시계가 10분 느림 (+ 왕복 절반 40ms)
    const sample = clockSample(server, 0, 80, phoneAtReceipt);
    expect(phoneAtReceipt + sample.offset).toBe(server + 40);
    // 5초 뒤(기기 시계 기준) 서버 시각은 열리는 시각 + 40ms
    expect(phoneAtReceipt + 4960 + sample.offset).toBe(parseServerTime('2026-10-28T22:00:00'));
  });

  it('시계가 뒤로 가 왕복 시간이 음수가 되면 0으로 본다', () => {
    expect(clockSample(5000, 1200, 1000, 9000).rtt).toBe(0);
  });
});

describe('pickClockSample', () => {
  const sample = (patch: Partial<ClockSample>): ClockSample => ({
    offset: 0,
    rtt: 100,
    receivedAt: 1_000_000,
    receivedPerf: 10_000,
    ...patch,
  });

  it('표본이 없으면 null', () => {
    expect(pickClockSample([], 1_000_000, 10_000)).toBeNull();
  });

  it('최근 표본 가운데 왕복 시간이 가장 짧은 것', () => {
    const fast = sample({ offset: 11, rtt: 40 });
    const slow = sample({ offset: 99, rtt: 900, receivedAt: 1_030_000, receivedPerf: 40_000 });
    expect(pickClockSample([fast, slow], 1_060_000, 70_000)).toBe(fast);
  });

  it('오래된 표본은 빼고, 모두 오래됐으면 가장 최근 것', () => {
    const old = sample({ offset: 11, rtt: 40 });
    const recent = sample({
      offset: 22,
      rtt: 300,
      receivedAt: 1_000_000 + CLOCK_SAMPLE_MAX_AGE_MS,
      receivedPerf: 10_000 + CLOCK_SAMPLE_MAX_AGE_MS,
    });
    const later = 1_000_000 + CLOCK_SAMPLE_MAX_AGE_MS + 10_000;
    const laterPerf = 10_000 + CLOCK_SAMPLE_MAX_AGE_MS + 10_000;
    expect(pickClockSample([old, recent], later, laterPerf)).toBe(recent);
    expect(pickClockSample([old], later, laterPerf)).toBe(old);
  });

  it('그 사이 기기 시계를 바꾼 표본은 믿지 않는다', () => {
    const beforeJump = sample({ offset: 11, rtt: 40 });
    const afterJump = sample({
      offset: -3_600_000 + 11,
      rtt: 200,
      receivedAt: 1_000_000 + 3_600_000 + 20_000,
      receivedPerf: 30_000,
    });
    // 단조 시계로는 30초가 지났는데 기기 시계는 1시간 30초가 지남 → 앞 표본은 버린다
    expect(pickClockSample([beforeJump, afterJump], 1_000_000 + 3_600_000 + 30_000, 40_000)).toBe(
      afterJump,
    );
  });
});

describe('countdownParts · formatCountdown', () => {
  it('초는 올림이라 0.2초 남았으면 1초, 0이 되는 순간 00:00:00', () => {
    expect(formatCountdown(200, false)).toBe('00:00:01');
    expect(formatCountdown(1000, false)).toBe('00:00:01');
    expect(formatCountdown(1001, false)).toBe('00:00:02');
    expect(formatCountdown(0, false)).toBe('00:00:00');
    expect(formatCountdown(-5000, false)).toBe('00:00:00');
  });

  it('시:분:초', () => {
    expect(formatCountdown((1 * 3600 + 2 * 60 + 3) * 1000, false)).toBe('01:02:03');
    expect(formatCountdown(5000, false)).toBe('00:00:05');
  });

  it('24시간 넘게 남으면 날짜 수를 붙인다', () => {
    const day = 86_400_000;
    expect(formatCountdown(day - 1000, false)).toBe('23:59:59');
    expect(formatCountdown(day, false)).toBe('1일 00:00:00');
    expect(formatCountdown(3 * day + 4 * 3600_000 + 5000, false)).toBe('3일 04:00:05');
    expect(formatCountdown(3 * day + 4 * 3600_000 + 5000, true)).toBe('3d 04:00:05');
    expect(countdownParts(2 * day + 61_000)).toEqual({
      days: 2,
      hours: 0,
      minutes: 1,
      seconds: 1,
    });
  });
});

describe('formatOpensAt', () => {
  it('서울 기준 날짜·시각 (기기 시간대와 상관없이)', () => {
    expect(formatOpensAt(parseServerTime('2026-10-28T22:00:00')!, false)).toBe('10월 28일 밤 10시');
    expect(formatOpensAt(parseServerTime('2026-10-28T23:00:00')!, false)).toBe('10월 28일 밤 11시');
    expect(formatOpensAt(parseServerTime('2026-10-28T09:30:00')!, false)).toBe(
      '10월 28일 오전 9시 30분',
    );
    expect(formatOpensAt(parseServerTime('2026-10-29T00:00:00')!, false)).toBe('10월 29일 밤 12시');
    expect(formatOpensAt(parseServerTime('2026-10-29T01:00:00')!, false)).toBe('10월 29일 새벽 1시');
    expect(formatOpensAt(parseServerTime('2026-10-28T22:00:00')!, true)).toBe('Oct 28, 10:00 PM');
  });
});
