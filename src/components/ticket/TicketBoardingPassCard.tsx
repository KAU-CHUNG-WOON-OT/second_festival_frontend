import { useState } from 'react';
import type { FormEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FiCheck } from 'react-icons/fi';
import { LuTicket } from 'react-icons/lu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { redeemTicketWithPassword } from '@/lib/api/ticket';
import type { TicketInfoResponse } from '@/lib/api/ticket';
import { ApiError } from '@/lib/apiClient';
import { track } from '@/lib/mixpanel';

interface TicketBoardingPassCardProps {
  passengerName: string;
  seatNumber: string;
  waitingNumber?: number | null;
  department: string;
  studentId: string;
  isReceived: boolean;
}

interface TicketFrontFaceProps {
  passengerName: string;
  seatNumber: string;
  department: string;
  studentId: string;
}

interface TicketBackFaceProps {
  waitingNumber: number | null;
  isReceived: boolean;
}

interface TicketFaceShellProps {
  children: ReactNode;
}

const TicketPerforation = () => (
  <div className="absolute inset-x-0 top-[283px] h-[53px]">
    <span className="absolute left-[30px] right-[30px] top-1/2 -translate-y-1/2 border-t-[4px] border-dashed border-white/30" />
  </div>
);

const TicketBottomStrip = () => (
  <div className="absolute left-[32px] top-[363px] flex h-[57px] w-[289px] items-center gap-[12px] border-t border-white/10 pt-px">
    <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-white/90 text-[20px]">
      🎓
    </div>

    <div className="min-w-0 flex-1">
      <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[-0.1504px] text-white">
        한국항공대학교 총학생회
      </p>
      <p className="truncate text-[11px] leading-[16px] text-white/60">
        팔찌 수령은 학생회관 2층 테라스로 가주세요.
      </p>
    </div>

    <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[14px] bg-white/10">
      <span className="text-[12px] font-bold leading-[16px] text-white">QR</span>
    </div>
  </div>
);

const TICKET_NOTCH_MASK = `
  radial-gradient(circle 27px at 0 309.5px, transparent 26.5px, black 27px),
  radial-gradient(circle 27px at 100% 309.5px, transparent 26.5px, black 27px)
`;

const ticketShellMaskStyle = {
  WebkitMaskImage: TICKET_NOTCH_MASK,
  maskImage: TICKET_NOTCH_MASK,
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
} as const;

const TicketFaceShell = ({ children }: TicketFaceShellProps) => (
  <div className="size-full" style={{ filter: 'drop-shadow(0 22px 40px rgba(47,79,112,0.26))' }}>
    <div
      className="relative size-full overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#67b5e8_0%,#4ea9e6_100%)]"
      style={ticketShellMaskStyle}
    >
      {children}
    </div>
  </div>
);

