import { useEffect, useState } from 'react';
import DayHeader from '@/components/common/DayHeader';
import TicketBoardingPassCard from '@/components/ticket/TicketBoardingPassCard';
import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@/lib/apiClient';
import { fetchTicketCounter, fetchTicketInfo } from '@/lib/api/ticket';
import { fetchMyProfile } from '@/lib/api/user';
import type { StudentType } from '@/lib/userInfoStorage';
import {
  clearTicketIssuePending,
  getTicketIssuePendingUntil,
} from '@/lib/ticketIssueSession';
import { useTicketCounterStream } from '@/hooks/useTicketCounterStream';
import { track } from '@/lib/mixpanel';

const EMPTY_TICKET_NOTCH_MASK = `
  radial-gradient(circle 27px at 0 309.5px, transparent 26.5px, black 27px),
  radial-gradient(circle 27px at 100% 309.5px, transparent 26.5px, black 27px)
`;

const emptyTicketMaskStyle = {
  WebkitMaskImage: EMPTY_TICKET_NOTCH_MASK,
  maskImage: EMPTY_TICKET_NOTCH_MASK,
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
} as const;

const DEFAULT_NO_TICKET_MESSAGE = '발급된 팔찌가 없습니다.';
const TICKET_ISSUE_PROCESSING_MESSAGE = '팔찌 발급 처리 중 입니다.\n잠시만 기다려주세요.';
const TICKET_SOLD_OUT_MESSAGE = '예약이 마감되었습니다.';
const TICKET_MAX_RESERVATION = 900;

const STUDENT_TYPE_LABEL: Record<StudentType, string> = {
  UNDERGRADUATE: '재학생',
  ON_LEAVE: '휴학생',
  GRADUATE: '대학원생',
};

const toWaitingNumber = (value: number | string | undefined): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : null;
  }
  if (typeof value === 'string') {
    const numericOnly = value.replace(/\D/g, '');
    const parsed = Number.parseInt(numericOnly, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }
  return null;
};

const EmptyTicketPerforation = () => (
  <div className="absolute inset-x-0 top-[283px] h-[53px]">
    <span className="absolute left-[30px] right-[30px] top-1/2 -translate-y-1/2 border-t-[4px] border-dashed border-white/30" />
  </div>
);

interface EmptyTicketCardProps {
  message: string;
  actionLabel?: string;
  actionDisabled?: boolean;
  onAction?: () => void;
}

const EmptyTicketCard = ({ message, actionLabel, actionDisabled = false, onAction }: EmptyTicketCardProps) => (
  <div
    className="h-[453px] w-[351px]"
    style={{ filter: 'drop-shadow(0 22px 40px rgba(47,79,112,0.26))' }}
  >
    <div
      className="relative size-full overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#67b5e8_0%,#4ea9e6_100%)]"
      style={emptyTicketMaskStyle}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[28px]">
        <p className="whitespace-pre-line text-center text-[24px] font-bold leading-[1.35] tracking-[-0.02em] text-white">
          {message}
        </p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            disabled={actionDisabled}
            className="mt-[18px] h-[42px] min-w-[124px] rounded-[12px] border border-white/45 bg-white/20 px-[16px] text-[14px] font-medium text-white backdrop-blur-[2px] disabled:opacity-60"
          >
            {actionLabel}
          </button>
        )}
      </div>
      <EmptyTicketPerforation />
    </div>
  </div>
);

