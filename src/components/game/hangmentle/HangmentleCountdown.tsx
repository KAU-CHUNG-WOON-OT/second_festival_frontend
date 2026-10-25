import { useLanguage } from '@/contexts/LanguageContext';
import { useServerNow } from '@/hooks/useServerNow';
import { countdownParts, formatCountdown } from '@/data/hangmentleClock';

interface CountdownTextProps {
  // 열리는 시각 (epoch ms, 서버 시계 기준)
  targetMs: number;
  className?: string;
  // 큰 카운트다운: 날짜 수가 붙으면 전체를 조금 줄이고 날짜 수('2일')는 더 작게 해 한 줄에 들어가게 한다
  compactDays?: boolean;
}

// 서버 시계로 1초마다 줄어드는 'HH:MM:SS' (24시간 넘게 남았으면 날짜 수도)
const CountdownText = ({ targetMs, className = '', compactDays = false }: CountdownTextProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const remaining = targetMs - useServerNow();
  const text = formatCountdown(remaining, isEng);
  const { days } = countdownParts(remaining);

  // 숫자 폭을 고정해 매초 글자가 좌우로 흔들리지 않게, 줄이 바뀌지 않게
  const base = `whitespace-nowrap tabular-nums ${className}`;
  if (!compactDays || days === 0) {
    return (
      <span role="timer" className={base}>
        {text}
      </span>
    );
  }
  const space = text.indexOf(' ');
  return (
    <span role="timer" className={base}>
      <span className="text-[0.82em]">
        <span className="pr-[0.2em] text-[0.6em]">{text.slice(0, space)}</span>
        {text.slice(space + 1)}
      </span>
    </span>
  );
};

export default CountdownText;
