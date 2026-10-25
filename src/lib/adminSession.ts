import { parseServerTime } from '@/data/hangmentleClock';
import { serverNow } from './serverClock';

// 관리자 토큰. 카카오 로그인(사용자 JWT)과 완전히 따로 두고, 이 탭의 sessionStorage에만 넣는다
// (탭을 닫으면 사라지고 다른 탭·기기와 나누지 않는다). 서버에는 X-Admin-Token 헤더로만 보낸다
const ADMIN_SESSION_KEY = 'cwf_admin_session_v1';

export interface AdminSession {
  token: string;
  // 서버가 정한 만료 시각 (서울 기준 ISO 날짜·시간)
  expiresAt: string;
}

const storage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const clearAdminSession = () => {
  try {
    storage()?.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // 무시
  }
};

// 만료 시각(epoch ms). 읽을 수 없으면 null
export const adminSessionExpiresMs = (session: AdminSession) => parseServerTime(session.expiresAt);

const isAdminSession = (value: unknown): value is AdminSession => {
  if (!value || typeof value !== 'object') return false;
  const { token, expiresAt } = value as Record<string, unknown>;
  return typeof token === 'string' && token.length > 0 && typeof expiresAt === 'string';
};

export const saveAdminSession = (session: AdminSession) => {
  try {
    storage()?.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify({ token: session.token, expiresAt: session.expiresAt }),
    );
  } catch {
    // 저장이 막혀 있으면 다음 화면에서 다시 로그인하게 된다
  }
};

// 넣어 둔 토큰. 없거나, 모양이 이상하거나, 만료 시각이 지났으면 지우고 session은 null.
// expiredOnLoad: 토큰이 있었는데 만료 시각이 지나 지웠으면 true (로그인 화면에 만료 안내를 띄울 때 씀)
export const readAdminSession = (
  now: number = serverNow(),
): { session: AdminSession | null; expiredOnLoad: boolean } => {
  let raw: string | null | undefined;
  try {
    raw = storage()?.getItem(ADMIN_SESSION_KEY);
  } catch {
    return { session: null, expiredOnLoad: false };
  }
  if (!raw) return { session: null, expiredOnLoad: false };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }
  const session = isAdminSession(parsed) ? parsed : null;
  const expiresMs = session ? adminSessionExpiresMs(session) : null;
  if (!session || expiresMs === null || expiresMs <= now) {
    clearAdminSession();
    return { session: null, expiredOnLoad: session !== null && expiresMs !== null };
  }
  return { session, expiredOnLoad: false };
};

export const getAdminSession = (now: number = serverNow()): AdminSession | null => readAdminSession(now).session;
