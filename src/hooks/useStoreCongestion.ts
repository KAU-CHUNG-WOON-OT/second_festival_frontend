import { useQuery } from '@tanstack/react-query';
import { fetchStoreCongestion, storeCongestionKey } from '@/lib/api/storeCongestion';

// 가게 실시간 현황 폴링 간격
export const STORE_CONGESTION_POLL_MS = 30_000;

// 모든 가게의 실시간 현황. 이 훅을 쓰는 화면(가게 목록·가게 화면)이 떠 있을 때만 30초마다 다시 받는다.
// 다른 화면으로 가면 멈추고, 화면이 숨어 있는 동안에도 멈췄다가 다시 보이면 바로 받는다.
// poll: false면 처음 한 번 + 다시 보일 때만 (관리자 화면: 바꾸는 중에 받아 온 값이 덮어쓰지 않게)
export const useStoreCongestion = ({ poll = true }: { poll?: boolean } = {}) =>
  useQuery({
    queryKey: storeCongestionKey,
    queryFn: fetchStoreCongestion,
    refetchInterval: poll ? STORE_CONGESTION_POLL_MS : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });
