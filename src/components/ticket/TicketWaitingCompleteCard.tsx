import { FiCheck, FiClock } from 'react-icons/fi';

interface TicketWaitingCompleteCardProps {
  estimatedWaitText: string;
  onConfirm?: () => void;
}

const TicketWaitingCompleteCard = ({
  estimatedWaitText,
  onConfirm,
}: TicketWaitingCompleteCardProps) => {
  return (
    <section className="w-full max-w-[361px] rounded-[24px] bg-white px-[24px] pt-[24px] pb-[20px] shadow-[0_25px_50px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col items-center">
        <div className="flex size-[64px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#5ea0ee_0%,#4a8dd9_100%)]">
          <FiCheck className="size-[32px] text-white" />
        </div>

        <h2 className="mt-[16px] text-[24px] font-bold leading-[36px] tracking-[0.0703px] text-[#0a0a0a]">
          웨이팅 등록 완료!
        </h2>
        <p className="mt-[8px] text-center text-[16px] leading-[24px] tracking-[-0.3125px] text-[#4a5565]">
          예상 대기 시간 이후 결과 확인이 가능합니다.
        </p>

        <div className="mt-[12px] rounded-[10px] bg-amber-100 px-[14px] py-[10px]">
          <p className="text-[13px] font-semibold leading-[20px] text-amber-800">
            ⚠️ 웨이팅 등록 = 팔찌 예약 완료가 아닙니다
          </p>
          <p className="mt-[2px] text-[12px] leading-[18px] text-amber-700">
            대기 처리 후 '내 예약' 화면에서 최종 확인해주세요.
          </p>
        </div>
      </div>

      <div className="mt-[24px] rounded-[16px] bg-[#eff6ff] px-[16px] pt-[16px] pb-[14px] text-center">
        <p className="flex items-center justify-center gap-[8px] text-[14px] leading-[21px] tracking-[-0.1504px] text-[#5ea0ee]">
          <FiClock className="size-[18px]" />
          예상 대기 시간
        </p>
        <p className="mt-[4px] text-[24px] font-bold leading-[36px] tracking-[0.0703px] text-[#5ea0ee]">
          {estimatedWaitText}
        </p>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        className="mt-[24px] h-[52px] w-full rounded-[16px] bg-[linear-gradient(90deg,#5ea0ee_0%,#4a8dd9_100%)] text-[16px] font-bold leading-[24px] tracking-[-0.3125px] text-white"
      >
        확인
      </button>
    </section>
  );
};

export default TicketWaitingCompleteCard;
