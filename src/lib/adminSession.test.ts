import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAdminSession, getAdminSession, readAdminSession, saveAdminSession } from './adminSession';
import { parseServerTime } from '@/data/hangmentleClock';

const KEY = 'cwf_admin_session_v1';
const at = (iso: string) => parseServerTime(iso)!;
const session = { token: 'test-admin-token', expiresAt: '2026-10-28T23:00:00' };

describe('관리자 토큰 보관', () => {
  const sessionStore = new Map<string, string>();
  const localStore = new Map<string, string>();
  const fakeStorage = (store: Map<string, string>) => ({
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  });

  beforeEach(() => {
    sessionStore.clear();
    localStore.clear();
    vi.stubGlobal('window', {
      sessionStorage: fakeStorage(sessionStore),
      localStorage: fakeStorage(localStore),
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sessionStorage에만 넣는다 (localStorage는 쓰지 않음)', () => {
    saveAdminSession(session);
    expect(sessionStore.has(KEY)).toBe(true);
    expect(localStore.size).toBe(0);
    expect(getAdminSession(at('2026-10-28T22:00:00'))).toEqual(session);
  });

  it('만료 시각이 지나면 null이고 지운다', () => {
    saveAdminSession(session);
    expect(getAdminSession(at('2026-10-28T22:59:59'))).toEqual(session);
    expect(getAdminSession(at('2026-10-28T23:00:00'))).toBeNull();
    expect(sessionStore.has(KEY)).toBe(false);
  });

  it('만료돼 지운 경우와 처음부터 없던 경우를 구분한다 (로그인 화면의 만료 안내용)', () => {
    expect(readAdminSession(at('2026-10-28T22:00:00'))).toEqual({ session: null, expiredOnLoad: false });
    saveAdminSession(session);
    expect(readAdminSession(at('2026-10-28T22:00:00'))).toEqual({ session, expiredOnLoad: false });
    expect(readAdminSession(at('2026-10-28T23:30:00'))).toEqual({ session: null, expiredOnLoad: true });
    // 한 번 지운 뒤에는 다시 '없던 것'으로 본다
    expect(readAdminSession(at('2026-10-28T23:30:00'))).toEqual({ session: null, expiredOnLoad: false });
  });

  it('만료 시각은 서울 시각으로 읽는다 (기기 시간대와 상관없이)', () => {
    saveAdminSession({ token: 't', expiresAt: '2026-10-28T23:00:00' });
    // 서울 23:00 = UTC 14:00
    expect(getAdminSession(Date.UTC(2026, 9, 28, 13, 59))).not.toBeNull();
    expect(getAdminSession(Date.UTC(2026, 9, 28, 14, 0))).toBeNull();
  });

  it('로그아웃하면 지운다', () => {
    saveAdminSession(session);
    clearAdminSession();
    expect(getAdminSession(at('2026-10-28T22:00:00'))).toBeNull();
  });

  it('모양이 이상한 값은 지우고 null', () => {
    for (const raw of [
      'not json',
      '{}',
      JSON.stringify({ token: '', expiresAt: session.expiresAt }),
      JSON.stringify({ token: 'x', expiresAt: 'tomorrow' }),
      JSON.stringify({ token: 1, expiresAt: session.expiresAt }),
    ]) {
      sessionStore.set(KEY, raw);
      expect(getAdminSession(at('2026-10-28T22:00:00')), raw).toBeNull();
      expect(sessionStore.has(KEY), raw).toBe(false);
    }
  });

  it('저장소를 쓸 수 없어도 오류 없이 null', () => {
    vi.stubGlobal('window', {
      get sessionStorage(): Storage {
        throw new Error('SecurityError');
      },
    });
    expect(() => saveAdminSession(session)).not.toThrow();
    expect(getAdminSession(at('2026-10-28T22:00:00'))).toBeNull();
    expect(() => clearAdminSession()).not.toThrow();
  });
});
