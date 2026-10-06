import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { FiX } from 'react-icons/fi';
import { fetchTicketCounter } from '@/lib/api/ticket';

const DISMISSED_KEY = 'cwf_bracelet_ended_dismissed_v1';
const TICKET_MAX_RESERVATION = 900;

interface BraceletEndedPopupProps {
  onClose: () => void;
}

const BraceletEndedPopupContent = ({ onClose }: BraceletEndedPopupProps) => {
  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <div className="px-6 pt-5 pb-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-[12px] font-semibold text-red-600">
              <span className="size-[6px] rounded-full bg-red-500" />
              마감
            </span>
            <button
              onClick={onClose}
              className="flex size-[32px] items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
              aria-label="닫기"
            >
              <FiX size={18} />
            </button>
          </div>

          <h2 className="mb-2 text-[24px] font-bold leading-tight text-[#1e2235]">
            팔찌 예약이
            <br />
            <span className="text-[#e53e3e]">마감되었어요</span>
          </h2>
          <p className="text-[13px] leading-relaxed text-gray-500">
            예약 시간(10:00 ~ 15:00)이 종료되었어요.
            <br />
            팔찌는 아래 안내에 따라 수령해주세요.
          </p>
        </div>

        {/* 수령 안내 */}
        <div className="mx-6 mb-5 rounded-[16px] bg-gray-50 px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#4362d0]/10 text-[20px]">
                📍
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1e2235]">수령 장소</p>
                <p className="text-[12px] leading-relaxed text-gray-500">학생회관 앞</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#4362d0]/10 text-[20px]">
                🎫
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1e2235]">수령 방법</p>
                <p className="text-[12px] leading-relaxed text-gray-500">
                  예약 확인 화면을 제시하고
                  <br />
                  팔찌를 수령해주세요
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-7 pt-2">
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#4362d0] py-[16px] text-[16px] font-bold text-white active:opacity-80"
          >
            확인했어요
          </button>
          <button
            onClick={handleDismiss}
            className="mt-4 w-full text-[13px] text-gray-400 active:opacity-60"
          >
            다시 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
};

const BraceletEndedPopup = () => {
  const [visible, setVisible] = useState(false);

  const { data: counterData } = useQuery({
    queryKey: ['ticket', 'counter'],
    queryFn: fetchTicketCounter,
    staleTime: 5000,
    enabled: !localStorage.getItem(DISMISSED_KEY),
  });

  const isSoldOut =
    counterData !== undefined && counterData.current_count >= TICKET_MAX_RESERVATION;

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;
    if (isSoldOut) {
      setVisible(true);
    }
  }, [isSoldOut]);

  if (!visible) return null;

  return createPortal(
    <BraceletEndedPopupContent onClose={() => setVisible(false)} />,
    document.body,
  );
};

export default BraceletEndedPopup;
