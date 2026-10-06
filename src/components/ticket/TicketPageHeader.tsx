import RetroPageHeader from '@/components/common/RetroPageHeader';
import RetroPageTitle from '@/components/common/RetroPageTitle';

interface TicketPageHeaderProps {
  onRefresh: () => void;
}

// 팔찌 안내 · 내 예약 화면 공통 상단
const TicketPageHeader = ({ onRefresh }: TicketPageHeaderProps) => {
  return (
    <>
      <RetroPageHeader />

      <RetroPageTitle
        title="팔찌 안내"
        showDate
        aside={
          <button
            type="button"
            onClick={onRefresh}
            aria-label="새로고침"
            className="mb-2 flex size-11 items-center justify-center rounded-full border border-ink bg-paper font-typewriter text-[20px] leading-7 drop-shadow-[3px_3px_0px_var(--color-ink)]"
          >
            ↻
          </button>
        }
      />
    </>
  );
};

export default TicketPageHeader;
