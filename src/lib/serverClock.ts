import { clockSample, parseServerTime, pickClockSample, type ClockSample } from '@/data/hangmentleClock';

// 서버 시계. 서버 응답에 담긴 serverTime으로 기기 시계와의 차이를 재 두고, 지금 서버 시각을 계산한다.
// 아직 서버에 물어보지 않았으면 기기 시계를 그대로 쓴다 (열리는 순간에는 어차피 서버에 다시 묻는다)

const MAX_SAMPLES = 8;
const samples: ClockSample[] = [];
let offset = 0;
const listeners = new Set<() => void>();

// 요청을 보내기 직전과 답을 받은 직후의 performance.now()와 함께 서버 시각을 넣는다
export const recordServerTime = (
  serverTime: string | null | undefined,
  sentPerf: number,
  receivedPerf: number,
) => {
  const serverMs = parseServerTime(serverTime);
  if (serverMs === null) return;
  samples.push(clockSample(serverMs, sentPerf, receivedPerf, Date.now()));
  if (samples.length > MAX_SAMPLES) samples.shift();
  const next = pickClockSample(samples, Date.now(), performance.now())?.offset ?? 0;
  if (next === offset) return;
  offset = next;
  listeners.forEach((listener) => listener());
};

// 서버에 물어보면서 걸린 시간을 재어 서버 시각을 기록한다
export const withServerTime = async <T extends { serverTime?: string | null }>(
  request: () => Promise<T>,
): Promise<T> => {
  const sentPerf = performance.now();
  const data = await request();
  recordServerTime(data?.serverTime, sentPerf, performance.now());
  return data;
};

export const serverNow = () => Date.now() + offset;

// 기기 시계와의 차이가 바뀌면 알려 준다
export const subscribeServerClock = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
