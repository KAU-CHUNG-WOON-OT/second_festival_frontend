import { apiFetch } from '@/lib/apiClient';
import { withServerTime } from '@/lib/serverClock';
import {
  parseCongestionLevel,
  type CongestionLevel,
  type StoreCongestion,
  type StoreCongestionOverview,
} from '@/data/storeCongestion';

// 가게 실시간 현황(혼잡도) API.
// - 손님 화면: 로그인 없이 누구나 읽는다 (토큰·쿠키 없이)
// - 관리자: 관리자 로그인으로 받은 토큰을 X-Admin-Token 헤더로만 보낸다.
//   카카오 사용자 JWT(Authorization)는 붙이지 않고, 관리자 토큰은 여기 관리자 함수에 인자로 넘길 때만 쓴다
//   (apiFetch가 알아서 붙이지 않으므로 다른 API로 새어 나가지 않는다)

export const storeCongestionKey = ['stores', 'congestion'] as const;

// 공개 API는 토큰·쿠키 없이. 서버 시각을 담은 응답이라 캐시된 값을 받지 않는다
const PUBLIC_FRESH = { auth: false, credentials: 'omit', cache: 'no-store' } as const;

// 관리자 API: 사용자 토큰을 붙이지 않고(auth: false, 401이어도 사용자 토큰 새로 받기를 하지 않음) 쿠키도 보내지 않는다
const adminRequest = (token: string | null) =>
  ({
    auth: false,
    credentials: 'omit',
    cache: 'no-store',
    headers: token ? { 'X-Admin-Token': token } : undefined,
  }) as const;

// 서버가 모르는 단계를 보내도 화면이 깨지지 않게 값을 한 번 거른다
const normalizeEntry = (entry: StoreCongestion): StoreCongestion => ({
  storeId: entry.storeId,
  level: parseCongestionLevel(entry.level),
  updatedAt: entry.updatedAt ?? null,
});

export const fetchStoreCongestion = async (): Promise<StoreCongestionOverview> => {
  const data = await withServerTime(() =>
    apiFetch<StoreCongestionOverview>('/api/stores/congestion', PUBLIC_FRESH),
  );
  return { serverTime: data.serverTime, stores: (data.stores ?? []).map(normalizeEntry) };
};

export interface AdminLoginResult {
  token: string;
  // 서울 기준 ISO 날짜·시간
  expiresAt: string;
}

// 비밀번호는 서버만 확인한다. 틀리면 401(ADMIN-401), 너무 자주 시도하면 429(ADMIN-429)
export const loginAdmin = (password: string): Promise<AdminLoginResult> =>
  apiFetch<AdminLoginResult>('/api/admin/login', {
    ...adminRequest(null),
    method: 'POST',
    body: { password },
  });

// 넣어 둔 토큰이 아직 유효한지 (아니면 401)
export const fetchAdminSession = (token: string): Promise<{ expiresAt: string }> =>
  apiFetch<{ expiresAt: string }>('/api/admin/session', adminRequest(token));

// level이 null이면 현황을 지운다. 없는 가게 404(STORE-404), 토큰 만료 401(ADMIN-401)
export const updateStoreCongestion = async (
  token: string,
  storeId: number,
  level: CongestionLevel | null,
): Promise<StoreCongestion> => {
  const data = await apiFetch<StoreCongestion>(`/api/admin/stores/${storeId}/congestion`, {
    ...adminRequest(token),
    method: 'PUT',
    body: { level },
  });
  return normalizeEntry(data);
};
