import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isSafeReturnPath,
  peekLoginReturnPath,
  saveLoginReturnPath,
  takeLoginReturnPath,
} from './loginReturn';

describe('isSafeReturnPath', () => {
  it('같은 사이트 안의 경로+쿼리는 받는다', () => {
    expect(isSafeReturnPath('/game/hangmentle?round=1')).toBe(true);
    expect(isSafeReturnPath('/game/hangmentle?view=practice&puzzle=2')).toBe(true);
    expect(isSafeReturnPath('/yard/3')).toBe(true);
    expect(isSafeReturnPath('/info-guide')).toBe(true);
    expect(isSafeReturnPath('/notice?q=%ED%95%AD%EB%A9%98%ED%8B%80')).toBe(true);
  });

  it('다른 사이트로 갈 수 있는 값은 받지 않는다 (오픈 리다이렉트)', () => {
    expect(isSafeReturnPath('//evil.example')).toBe(false);
    expect(isSafeReturnPath('//evil.example/game')).toBe(false);
    expect(isSafeReturnPath('/\\evil.example')).toBe(false);
    expect(isSafeReturnPath('/\t/evil.example')).toBe(false);
    expect(isSafeReturnPath('/\n/evil.example')).toBe(false);
    expect(isSafeReturnPath('https://evil.example/')).toBe(false);
    expect(isSafeReturnPath('javascript:alert(1)')).toBe(false);
    expect(isSafeReturnPath('game/hangmentle')).toBe(false);
    expect(isSafeReturnPath(' /home')).toBe(false);
    expect(isSafeReturnPath('')).toBe(false);
    expect(isSafeReturnPath(null)).toBe(false);
    expect(isSafeReturnPath(undefined)).toBe(false);
    expect(isSafeReturnPath(`/${'a'.repeat(3000)}`)).toBe(false);
  });

  it('로그인 흐름 화면(첫 화면·온보딩·정보 입력·로그인 콜백)으로는 돌아가지 않는다', () => {
    expect(isSafeReturnPath('/')).toBe(false);
    expect(isSafeReturnPath('/?utm_source=x')).toBe(false);
    expect(isSafeReturnPath('/onboarding')).toBe(false);
    expect(isSafeReturnPath('/info')).toBe(false);
    expect(isSafeReturnPath('/info?x=1')).toBe(false);
    expect(isSafeReturnPath('/oauth/callback/home')).toBe(false);
  });
});

describe('saveLoginReturnPath · takeLoginReturnPath', () => {
  const store = new Map<string, string>();
  const location = { pathname: '/', search: '' };

  beforeEach(() => {
    store.clear();
    vi.stubGlobal('window', {
      location,
      sessionStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key),
      },
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const at = (pathname: string, search = '') => Object.assign(location, { pathname, search });

  it('지금 경로+쿼리를 넣어 두고, 꺼내면 지운다', () => {
    at('/game/hangmentle', '?round=1');
    saveLoginReturnPath();
    expect(peekLoginReturnPath()).toBe('/game/hangmentle?round=1');
    expect(takeLoginReturnPath()).toBe('/game/hangmentle?round=1');
    expect(takeLoginReturnPath()).toBeNull();
  });

  it('온보딩에서 로그인하면 예전에 넣어 둔 값을 지운다 (홈으로)', () => {
    at('/game/hangmentle', '?round=2');
    saveLoginReturnPath();
    at('/onboarding');
    saveLoginReturnPath();
    expect(takeLoginReturnPath()).toBeNull();
  });

  it('저장소 값이 바뀌어 안전하지 않으면 쓰지 않는다', () => {
    store.set('cwf_login_return_v1', '//evil.example');
    expect(peekLoginReturnPath()).toBeNull();
    expect(takeLoginReturnPath()).toBeNull();
  });

  it('저장소를 쓸 수 없어도 오류 없이 null', () => {
    vi.stubGlobal('window', {
      location,
      get sessionStorage(): Storage {
        throw new Error('SecurityError');
      },
    });
    at('/yard/3');
    expect(() => saveLoginReturnPath()).not.toThrow();
    expect(takeLoginReturnPath()).toBeNull();
  });
});
