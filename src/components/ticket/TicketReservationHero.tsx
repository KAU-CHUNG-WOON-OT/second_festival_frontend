import checkIcon from '@/assets/ticket_check_olive.svg';

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
  // visual-only: 흐리게 + 라벨 변경하되 클릭은 부모가 판단 (예: 비로그인 → Kakao, 오픈전 → 무시)
  const isVisuallyDisabled = isHardDisabled || reserveDisabled;
  const showSoldOutOverlay = isClosed || isSoldOut;
  const buttonLabel = alreadyReserved
    ? '티켓이 발급되었습니다.'
    : reserveDisabled && reserveDisabledLabel
      ? reserveDisabledLabel
      : ctaLabel;
  const handleReserveClick = () => {
    if (isHardDisabled) return;
    onReserve?.();
  };

  return (
    <section className="w-full">
      <div className="relative w-full overflow-clip rounded-[24px] border-2 border-ink bg-[linear-gradient(171deg,var(--color-rust)_54%,var(--color-mustard)_94%)] p-6 text-ink shadow-[6px_6px_0px_0px_var(--color-ink)]">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-[16px] border border-ink bg-paper font-body-kr text-[30px] leading-9">
            🎁
          </div>
          <div className="text-paper">
            <h2 className="font-display text-[24px] leading-8">{title}</h2>
            <p className="font-body-kr text-[14px] leading-5 opacity-90">{subtitle}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[16px] border border-ink bg-paper/90 p-4">
          <div className="flex items-center justify-between">
            <p className="font-body-kr text-[16px] font-bold leading-6">현재 예약</p>
            <p className="font-condensed text-[36px] font-black leading-10">
              {currentReservation} / {maxReservation}
            </p>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full border border-ink bg-cream">
            <div className="h-full bg-olive" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <button
          type="button"
          onClick={handleReserveClick}
          disabled={isHardDisabled}
          className={`mt-5 h-16 w-full rounded-[16px] border-2 border-ink bg-ink font-display text-[20px] leading-7 text-paper drop-shadow-[4px_4px_0px_var(--color-ink)] ${
            isVisuallyDisabled ? 'opacity-50' : ''
          } ${isHardDisabled ? 'cursor-not-allowed' : ''}`}
        >
          {buttonLabel}
        </button>

        {showSoldOutOverlay && (
          <>
            <div className="pointer-events-none absolute inset-0 z-20 bg-cream/85 backdrop-blur-[2px]" />
            <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center">
              <div className="flex size-16 items-center justify-center rounded-full border-2 border-ink bg-paper drop-shadow-[4px_4px_0px_var(--color-ink)]">
                <img src={checkIcon} alt="" width={36} height={36} />
              </div>
              <p className="pt-4 text-center font-display text-[20px] leading-7">예약이 마감되었습니다.</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TicketReservationHero;
