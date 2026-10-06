import { performanceEvents, type PerformanceData } from './performanceData';

// 🔧 개발용: 축제 기간이 아닐 때도 강제로 공연을 표시
// 배포 전에 false로 바꾸기!
const FORCE_SHOW_FOR_DEV = false;

const DATE_TO_DAY: Record<string, number> = {
  '5월 18일': 18,
  '5월 19일': 19,
  '5월 20일': 20,
};

// "14:30" -> 870 (분 단위)
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const getCurrentPerformance = (): PerformanceData | null => {
  // 개발 모드: 첫 번째 공연 강제 표시
  if (FORCE_SHOW_FOR_DEV) {
    return performanceEvents['5월 18일'][0];
  }

  const now = new Date();

  // 5월이 아니면 즉시 종료
  if (now.getMonth() !== 4) return null;

  const today = now.getDate();
  const todayKey = Object.keys(DATE_TO_DAY).find((key) => DATE_TO_DAY[key] === today);
  if (!todayKey) return null;

  const events = performanceEvents[todayKey];
  if (!events || events.length === 0) return null;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // 시간순 정렬
  const sorted = [...events].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  // 현재 시간이 시작 시간 이후인 가장 마지막 공연
  let current: PerformanceData | null = null;
  for (const event of sorted) {
    if (timeToMinutes(event.time) <= nowMinutes) {
      current = event;
    } else {
      break;
    }
  }

  return current;
};
