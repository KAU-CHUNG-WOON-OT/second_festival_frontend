// ──────────────────────────────────────────────
//  가게 실시간 현황(혼잡도): 단계별 이름·설명·색과 '3분 전 업데이트' 계산
//  서버 값(enum 문자열)과 화면 문구를 잇는 곳. 단계를 바꾸면 이 파일만 고치면 된다
// ──────────────────────────────────────────────

export const CONGESTION_LEVELS = ['RELAXED', 'NORMAL', 'BUSY', 'FULL'] as const;
export type CongestionLevel = (typeof CONGESTION_LEVELS)[number];

export interface CongestionLevelInfo {
  label: string;
  label_en: string;
  description: string;
  description_en: string;
  // 뱃지·버튼 색 (토큰만). 여유는 초록빛 olive, 보통 mustard, 혼잡 rust, 만석 ink
  colorClass: string;
}

export const CONGESTION_INFO: Record<CongestionLevel, CongestionLevelInfo> = {
  RELAXED: {
    label: '여유',
    label_en: 'Relaxed',
    description: '자리가 넉넉해요. 바로 들어갈 수 있어요.',
    description_en: 'Plenty of seats. You can walk right in.',
    colorClass: 'bg-olive text-paper',
  },
  NORMAL: {
    label: '보통',
    label_en: 'Normal',
    description: '손님이 적당히 있어요. 대부분 바로 앉을 수 있어요.',
    description_en: 'Moderately busy. You can usually get a seat.',
    colorClass: 'bg-mustard text-ink',
  },
  BUSY: {
    label: '혼잡',
    label_en: 'Busy',
    description: '손님이 많아요. 조금 기다릴 수 있어요.',
    description_en: 'Very busy. You may have to wait a little.',
    colorClass: 'bg-rust text-paper',
  },
  FULL: {
    label: '만석',
    label_en: 'Full',
    description: '자리가 다 찼어요. 기다려야 들어갈 수 있어요.',
    description_en: 'Every seat is taken. Expect a wait.',
    colorClass: 'bg-ink text-paper',
  },
};

// 서버 값이 모르는 문자열이면 '현황 없음'(null)으로 본다 (서버에 단계가 늘어도 화면이 깨지지 않게)
export const parseCongestionLevel = (value: unknown): CongestionLevel | null =>
  typeof value === 'string' && (CONGESTION_LEVELS as readonly string[]).includes(value)
    ? (value as CongestionLevel)
    : null;

export const congestionLabel = (level: CongestionLevel, isEng: boolean) =>
  isEng ? CONGESTION_INFO[level].label_en : CONGESTION_INFO[level].label;

export const congestionDescription = (level: CongestionLevel, isEng: boolean) =>
  isEng ? CONGESTION_INFO[level].description_en : CONGESTION_INFO[level].description;

// 여유 1 ~ 만석 4 (게이지 칸 수)
export const congestionStep = (level: CongestionLevel) => CONGESTION_LEVELS.indexOf(level) + 1;

// 혼잡도 서비스 시작(축제 당일 0시, 서울). 이 전에는 현황이 없거나 불러오지 못해도 '축제날에 서비스됩니다'로 안내
export const CONGESTION_SERVICE_START_MS = Date.parse('2026-10-28T00:00:00+09:00');

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

// 바뀐 시각(ms)과 지금 서버 시각(ms)으로 '3분 전 업데이트' / 'Updated 3 min ago'.
// 1분이 안 됐거나 기기·서버 시계 차이로 미래 시각이면 '방금'
export const formatUpdatedAgo = (updatedMs: number, nowMs: number, isEng: boolean) => {
  const elapsed = Math.max(0, nowMs - updatedMs);
  if (elapsed < MINUTE_MS) return isEng ? 'Updated just now' : '방금 업데이트';
  if (elapsed < HOUR_MS) {
    const minutes = Math.floor(elapsed / MINUTE_MS);
    return isEng ? `Updated ${minutes} min ago` : `${minutes}분 전 업데이트`;
  }
  if (elapsed < DAY_MS) {
    const hours = Math.floor(elapsed / HOUR_MS);
    return isEng ? `Updated ${hours} hr ago` : `${hours}시간 전 업데이트`;
  }
  const days = Math.floor(elapsed / DAY_MS);
  return isEng ? `Updated ${days} day${days === 1 ? '' : 's'} ago` : `${days}일 전 업데이트`;
};

// 서울 시각 '21:05' (관리자 화면의 마지막 변경 시각)
export const formatSeoulClock = (ms: number) => {
  const seoul = new Date(ms + 9 * HOUR_MS);
  const pad2 = (n: number) => String(n).padStart(2, '0');
  return `${pad2(seoul.getUTCHours())}:${pad2(seoul.getUTCMinutes())}`;
};

export interface StoreCongestion {
  storeId: number;
  level: CongestionLevel | null;
  updatedAt: string | null;
}

export interface StoreCongestionOverview {
  serverTime: string;
  stores: StoreCongestion[];
}

export const congestionOf = (
  overview: StoreCongestionOverview | undefined,
  storeId: number,
): StoreCongestion | null => overview?.stores.find((s) => s.storeId === storeId) ?? null;

// 한 가게 값만 바꾼 새 목록 (관리자 화면의 낙관적 갱신·되돌리기). 목록에 없던 가게면 뒤에 붙인다
export const patchStoreCongestion = (
  overview: StoreCongestionOverview | undefined,
  entry: StoreCongestion,
): StoreCongestionOverview | undefined => {
  if (!overview) return overview;
  const exists = overview.stores.some((s) => s.storeId === entry.storeId);
  return {
    ...overview,
    stores: exists
      ? overview.stores.map((s) => (s.storeId === entry.storeId ? entry : s))
      : [...overview.stores, entry],
  };
};