const TicketFrontFace = ({
  passengerName,
  seatNumber,
  department,
  studentId,
}: TicketFrontFaceProps) => (
  <>
    <div className="absolute left-[32px] top-[30px] flex w-[286px] items-start justify-between">
      <div className="flex items-center gap-[8px]">
        <span aria-hidden="true" className="text-[24px] leading-[32px] text-[#0a0a0a]">
          ✈️
        </span>
        <div className="max-w-[140px] min-w-0">
          <p className="text-[12px] leading-[16px] text-white/60">Passenger</p>
          <p className="truncate text-[18px] font-bold leading-[28px] tracking-[-0.4395px] text-white">
            {passengerName}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-[12px] leading-[16px] text-white/60">Seat</p>
        <p className="text-[18px] font-bold leading-[28px] tracking-[-0.4395px] text-white">
          {seatNumber}
        </p>
      </div>
    </div>

    <div className="absolute left-[32px] top-[92px] h-[81px] w-[289px]">
      <div className="absolute left-0 top-0 w-[86.5px]">
        <p className="text-[12px] leading-[16px] text-white/60">JOG</p>
        <p className="whitespace-nowrap text-[20px] font-bold leading-[28px] tracking-[-0.4492px] text-white">
          한국항공대
        </p>
        <p className="mt-[0.5px] whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.1504px] text-white/70">
          Mon, May 18
        </p>
        <p className="whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.1504px] text-white/70">
          09:00
        </p>
      </div>

      <div className="absolute left-[195px] top-0 w-[90.93px] text-right">
        <p className="text-[12px] leading-[16px] text-white/60">DPS</p>
        <p className="whitespace-nowrap text-[20px] font-bold leading-[28px] tracking-[-0.4492px] text-white">
          활공의 하늘
        </p>
        <p className="mt-[0.5px] whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.1504px] text-white/70">
          Wed, May 20
        </p>
        <p className="whitespace-nowrap text-[14px] leading-[20px] tracking-[-0.1504px] text-white/70">
          23:00
        </p>
      </div>

      <div className="absolute left-[99px] top-[39px] h-[10px] w-[112px] px-[24px]">
        <div className="relative h-[2px] w-full">
          <span className="absolute left-[-24px] top-0 h-[2px] w-[87.57px] bg-white/20" />
          <span className="absolute left-[-23.67px] top-[-5px] flex size-[12px] items-center justify-center rounded-full bg-white">
            <span className="text-[10px] leading-none text-[#0a0a0a]">✈️</span>
          </span>
        </div>
        <div className="mt-[4px] flex justify-center gap-[4px]">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className="size-[4px] rounded-full bg-white/30" />
          ))}
        </div>
      </div>
    </div>

    <div className="absolute left-[32px] top-[196px] flex w-[287px] items-start justify-between">
      <div className="w-[138px]">
        <p className="text-[12px] leading-[16px] text-white/60">Class</p>
        <p className="mt-[4px] truncate text-[16px] font-bold leading-[24px] tracking-[-0.3125px] text-white">
          {department}
        </p>
      </div>

      <div className="w-[132px] text-right">
        <p className="text-[12px] leading-[16px] text-white/60">Student ID</p>
        <p className="mt-[4px] whitespace-nowrap text-[16px] font-bold leading-[24px] tracking-[-0.3125px] text-white">
          {studentId || '-'}
        </p>
      </div>
    </div>

    <TicketPerforation />
    <TicketBottomStrip />
  </>
);

