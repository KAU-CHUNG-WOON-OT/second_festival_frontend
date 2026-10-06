import { Link } from 'react-router-dom';
import arrowIcon from '@/assets/home_arrow.svg';

interface HomeTicketSectionProps {
  to: string;
}

const HomeTicketSection = ({ to }: HomeTicketSectionProps) => {
  return (
    <Link
      to={to}
      className="relative flex w-full items-center gap-4 rounded-[16px] bg-rust p-5 text-paper drop-shadow-[6px_6px_0px_var(--color-ink)]"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-paper font-body-kr text-[24px] leading-8">
        ✈️
      </span>
      <div className="min-w-0 flex-1 border-l border-dashed border-paper/70 pl-4">
        <p className="font-display text-[20px] leading-7">팔찌 예약 바로가기</p>
        <p className="font-body-kr text-[14px] leading-5 opacity-80">공연 티켓팅 안내 및 관람 가이드 안내</p>
      </div>
      <img src={arrowIcon} alt="" width={15} height={13} className="mx-[5px] shrink-0" />

      {/* 티켓 펀치 홈 */}
      <span className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-cream" />
      <span className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-cream" />
    </Link>
  );
};

export default HomeTicketSection;
