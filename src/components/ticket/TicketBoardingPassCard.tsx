import { useState } from 'react';
import type { FormEvent, KeyboardEvent, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { redeemTicketWithPassword } from '@/lib/api/ticket';
import type { TicketInfoResponse } from '@/lib/api/ticket';
import { ApiError } from '@/lib/apiClient';
import { track } from '@/lib/mixpanel';
import checkIcon from '@/assets/ticket_check_olive.svg';

interface TicketBoardingPassCardProps {
  waitingNumber?: number | null;
  isReceived: boolean;
}

const TicketBoardingPassCard = ({ waitingNumber = null, isReceived }: TicketBoardingPassCardProps) => {
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
      <section className="relative w-full overflow-clip rounded-[24px] border-2 border-ink bg-mustard text-ink shadow-[6px_6px_0px_0px_var(--color-ink)]">
        <div className="p-5">
          <div className="flex justify-between font-typewriter text-[11px] font-bold leading-[16.5px] tracking-[1.1px]">
            <span>BOARDING PASS</span>
            <span>KA 2026</span>
          </div>
          <div className="mt-3 rounded-[16px] border-2 border-ink bg-paper p-5 text-center">
            <p className="font-typewriter text-[12px] leading-4 tracking-[1.2px]">▣ 대기번호</p>
            <p className="font-condensed text-[96px] font-black leading-[96px] text-rust">
              {waitingNumber ?? '—'}
            </p>
            {!isReceived && (
              <button
                type="button"
                onClick={handleOpenReceiveModal}
                onKeyDown={handleReceiveButtonKeyDown}
                className="mt-4 h-14 w-full rounded-full border-2 border-ink bg-ink font-display text-[18px] leading-7 text-paper"
              >
                수령완료하기
              </button>
            )}
          </div>
        </div>

        <div className="relative flex items-center gap-3 border-t-2 border-dashed border-ink p-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-ink bg-paper font-body-kr text-[24px] leading-8">
            🎓
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[18px] leading-7">한국항공대학교 총학생회</p>
            <p className="font-body-kr text-[14px] leading-5">팔찌를 받기 위해 대기 시간에 맞춰 부스로 와주세요</p>
          </div>
          {/* 티켓 펀치 홈 */}
          <span className="absolute -left-4 -top-4 size-7 rounded-full border-2 border-ink bg-cream" />
          <span className="absolute -right-4 -top-4 size-7 rounded-full border-2 border-ink bg-cream" />
        </div>

        {isReceived && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[24px] bg-cream/85 p-6 backdrop-blur-[2px]">
            <div className="flex size-16 items-center justify-center rounded-full border-2 border-ink bg-paper drop-shadow-[4px_4px_0px_var(--color-ink)]">
              <img src={checkIcon} alt="" width={36} height={36} />
            </div>
            <p className="pt-4 text-center font-display text-[20px] leading-[27.5px]">
              수령완료 처리되어 해당 번호 및 화면이
              <br />더 이상 유효하지 않습니다
            </p>
          </div>
        )}
      </section>

      {isReceiveModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink/70 px-4 backdrop-blur-[8px]"
            onClick={handleReceiveModalBackdropClick}
            role="presentation"
          >
            <div
              className="w-full max-w-[371px] rounded-[24px] border-2 border-ink bg-paper p-5 text-ink drop-shadow-[6px_6px_0px_var(--color-mustard)]"
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
                  className="h-14 w-full rounded-full border-2 border-ink bg-cream px-5 text-center font-display text-[18px] outline-none placeholder:text-ink/50"
                />

                <p className="pt-3 text-center font-body-kr text-[12px] font-bold leading-[19.5px]">
                  *총학생회 부스에서 관계자 지시에 따라주세요
                  <br />
                  개인과실로 완료하실 시 책임은 본인에게 있음을 명시합니다
                </p>

                {receiveCodeError && (
                  <p className="pt-2 font-body-kr text-[12px] font-bold text-rust">{receiveCodeError}</p>
                )}

                <button
                  type="submit"
                  disabled={useTicketMutation.isPending}
                  className="mt-4 h-16 w-full rounded-[16px] border-2 border-ink bg-rust font-display text-[20px] leading-7 text-paper drop-shadow-[4px_4px_0px_var(--color-ink)] disabled:opacity-60"
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

export default TicketBoardingPassCard;