const TicketBackFace = ({ waitingNumber, isReceived }: TicketBackFaceProps) => {
  const queryClient = useQueryClient();
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [receiveCodeInput, setReceiveCodeInput] = useState('');
  const [receiveCodeError, setReceiveCodeError] = useState<string | null>(null);

  const useTicketMutation = useMutation({
    mutationFn: (password: string) => redeemTicketWithPassword(password),
    onSuccess: () => {
      track('myticket_redeem_attempted', { result: 'success' });
      // Optimistically flip status to USED so the overlay shows immediately
      // without waiting for a refetch.
      queryClient.setQueryData<TicketInfoResponse>(['ticket', 'info'], (prev) => {
        if (!prev || prev.result !== 'SUCCESS') return prev;
        return {
          ...prev,
          ticket: { ...prev.ticket, status: 'USED' },
        };
      });
      setIsReceiveModalOpen(false);
      setReceiveCodeError(null);
    },
    onError: (error) => {
      const status = error instanceof ApiError ? error.status : undefined;
      const code = error instanceof ApiError ? error.code : undefined;
      track('myticket_redeem_attempted', {
        result: 'fail',
        status,
        code,
      });
      let message: string;
      if (error instanceof ApiError && error.status === 403) {
        message = '비밀번호가 일치하지 않습니다.';
      } else if (error instanceof ApiError && error.message) {
        message = error.message;
      } else {
        message = '요청에 실패했습니다. 잠시 후 다시 시도해주세요.';
      }
      setReceiveCodeError(message);
    },
  });

  const handleOpenReceiveModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isReceived) return;
    setReceiveCodeInput('');
    setReceiveCodeError(null);
    setIsReceiveModalOpen(true);
  };

  const handleReceiveButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handleReceiveModalBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (useTicketMutation.isPending) return;
    setIsReceiveModalOpen(false);
    setReceiveCodeError(null);
  };

  const handleReceiveCodeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (useTicketMutation.isPending) return;

    const password = receiveCodeInput.trim();
    if (!password) {
      setReceiveCodeError('비밀번호를 입력해주세요.');
      return;
    }
    setReceiveCodeError(null);
    useTicketMutation.mutate(password);
  };

  return (
    <>
      <div className="absolute left-[18px] top-[20px] h-[243px] w-[315px] rounded-[16px] bg-[#e3e8f0]">
        <div className="flex h-full flex-col items-center pt-[14px]">
          <LuTicket aria-hidden="true" className="size-[32px] text-[#343a46]" />
          <p className="mt-[10px] text-[14px] leading-[24px] tracking-[-0.1504px] text-[#555d69]">
            대기번호
          </p>
          <p className="mt-[10px] text-[84px] font-bold leading-[1] text-[#333]">
            {waitingNumber ?? '—'}
          </p>
          {!isReceived && (
            <button
              type="button"
              onClick={handleOpenReceiveModal}
              onKeyDown={handleReceiveButtonKeyDown}
              className="mt-[12px] flex h-[40px] w-[204px] items-center justify-center rounded-full bg-[#2750B9] text-[16px] font-normal leading-none text-white"
            >
              수령하기
            </button>
          )}
        </div>
      </div>

      <TicketPerforation />
      <TicketBottomStrip />

      {isReceived && (
        <>
          <div className="pointer-events-none absolute inset-0 z-[12] bg-white/55" />
          <div className="pointer-events-none absolute inset-0 z-[13] flex flex-col items-center pt-[192px]">
            <div className="flex size-[36px] items-center justify-center rounded-full border-[2px] border-[#22c55e] bg-white">
              <FiCheck aria-hidden="true" className="size-[22px] text-[#16a34a]" />
            </div>
            <p className="mt-[14px] text-center text-[14px] font-bold leading-[1.35] text-[#111111]">
              수령완료 처리되어 해당 번호 및 화면은
              <br />더 이상 유효하지 않습니다
            </p>
          </div>
        </>
      )}

      {isReceiveModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-white/30 px-4 backdrop-blur-[6px]"
            onClick={handleReceiveModalBackdropClick}
            role="presentation"
          >
            <div
              className="w-full max-w-[320px] min-h-[180px] rounded-[16px] bg-white px-[12px] pb-[10px] pt-[18px] shadow-[0_20px_40px_rgba(15,23,42,0.22)]"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="수령 코드 입력"
            >
              <form className="flex flex-col items-center" onSubmit={handleReceiveCodeSubmit}>
                <input
                  type="text"
                  value={receiveCodeInput}
                  onChange={(event) => {
                    setReceiveCodeInput(event.target.value);
                    if (receiveCodeError) setReceiveCodeError(null);
                  }}
                  placeholder="수령완료 코드입력"
                  className="h-[44px] w-[220px] rounded-[14px] bg-[#d9d9d9] px-3 text-center text-[16px] font-semibold text-[#1f2937] placeholder:text-[#1f2937] focus:outline-none"
                />

                <p className="mt-[10px] text-center text-[10px] leading-[1.35] text-[#343a46]">
                  *총학생회 부스에서 관계자 지시에 따라주세요
                  <br />
                  개인과실로 완료하실 시 책임은 본인에게 있음을 명시합니다
                </p>

                {receiveCodeError && (
                  <p className="mt-[6px] text-[11px] leading-none text-[#dc2626]">
                    {receiveCodeError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={useTicketMutation.isPending}
                  className="mt-[20px] h-[42px] w-full rounded-[14px] bg-[#2d57c6] text-[16px] font-normal leading-none text-white disabled:opacity-60"
                >
                  {useTicketMutation.isPending ? '확인 중...' : '수령 완료'}
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

const TicketBoardingPassCard = ({
  passengerName,
  seatNumber,
  waitingNumber = null,
  department,
  studentId,
  isReceived,
}: TicketBoardingPassCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const toggleCardFace = () => setIsFlipped((previous) => !previous);
  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCardFace();
    }
  };

  return (
    <section
      role="button"
      tabIndex={0}
      onClick={toggleCardFace}
      onKeyDown={handleCardKeyDown}
      aria-label={isFlipped ? '티켓 앞면 보기' : '티켓 뒷면 보기'}
      aria-pressed={isFlipped}
      className="relative h-[453px] w-[351px] cursor-pointer [perspective:1800px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ea0ee]/80 focus-visible:ring-offset-2"
    >
      <div
        className={`relative size-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        <div
          className={`absolute inset-0 [backface-visibility:hidden] ${isFlipped ? 'pointer-events-none' : 'pointer-events-auto'}`}
        >
          <TicketFaceShell>
            <TicketFrontFace
              passengerName={passengerName}
              seatNumber={seatNumber}
              department={department}
              studentId={studentId}
            />
          </TicketFaceShell>
        </div>

        <div
          className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <TicketFaceShell>
            <TicketBackFace waitingNumber={waitingNumber} isReceived={isReceived} />
          </TicketFaceShell>
        </div>
      </div>
    </section>
  );
};

export default TicketBoardingPassCard;
