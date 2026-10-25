import { hasHangmentleViewKey } from '@/data/hangmentleView';

// 앱 안에 이전 기록이 없을 때(공유 링크로 바로 들어온 경우) 상단 뒤로가기로 갈 곳: 상세는 그 목록, 나머지는 홈.
// 게임 안의 화면(항멘틀 ?round=1 등)으로 바로 들어왔으면 그 게임의 첫 화면으로.
// 추적용 쿼리(?utm_source=…, ?fbclid=…)만 붙은 게임 첫 화면은 이미 첫 화면이므로 게임 목록으로 (뒤로가기를 두 번 누르지 않게)
export const fallbackPath = (pathname: string, search: string) => {
  if (/^\/game\/[^/]+$/.test(pathname) && hasHangmentleViewKey(new URLSearchParams(search))) {
    return pathname;
  }
  const list = pathname.match(/^\/(yard|pub|foodtruck|stores|game)\/[^/]+$/)?.[1];
  return list ? `/${list}` : '/home';
};
