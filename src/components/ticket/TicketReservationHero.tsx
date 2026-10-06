import { FiCheck, FiGift, FiUsers } from 'react-icons/fi';

interface TicketReservationHeroProps {
  title: string;
  subtitle: string;
  currentReservation: number;
  maxReservation: number;
  ctaLabel: string;
  alreadyReserved?: boolean;
  reserveDisabled?: boolean;
  reserveDisabledLabel?: string;
  isClosed?: boolean;
  onReserve?: () => void;
}

const TicketReservationHero = ({
  title,
  subtitle,
  currentReservation,
  maxReservation,
  ctaLabel,
  alreadyReserved = false,
  reserveDisabled = false,
  reserveDisabledLabel,
  isClosed = false,
  onReserve,
}: TicketReservationHeroProps) => {
  const isSoldOut = maxReservation > 0 && currentReservation >= maxReservation;
  const progressPercent =
    maxReservation > 0 ? Math.min((currentReservation / maxReservation) * 100, 100) : 0;
  // hard-block: 클릭 자체가 막히는 상태 (매진 / 이미 예약)
  const isHardDisabled = isClosed || isSoldOut || alreadyReserved;
  // visual-only: 회색 + 라벨 변경하되 클릭은 부모가 판단 (예: 비로그인 → Kakao, 오픈전 → 무시)
  const isVisuallyDisabled = isHardDisabled || reserveDisabled;
  const showSoldOutOverlay = isClosed || isSoldOut;
  const buttonLabel = alreadyReserved
    ? '티켓이 발급되었습니다.'
    : reserveDisabled && reserveDisabledLabel
      ? reserveDisabledLabel
      : ctaLabel;
  const buttonBgClass = isVisuallyDisabled ? 'bg-[#94a3b8]' : 'bg-[#4f39f6]';
  const handleReserveClick = () => {
    if (isHardDisabled) return;
    onReserve?.();
  };

  return (
    <section className="w-full">
      <div className="relative h-[281px] w-full overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#7d6cff_0%,#527dfd_50%,#ffab4b_100%)] px-[24px] pt-[24px] pb-[23px]">
        <span className="pointer-events-none absolute left-[105px] top-0 size-[256px] rounded-full bg-white/10 blur-[64px]" />

        <div className="relative z-10 flex h-full flex-col gap-[16px]">
          <div className="flex h-[56px] items-center gap-[12px]">
            <div className="flex size-[56px] items-center justify-center rounded-[16px] border border-white/30 bg-white/20">
              <FiGift className="size-[28px] text-white" />
            </div>

            <div>
              <h2 className="text-[24px] font-bold leading-[32px] tracking-[0.0703px] text-white">
                {title}
              </h2>
              <p className="text-[14px] leading-[20px] tracking-[-0.1504px] text-white/90">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="h-[90px] rounded-[16px] border border-white/30 bg-white/15 px-[17px] pt-[17px] pb-[11px]">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-[8px] text-[16px] font-semibold leading-[24px] tracking-[-0.3125px] text-white">
                <FiUsers className="size-[20px]" />
                현재 예약
              </p>
              <p className="text-[24px] font-bold leading-[32px] tracking-[0.0703px] text-white">
                {currentReservation} / {maxReservation}
              </p>
            </div>

            <div className="mt-[12px] h-[12px] overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleReserveClick}
            disabled={isHardDisabled}
            className={`h-[56px] w-full rounded-[14px] ${buttonBgClass} text-[16px] font-bold leading-[24px] tracking-[-0.3125px] text-white ${isHardDisabled ? 'cursor-not-allowed' : ''}`}
          >
            {buttonLabel}
          </button>
        </div>

        {showSoldOutOverlay && (
          <>
            <div className="pointer-events-none absolute inset-0 z-20 bg-white/62 backdrop-blur-[3px]" />
            <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center">
              <div className="flex size-[42px] items-center justify-center rounded-full border-[2px] border-[#22c55e] bg-white">
                <FiCheck className="size-[24px] text-[#16a34a]" />
              </div>
              <p className="mt-[12px] text-center text-[16px] font-bold leading-[20px] tracking-[-0.1504px] text-[#111111]">
                예약이 마감되었습니다.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TicketReservationHero;
