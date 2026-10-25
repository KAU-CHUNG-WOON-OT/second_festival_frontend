import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchAdminSession,
  fetchStoreCongestion,
  loginAdmin,
  updateStoreCongestion,
} from './storeCongestion';
import { ApiError } from '@/lib/apiClient';
import { clearAccessToken, setAccessToken } from '@/lib/authStorage';

// 테스트용 가짜 비밀번호·토큰 (실제 값과 무관)
const DUMMY_PASSWORD = '0000';
const ADMIN_TOKEN = 'test-admin-token';

interface Call {
  url: string;
  init: RequestInit;
  headers: Headers;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('가게 현황 API', () => {
  let calls: Call[];
  let reply: (url: string) => Response;

  beforeEach(() => {
    calls = [];
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.test');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init: RequestInit = {}) => {
        calls.push({ url, init, headers: new Headers(init.headers) });
        return reply(url);
      }),
    );
    // 카카오로 로그인한 사용자라고 치고 사용자 JWT를 넣어 둔다 (관리자·공개 API에는 붙으면 안 됨)
    setAccessToken('user-jwt');
  });
  afterEach(() => {
    clearAccessToken();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('공개 현황은 토큰·쿠키 없이 받고, 모르는 단계는 null로 거른다', async () => {
    reply = () =>
      json(200, {
        success: true,
        code: 'SUCCESS',
        data: {
          serverTime: '2026-10-28T21:00:00',
          stores: [
            { storeId: 401, level: 'BUSY', updatedAt: '2026-10-28T20:57:00' },
            { storeId: 402, level: 'WEIRD', updatedAt: '2026-10-28T20:00:00' },
            { storeId: 403, level: null, updatedAt: null },
          ],
        },
      });
    const data = await fetchStoreCongestion();
    expect(data.stores.map((s) => s.level)).toEqual(['BUSY', null, null]);

    const [call] = calls;
    expect(call.url).toBe('https://api.test/api/stores/congestion');
    expect(call.init.credentials).toBe('omit');
    expect(call.headers.has('Authorization')).toBe(false);
    expect(call.headers.has('X-Admin-Token')).toBe(false);
  });

  it('로그인: 비밀번호만 보내고 사용자 JWT는 붙이지 않는다', async () => {
    reply = () =>
      json(200, { success: true, data: { token: ADMIN_TOKEN, expiresAt: '2026-10-28T23:00:00' } });
    const result = await loginAdmin(DUMMY_PASSWORD);
    expect(result.token).toBe(ADMIN_TOKEN);

    const [call] = calls;
    expect(call.url).toBe('https://api.test/api/admin/login');
    expect(call.init.method).toBe('POST');
    expect(JSON.parse(String(call.init.body))).toEqual({ password: DUMMY_PASSWORD });
    expect(call.headers.has('Authorization')).toBe(false);
    expect(call.headers.has('X-Admin-Token')).toBe(false);
  });

  it('로그인 401·429는 ApiError로 (사용자 토큰 새로 받기를 하지 않음)', async () => {
    reply = () =>
      json(401, {
        success: false,
        code: 'ADMIN-401',
        message: '비밀번호가 맞지 않아요',
        error: { code: 'ADMIN-401', message: '비밀번호가 맞지 않아요' },
      });
    await expect(loginAdmin(DUMMY_PASSWORD)).rejects.toMatchObject({
      status: 401,
      code: 'ADMIN-401',
    });
    expect(calls.map((c) => c.url)).toEqual(['https://api.test/api/admin/login']);

    reply = () =>
      json(429, {
        success: false,
        code: 'ADMIN-429',
        message: '잠시 후 다시 시도해 주세요',
        error: { code: 'ADMIN-429', message: '잠시 후 다시 시도해 주세요' },
      });
    const error = await loginAdmin(DUMMY_PASSWORD).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 429, message: '잠시 후 다시 시도해 주세요' });
  });

  it('관리자 API에는 X-Admin-Token만 붙는다', async () => {
    reply = (url) =>
      url.endsWith('/session')
        ? json(200, { success: true, data: { expiresAt: '2026-10-28T23:00:00' } })
        : json(200, {
            success: true,
            data: { storeId: 401, level: 'FULL', updatedAt: '2026-10-28T21:00:00' },
          });

    await fetchAdminSession(ADMIN_TOKEN);
    const saved = await updateStoreCongestion(ADMIN_TOKEN, 401, 'FULL');
    await updateStoreCongestion(ADMIN_TOKEN, 401, null);
    expect(saved).toEqual({ storeId: 401, level: 'FULL', updatedAt: '2026-10-28T21:00:00' });

    expect(calls.map((c) => `${c.init.method ?? 'GET'} ${c.url}`)).toEqual([
      'GET https://api.test/api/admin/session',
      'PUT https://api.test/api/admin/stores/401/congestion',
      'PUT https://api.test/api/admin/stores/401/congestion',
    ]);
    for (const call of calls) {
      expect(call.headers.get('X-Admin-Token')).toBe(ADMIN_TOKEN);
      expect(call.headers.has('Authorization')).toBe(false);
      expect(call.init.credentials).toBe('omit');
    }
    expect(JSON.parse(String(calls[1].init.body))).toEqual({ level: 'FULL' });
    expect(JSON.parse(String(calls[2].init.body))).toEqual({ level: null });
  });

  it('토큰이 만료되면 401 ApiError (사용자 토큰 새로 받기를 하지 않음)', async () => {
    reply = () => json(401, { success: false, code: 'ADMIN-401', message: '다시 로그인해 주세요' });
    await expect(updateStoreCongestion(ADMIN_TOKEN, 401, 'BUSY')).rejects.toMatchObject({
      status: 401,
    });
    expect(calls).toHaveLength(1);
  });
});
