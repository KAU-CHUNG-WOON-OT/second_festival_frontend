import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useServerNowAt } from '@/hooks/useServerNow';
import { serverNow } from '@/lib/serverClock';
import { parseServerTime } from '@/data/hangmentleClock';
import {
  HANGMENTLE_EVENT_ROUNDS,
  openedWhileWatching,
  roundPhase,
  roundPollInterval,
  watchClosedRounds,
  type RoundPhaseEntry,
} from '@/data/hangmentleEvent';
import {
  fetchHangmentleRounds,
  hangmentleEventKeys,
  type HangmentleRoundInfo,
  type HangmentleRoundsOverview,
} from '@/lib/api/hangmentle';

// 이 간격으로 서버 시계를 다시 맞춘다 (화면이 숨어 있으면 react-query가 멈추고, 다시 보이면 바로 맞춘다)
const CLOCK_SYNC_MS = 60_000;

// 다음에 물어볼 간격: 기본은 시계 맞추기 간격, 열리는 순간 서버가 아직 닫혀 있다고 하면 더 자주
const overviewPollInterval = (data: HangmentleRoundsOverview | undefined) => {
  if (!data) return CLOCK_SYNC_MS;
  const now = serverNow();
  return data.rounds.reduce<number>((min, info) => {
    const interval = roundPollInterval(info, now);
    return interval === false ? min : Math.min(min, interval);
  }, CLOCK_SYNC_MS);
};

// 모든 회차 요약 + 서버 시계 맞추기. 항멘틀 화면 맨 위에서 한 번만 부른다
export const useEventRoundsOverview = () => {
  const query = useQuery({
    queryKey: hangmentleEventKeys.overview,
    queryFn: fetchHangmentleRounds,
    refetchInterval: (q) => overviewPollInterval(q.state.data),
  });
  const { refetch } = query;

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refetch();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [refetch]);

  return query;
};

export const roundInfoOf = (overview: HangmentleRoundsOverview | undefined, round: number) =>
  overview?.rounds.find((info) => info.round === round) ?? null;

// 회차마다 지금 상태. 열리는 시각을 지나는 순간 다시 계산된다
export const useEventRoundPhases = (
  overview: HangmentleRoundsOverview | undefined,
): (RoundPhaseEntry & { info: HangmentleRoundInfo | null })[] => {
  const infos = HANGMENTLE_EVENT_ROUNDS.map((event) => roundInfoOf(overview, event.round));
  const now = useServerNowAt(infos.map((info) => parseServerTime(info?.opensAt)));
  return HANGMENTLE_EVENT_ROUNDS.map((event, i) => {
    const info = infos[i];
    return { round: event.round, info, phase: info ? roundPhase(info, now) : null };
  });
};

// 이 화면을 보는 동안 열리기 전이던 회차가 열리면 그 회차 번호 (ignore에 넣은 회차는 빼고)
export const useRoundOpenedHere = (
  phases: readonly RoundPhaseEntry[],
  ignore: readonly number[] = [],
) => {
  const [watched, setWatched] = useState<readonly number[]>([]);
  // 렌더 중에 기억을 고친다 (이전 렌더 정보를 저장하는 React 권장 방식). 바뀐 게 없으면 같은 배열이라 다시 그리지 않는다
  const nextWatched = watchClosedRounds(watched, phases);
  if (nextWatched !== watched) setWatched(nextWatched);
  return openedWhileWatching(nextWatched, phases, ignore);
};
