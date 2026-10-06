import TicketStatusCard from './TicketStatusCard';

interface TicketWaitingCompleteCardProps {
  estimatedWaitText: string;
  onConfirm?: () => void;
}

const TicketWaitingCompleteCard = ({ estimatedWaitText, onConfirm }: TicketWaitingCompleteCardProps) => {
  return (
    <TicketStatusCard
      variant="success"
      title="웨이팅 등록 완료!"
      description="대기번호를 확인해주세요"
      actionLabel="확인"
      onAction={onConfirm}
    >
      {/* 예약 직후 응답에는 대기번호가 없어 '내 예약'에서 확인하도록 안내 */}
      <div className="rounded-[16px] border-2 border-ink bg-rust p-6 text-paper">
        <p className="font-typewriter text-[12px] leading-4 tracking-[3.6px]">▣ 대기번호</p>
        <p className="pt-2 font-body-kr text-[15px] font-bold leading-6">
          대기 처리 후 &apos;내 예약&apos; 화면에서
          <br />
          대기번호를 확인할 수 있어요
        </p>
      </div>
      <div className="rounded-[16px] border border-dashed border-ink bg-cream p-4">
        <p className="font-typewriter text-[12px] leading-4 tracking-[1.2px]">◷ 예상 대기 시간</p>
        <p className="font-display text-[30px] leading-9 text-rust">{estimatedWaitText}</p>
      </div>
    </TicketStatusCard>
  );
};

export default TicketWaitingCompleteCard;
