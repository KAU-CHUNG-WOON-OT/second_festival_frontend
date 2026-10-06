import RetroPageHeader from '@/components/common/RetroPageHeader';
import { FESTIVAL_DATE_LABEL } from '@/data/timetableData';

interface TicketPageHeaderProps {
  onRefresh: () => void;
}

// 팔찌 안내 · 내 예약 화면 공통 상단
const TicketPageHeader = ({ onRefresh }: TicketPageHeaderProps) => {
  return (
    <>
      <RetroPageHeader />

      <div className="pt-8">
        <span className="inline-flex h-[38px] items-center rounded-full border border-ink bg-mustard px-4 font-display text-[18px] leading-7">
          활주로 · {FESTIVAL_DATE_LABEL}
        </span>
      </div>

      <div className="flex items-end gap-3 pt-2">
        <h1 className="font-display text-[60px] leading-[60px]">팔찌 안내</h1>
        <button
          type="button"
          onClick={onRefresh}
          aria-label="새로고침"
          className="mb-2 flex size-11 items-center justify-center rounded-full border border-ink bg-paper font-typewriter text-[20px] leading-7 drop-shadow-[3px_3px_0px_var(--color-ink)]"
        >
          ↻
        </button>
      </div>
    </>
  );
};

export default TicketPageHeader;
