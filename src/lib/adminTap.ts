// 관리자 화면으로 가는 숨은 입구: 청운 로고를 빠르게 7번 누르면 /admin/login.
// 다른 화면 상단바의 로고(누르면 홈)와 홈 화면의 로고가 같은 자리에 있어서, 첫 탭에 홈으로 넘어가도
// 이어서 누르면 그대로 센다. 그래서 두 로고가 이 파일의 탭 기록 하나를 같이 쓴다 (화면이 바뀌어도 유지)

export const ADMIN_TAP_COUNT = 7;
// 첫 탭과 마지막 탭 사이가 이 시간 안이어야 한다
export const ADMIN_TAP_WINDOW_MS = 3000;

export interface AdminTapResult {
  // 다음 탭과 비교할 최근 탭 시각들
  taps: number[];
  // 이번 탭으로 7번을 채웠는지
  triggered: boolean;
}

// 계산만: 지난 탭 시각들 + 이번 탭 시각 → 남길 기록, 열지 여부.
// 이번 탭보다 3초 넘게 앞선 탭은 버리므로 천천히 누르면 끝없이 눌러도 7번이 차지 않는다. 열리면 기록을 비운다
export const countAdminTap = (taps: readonly number[], now: number): AdminTapResult => {
  const recent = [...taps.filter((t) => t <= now && now - t <= ADMIN_TAP_WINDOW_MS), now];
  if (recent.length >= ADMIN_TAP_COUNT) return { taps: [], triggered: true };
  return { taps: recent, triggered: false };
};

let tapTimes: number[] = [];

// 로고를 누를 때마다 부른다. true면 관리자 로그인으로 보낸다 (그 탭의 원래 동작은 막는다).
// 기기 시계를 바꿔도 어긋나지 않게 단조 시계(performance.now)로 잰다
export const registerAdminLogoTap = (now: number = performance.now()) => {
  const result = countAdminTap(tapTimes, now);
  tapTimes = result.taps;
  return result.triggered;
};

// 테스트용: 기록 비우기
export const resetAdminLogoTaps = () => {
  tapTimes = [];
};
