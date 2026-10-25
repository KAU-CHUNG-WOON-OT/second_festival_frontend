import { CONGESTION_INFO, congestionLabel, type CongestionLevel } from '../../data/storeCongestion';

interface CongestionBadgeProps {
  level: CongestionLevel;
  isEng: boolean;
  // 가게 화면 실시간 현황 카드처럼 크게
  large?: boolean;
}

// 혼잡도 뱃지: 여유(olive) · 보통(mustard) · 혼잡(rust) · 만석(ink). 영어는 타자기 대문자
const CongestionBadge = ({ level, isEng, large = false }: CongestionBadgeProps) => {
  const size = large
    ? 'gap-2 px-4 py-[6px] text-[18px] leading-6'
    : 'gap-[6px] px-3 py-[3px] text-[13px] leading-4';
  const font = isEng
    ? 'font-typewriter font-bold uppercase tracking-[1px]'
    : 'font-body-kr font-bold';

  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-ink ${size} ${font} ${CONGESTION_INFO[level].colorClass}`}
    >
      {/* 실시간 값이라는 표시: 작은 paper 점 */}
      <span
        aria-hidden
        className={`${large ? 'size-[9px]' : 'size-[7px]'} rounded-full border border-ink bg-paper`}
      />
      {congestionLabel(level, isEng)}
    </span>
  );
};

export default CongestionBadge;
