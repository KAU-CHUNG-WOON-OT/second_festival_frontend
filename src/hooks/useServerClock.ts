import { useCallback, useEffect, useRef, useState } from 'react';

const CLOCK_SYNC_INTERVAL_MS = 30 * 1000;
// 첫 동기화 실패 시 빠르게 재시도하기 위한 백오프 (ms).
// 한 번 성공한 뒤에는 일반 interval(30s)로만 갱신.
const INITIAL_RETRY_BACKOFFS_MS = [1000, 3000, 8000];

interface SyncPoint {
  serverNowMs: number;
  perfNowMs: number;
}

interface UseServerClockResult {
  serverNowMs: number | null;
  hasSynced: boolean;
  isSyncing: boolean;
  syncError: string | null;
  syncNow: () => Promise<boolean>;
}

const resolveApiBaseUrl = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) {
    throw new Error('VITE_API_BASE_URL is not configured.');
  }
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

const parseServerDateHeader = (rawDate: string | null): number => {
  if (!rawDate) {
    throw new Error('Date header is missing. Please expose Date via CORS.');
  }
  const parsed = Date.parse(rawDate);
  if (Number.isNaN(parsed)) {
    throw new Error('Invalid Date header from /health.');
  }
  return parsed;
};

export const useServerClock = (): UseServerClockResult => {
  const [syncPoint, setSyncPoint] = useState<SyncPoint | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [, forceTick] = useState(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const syncNow = useCallback(async (): Promise<boolean> => {
    setIsSyncing(true);

    try {
      const baseUrl = resolveApiBaseUrl();
      const syncUrl = `${baseUrl}/health`;
      const startedPerf = performance.now();
      const response = await fetch(syncUrl, {
        method: 'GET',
        cache: 'no-store',
        headers: { accept: 'application/json' },
      });
      const endedPerf = performance.now();
      const rawDate = response.headers.get('date');
      const serverDateMs = parseServerDateHeader(rawDate);

      // Approximate response arrival time on client with half-RTT compensation.
      const estimatedServerNowMs = serverDateMs + (endedPerf - startedPerf) / 2;

      if (!isMountedRef.current) return false;
      setSyncPoint({ serverNowMs: estimatedServerNowMs, perfNowMs: endedPerf });
      setSyncError(null);
      setHasSynced(true);
      return true;
    } catch (error) {
      if (!isMountedRef.current) return false;
      const message =
        error instanceof Error
          ? error.message
          : '서버 시간 동기화에 실패했습니다.';
      setSyncError(message);
      setHasSynced(true);
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsSyncing(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const retryTimers: number[] = [];

    // 부팅 시 즉시 한 번 시도하고, 실패하면 짧은 백오프로 재시도.
    // 성공하면 백오프 시퀀스 중단 (이후엔 일반 interval만 동작).
    void (async () => {
      const ok = await syncNow();
      if (ok || cancelled) return;
      for (const delay of INITIAL_RETRY_BACKOFFS_MS) {
        if (cancelled) return;
        await new Promise<void>((resolve) => {
          const id = window.setTimeout(() => resolve(), delay);
          retryTimers.push(id);
        });
        if (cancelled) return;
        const retryOk = await syncNow();
        if (retryOk || cancelled) return;
      }
    })();

    const syncInterval = window.setInterval(() => {
      void syncNow();
    }, CLOCK_SYNC_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void syncNow();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      cancelled = true;
      retryTimers.forEach((id) => window.clearTimeout(id));
      window.clearInterval(syncInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncNow]);

  useEffect(() => {
    if (!syncPoint) return;
    const tickInterval = window.setInterval(() => {
      forceTick((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(tickInterval);
  }, [syncPoint]);

  // forceTick이 1초마다 리렌더를 트리거하므로 매 렌더마다 재계산되어 카운트다운이 부드럽게 흐름.
  const serverNowMs = syncPoint
    ? syncPoint.serverNowMs + (performance.now() - syncPoint.perfNowMs)
    : null;

  return {
    serverNowMs,
    hasSynced,
    isSyncing,
    syncError,
    syncNow,
  };
};
