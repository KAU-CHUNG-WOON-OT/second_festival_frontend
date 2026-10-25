import { beforeEach, describe, expect, it } from 'vitest';
import {
  ADMIN_TAP_COUNT,
  ADMIN_TAP_WINDOW_MS,
  countAdminTap,
  registerAdminLogoTap,
  resetAdminLogoTaps,
} from './adminTap';

// 시각 목록대로 차례로 눌러 몇 번째 탭에서 열렸는지 (안 열리면 빈 배열)
const tapAt = (times: number[]) => {
  const opened: number[] = [];
  times.forEach((t, i) => {
    if (registerAdminLogoTap(t)) opened.push(i + 1);
  });
  return opened;
};

describe('countAdminTap', () => {
  it('3초 안에 7번 누르면 7번째 탭에서 열리고 기록을 비운다', () => {
    let taps: number[] = [];
    for (let i = 0; i < ADMIN_TAP_COUNT - 1; i += 1) {
      const result = countAdminTap(taps, 1000 + i * 300);
      expect(result.triggered).toBe(false);
      taps = result.taps;
    }
    const last = countAdminTap(taps, 1000 + 6 * 300);
    expect(last).toEqual({ taps: [], triggered: true });
  });

  it('첫 탭과 마지막 탭이 딱 3초 차이면 연다', () => {
    let taps: number[] = [];
    const step = ADMIN_TAP_WINDOW_MS / (ADMIN_TAP_COUNT - 1);
    let triggered = false;
    for (let i = 0; i < ADMIN_TAP_COUNT; i += 1) {
      const result = countAdminTap(taps, i * step);
      taps = result.taps;
      triggered = result.triggered;
    }
    expect(triggered).toBe(true);
  });

  it('3초보다 앞선 탭은 버린다', () => {
    const result = countAdminTap([0, 100, 3500], 3600);
    expect(result).toEqual({ taps: [3500, 3600], triggered: false });
  });

  it('앞으로 간 시각(시계 이상)은 세지 않는다', () => {
    expect(countAdminTap([9999], 100).taps).toEqual([100]);
  });
});

describe('registerAdminLogoTap', () => {
  beforeEach(() => resetAdminLogoTaps());

  it('빠르게 7번이면 열린다 (첫 탭은 다른 화면 로고, 나머지는 홈 로고여도 같은 기록)', () => {
    expect(tapAt([0, 250, 500, 750, 1000, 1250, 1500])).toEqual([7]);
  });

  it('6번만 누르면 열리지 않는다', () => {
    expect(tapAt([0, 200, 400, 600, 800, 1000])).toEqual([]);
  });

  it('천천히 누르면 끝없이 눌러도 열리지 않는다', () => {
    const slow = Array.from({ length: 30 }, (_, i) => i * 600);
    expect(tapAt(slow)).toEqual([]);
  });

  it('잠깐 멈췄다 다시 누르면 처음부터 센다', () => {
    // 5번 누르고 4초 쉰 뒤 2번 → 7번이지만 3초 안이 아니다
    expect(tapAt([0, 200, 400, 600, 800, 4800, 5000])).toEqual([]);
  });

  it('열린 뒤에는 다시 7번을 눌러야 한다', () => {
    const fast = (start: number) => Array.from({ length: 7 }, (_, i) => start + i * 200);
    expect(tapAt([...fast(0), ...fast(1400 + 200)])).toEqual([7, 14]);
    resetAdminLogoTaps();
    expect(tapAt([...fast(0), 1500, 1700])).toEqual([7]);
  });
});
