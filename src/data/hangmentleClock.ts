// 항멘틀 이벤트 시계: 휴대폰 시계만 믿지 않고 서버 시각과의 차이(오프셋)로 카운트다운을 센다.
// 이 파일에는 계산만 둔다 (보관·구독은 lib/serverClock, 1초 갱신은 hooks/useServerNow)

// 서버 시각은 오프셋 없는 서울 시각(LocalDateTime). 한국은 서머타임이 없어 늘 +9시간
const SEOUL_OFFSET_MS = 9 * 60 * 60 * 1000;
const ISO_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:[.,](\d+))?)?(Z|[+-]\d{2}:?\d{2})?$/i;

// 서버 시각 문자열을 epoch ms로. 오프셋이 없으면 서울 시각으로 읽는다 (기기 시간대와 상관없이 같은 값)
export const parseServerTime = (iso: string | null | undefined): number | null => {
  if (!iso) return null;
  const match = ISO_PATTERN.exec(iso.trim());
  if (!match) return null;
  const [, year, month, day, hour, minute, second = '0', fraction = '', zone] = match;
  const ms = Number(fraction.slice(0, 3).padEnd(3, '0'));
  const asUtc = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second, ms);
  if (!zone) return asUtc - SEOUL_OFFSET_MS;
  if (zone.toUpperCase() === 'Z') return asUtc;
  const sign = zone.startsWith('-') ? -1 : 1;
  const zoneMinutes = Number(zone.slice(1, 3)) * 60 + Number(zone.slice(-2));
  return asUtc - sign * zoneMinutes * 60_000;
};

// 서버에 물어본 한 번의 결과. offset을 Date.now()에 더하면 서버 시각
export interface ClockSample {
  offset: number;
  // 요청을 보내고 답을 받기까지 걸린 시간. 짧을수록 오프셋이 정확하다
  rtt: number;
  // 답을 받은 때의 기기 시계(Date.now)와 단조 시계(performance.now)
  receivedAt: number;
  receivedPerf: number;
}

// 서버는 요청을 받은 뒤 답을 만들므로, 받은 순간의 서버 시각은 serverTime + 왕복 시간의 절반으로 본다
export const clockSample = (
  serverMs: number,
  sentPerf: number,
  receivedPerf: number,
  receivedAt: number,
): ClockSample => {
  const rtt = Math.max(0, receivedPerf - sentPerf);
  return { offset: serverMs + rtt / 2 - receivedAt, rtt, receivedAt, receivedPerf };
};

// 최근 표본을 이만큼만 믿는다
export const CLOCK_SAMPLE_MAX_AGE_MS = 3 * 60_000;
// 기기 시계와 단조 시계가 이보다 많이 어긋나면 그 사이 기기 시계가 바뀐 것 (사용자가 시간을 바꿈, 잠자기 등)
const CLOCK_JUMP_TOLERANCE_MS = 1000;

// 쓸 표본 고르기: 최근 표본 가운데 왕복 시간이 가장 짧은 것. 믿을 만한 표본이 없으면 가장 최근 것
export const pickClockSample = (
  samples: readonly ClockSample[],
  nowDate: number,
  nowPerf: number,
): ClockSample | null => {
  if (samples.length === 0) return null;
  const usable = samples.filter((sample) => {
    const byDate = nowDate - sample.receivedAt;
    const byPerf = nowPerf - sample.receivedPerf;
    return byDate <= CLOCK_SAMPLE_MAX_AGE_MS && Math.abs(byDate - byPerf) <= CLOCK_JUMP_TOLERANCE_MS;
  });
  if (usable.length === 0) return samples[samples.length - 1];
  return usable.reduce((best, sample) => (sample.rtt < best.rtt ? sample : best));
};

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// 남은 시간을 일·시·분·초로. 초는 올림이라 0.2초 남았으면 1초, 0 이하가 되는 순간 모두 0
export const countdownParts = (remainingMs: number): CountdownParts => {
  const total = Math.max(0, Math.ceil(remainingMs / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};

const pad2 = (n: number) => String(n).padStart(2, '0');

// 'HH:MM:SS', 24시간 넘게 남았으면 앞에 날짜 수 ('2일 03:04:05' / '2d 03:04:05')
export const formatCountdown = (remainingMs: number, isEng: boolean) => {
  const { days, hours, minutes, seconds } = countdownParts(remainingMs);
  const clock = `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
  if (days === 0) return clock;
  return isEng ? `${days}d ${clock}` : `${days}일 ${clock}`;
};

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 열리는 시각을 서울 기준 '10월 28일 밤 10시' / 'Oct 28, 10:00 PM'로
export const formatOpensAt = (ms: number, isEng: boolean) => {
  const seoul = new Date(ms + SEOUL_OFFSET_MS);
  const month = seoul.getUTCMonth();
  const day = seoul.getUTCDate();
  const hour = seoul.getUTCHours();
  const minute = seoul.getUTCMinutes();
  const hour12 = hour % 12 || 12;
  if (isEng) {
    return `${MONTHS_EN[month]} ${day}, ${hour12}:${pad2(minute)} ${hour < 12 ? 'AM' : 'PM'}`;
  }
  // 자정은 '밤 12시', 1~5시는 '새벽'
  const period = hour === 0 ? '밤' : hour < 6 ? '새벽' : hour < 12 ? '오전' : hour < 18 ? '오후' : '밤';
  return `${month + 1}월 ${day}일 ${period} ${hour12}시${minute ? ` ${minute}분` : ''}`;
};
