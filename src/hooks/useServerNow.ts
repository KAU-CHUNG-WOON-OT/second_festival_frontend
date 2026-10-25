import { useEffect, useState } from 'react';
import { serverNow, subscribeServerClock } from '@/lib/serverClock';

// 초가 바뀌는 순간보다 조금 늦게 깨워 같은 초를 두 번 그리지 않게 한다
const WAKE_SLACK_MS = 15;
// 브라우저 타이머 한도(약 24일)를 넘지 않게, 먼 시각은 한 시간마다 다시 계산한다
const MAX_WAIT_MS = 60 * 60_000;

// 다시 계산해야 할 때: 서버 시계 차이가 바뀜, 화면이 다시 보임(숨어 있는 동안 타이머가 늦어진다)
const subscribeRefresh = (refresh: () => void) => {
  const unsubscribe = subscribeServerClock(refresh);
  const onVisibility = () => {
    if (document.visibilityState === 'visible') refresh();
  };
  document.addEventListener('visibilitychange', onVisibility);
  return () => {
    unsubscribe();
    document.removeEventListener('visibilitychange', onVisibility);
  };
};

// 서버 시각(ms). 서버 시계의 초가 바뀔 때마다 새 값으로 다시 그린다 (카운트다운 숫자)
export const useServerNow = () => {
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      window.clearTimeout(timer);
      const t = serverNow();
      setNow(t);
      timer = window.setTimeout(tick, 1000 - (t % 1000) + WAKE_SLACK_MS);
    };
    timer = window.setTimeout(tick, 0);
    const unsubscribe = subscribeRefresh(tick);
    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return now;
};

// 서버 시각(ms). 매초가 아니라 targets(열리는 시각 등)를 지나는 순간에만 새 값으로 다시 그린다
export const useServerNowAt = (targets: readonly (number | null)[]) => {
  const [now, setNow] = useState(serverNow);
  const key = targets.filter((target): target is number => target !== null).join(',');

  useEffect(() => {
    const list = key ? key.split(',').map(Number) : [];
    let timer = 0;
    const update = () => {
      window.clearTimeout(timer);
      const t = serverNow();
      setNow(t);
      const upcoming = list.filter((target) => target > t);
      if (upcoming.length === 0) return;
      const wait = Math.min(...upcoming) - t + WAKE_SLACK_MS;
      timer = window.setTimeout(update, Math.min(wait, MAX_WAIT_MS));
    };
    timer = window.setTimeout(update, 0);
    const unsubscribe = subscribeRefresh(update);
    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [key]);

  return now;
};