const MyTicketPage = () => {
  const [ticketIssuePendingUntil, setTicketIssuePendingUntil] = useState<number | null>(() => {
    const pendingUntil = getTicketIssuePendingUntil();
    if (!pendingUntil || pendingUntil <= Date.now()) {
      clearTicketIssuePending();
      return null;
    }
    return pendingUntil;
  });

  const {
    data: ticketInfo,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['ticket', 'info'],
    queryFn: fetchTicketInfo,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: counterData,
    isFetching: isCounterFetching,
    refetch: refetchCounter,
  } = useQuery({
    queryKey: ['ticket', 'counter'],
    queryFn: fetchTicketCounter,
    staleTime: 5000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: myProfile } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: fetchMyProfile,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  // SSE로 카운터 실시간 갱신 — 매진 감지 지연 방지.
  // 동일한 query key('ticket', 'counter') 캐시에 push되므로 counterData가 자동으로 업데이트됨.
  useTicketCounterStream();

  const isTicketIssuePending =
    ticketIssuePendingUntil !== null && ticketIssuePendingUntil > Date.now();
  const hasIssuedTicket = ticketInfo?.result === 'SUCCESS' && Boolean(ticketInfo.ticket);
  const isAuthError = isError && error instanceof ApiError && error.status === 401;
  const isSoldOut = (counterData?.current_count ?? 0) >= TICKET_MAX_RESERVATION;

  useEffect(() => {
    if (!ticketIssuePendingUntil) return;
    const remainingMs = ticketIssuePendingUntil - Date.now();
    if (remainingMs <= 0) {
      clearTicketIssuePending();
      setTicketIssuePendingUntil(null);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      clearTicketIssuePending();
      setTicketIssuePendingUntil(null);
      // 만료 시점에 백엔드 발급이 늦게 완료됐을 수도 있으므로 1회 자동 재조회.
      // (이후엔 사용자가 다시 들어오거나 새로고침해야 갱신)
      void refetch();
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [ticketIssuePendingUntil, refetch]);

  useEffect(() => {
    if (!hasIssuedTicket || !ticketIssuePendingUntil) return;
    clearTicketIssuePending();
    setTicketIssuePendingUntil(null);
  }, [hasIssuedTicket, ticketIssuePendingUntil]);

  useEffect(() => {
    if (!isSoldOut || !ticketIssuePendingUntil) return;
    clearTicketIssuePending();
    setTicketIssuePendingUntil(null);
  }, [isSoldOut, ticketIssuePendingUntil]);

  useEffect(() => {
    if (isSoldOut && !hasIssuedTicket) {
      track('ticket_sold_out_seen', {
        current_count: counterData?.current_count ?? null,
      });
    }
  }, [isSoldOut, hasIssuedTicket, counterData?.current_count]);

  const isProcessingTicketIssue =
    isTicketIssuePending && !hasIssuedTicket && !isAuthError && !isSoldOut;

  const noTicketMessage = (() => {
    if (isProcessingTicketIssue) {
      return null;
    }

    if (isAuthError) {
      return '로그인 후 티켓을 확인해주세요.';
    }

    if (isSoldOut && !hasIssuedTicket) {
      return TICKET_SOLD_OUT_MESSAGE;
    }

    if (ticketInfo?.result === 'FAIL') {
      return DEFAULT_NO_TICKET_MESSAGE;
    }

    if (isError) {
      return DEFAULT_NO_TICKET_MESSAGE;
    }

    return null;
  })();

  const baseName = hasIssuedTicket
    ? ticketInfo.user_info?.name || ticketInfo.ticket.user_id || '사용자'
    : '';
  const studentTypeLabel = myProfile?.studentType
    ? STUDENT_TYPE_LABEL[myProfile.studentType]
    : '';
  const passengerName =
    hasIssuedTicket && studentTypeLabel ? `${baseName} (${studentTypeLabel})` : baseName;
  const seatNumber = hasIssuedTicket ? String(ticketInfo.ticket.ticket_number) : '';
  const waitingNumber = hasIssuedTicket
    ? toWaitingNumber(ticketInfo.ticket.ticket_number)
    : null;
  const department = hasIssuedTicket ? ticketInfo.user_info?.department ?? '' : '';
  const studentId = hasIssuedTicket ? ticketInfo.user_info?.student_id ?? '' : '';
  const isReceived = hasIssuedTicket && ticketInfo.ticket.status === 'USED';

  return (
    <section className="relative flex min-h-[965px] w-full flex-col">
      <div className="relative z-10 flex min-h-[965px] w-full flex-col items-center px-[20px] pb-[24px]">
        <div className="w-full max-w-[402px]">
          <DayHeader
            selectedDay={1}
            onSelectDay={() => {}}
            showDayTabs={false}
            title="팔찌 안내"
          />

          <div className="mt-[44px] flex w-full justify-center">
            <div className="w-[351px]">
              {isProcessingTicketIssue ? (
                <EmptyTicketCard
                  message={TICKET_ISSUE_PROCESSING_MESSAGE}
                  actionLabel={isFetching || isCounterFetching ? '새로고침 중...' : '새로고침'}
                  actionDisabled={isFetching || isCounterFetching}
                  onAction={() => {
                    void Promise.all([refetch(), refetchCounter()]);
                  }}
                />
              ) : isPending ? (
                <EmptyTicketCard message="티켓 정보를 불러오는 중입니다." />
              ) : noTicketMessage ? (
                <EmptyTicketCard message={noTicketMessage} />
              ) : (
                <TicketBoardingPassCard
                  passengerName={passengerName}
                  seatNumber={seatNumber}
                  waitingNumber={waitingNumber}
                  department={department}
                  studentId={studentId}
                  isReceived={isReceived}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyTicketPage;
