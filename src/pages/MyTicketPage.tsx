import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketBoardingPassCard from '@/components/ticket/TicketBoardingPassCard';
import TicketInfoListCard from '@/components/ticket/TicketInfoListCard';
import TicketPageHeader from '@/components/ticket/TicketPageHeader';
import TicketStatusCard from '@/components/ticket/TicketStatusCard';
import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@/lib/apiClient';
import { fetchTicketCounter, fetchTicketInfo } from '@/lib/api/ticket';
import {
  clearTicketIssuePending,
  getTicketIssuePendingUntil,
} from '@/lib/ticketIssueSession';
import { useTicketCounterStream } from '@/hooks/useTicketCounterStream';
import { track } from '@/lib/mixpanel';
import { TICKET_INFO_ITEMS, TICKET_MAX_RESERVATION } from '@/data/ticketData';

const DEFAULT_NO_TICKET_MESSAGE = '발급된 팔찌가 없습니다.';

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

const MyTicketPage = () => {
  const navigate = useNavigate();
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

  const noTicketState = (() => {
    if (isProcessingTicketIssue) {
      return null;
    }

    if (isAuthError) {
      return { title: '로그인이 필요해요', description: '로그인 후 티켓을 확인해주세요.' };
    }

    if (isSoldOut && !hasIssuedTicket) {
      return {
        title: '웨이팅 등록에 실패했습니다',
        description: `선착순 ${TICKET_MAX_RESERVATION}명에 들지 못했습니다.`,
      };
    }

    if (ticketInfo?.result === 'FAIL' || isError) {
      return { title: DEFAULT_NO_TICKET_MESSAGE };
    }

    return null;
  })();

  const waitingNumber = hasIssuedTicket
    ? toWaitingNumber(ticketInfo.ticket.ticket_number)
    : null;
  const isReceived = hasIssuedTicket && ticketInfo.ticket.status === 'USED';
  const isRefreshing = isFetching || isCounterFetching;
  const refreshAll = () => {
    void Promise.all([refetch(), refetchCounter()]);
  };

  return (
    <section className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <TicketPageHeader onRefresh={refreshAll} />

      <div className="pt-8">
        {isProcessingTicketIssue ? (
          <TicketStatusCard
            variant="pending"
            title="팔찌 발급 처리 중입니다"
            description="잠시만 기다려주세요."
            actionLabel={isRefreshing ? '새로고침 중...' : '새로고침'}
            actionDisabled={isRefreshing}
            onAction={refreshAll}
          />
        ) : isPending ? (
          <TicketStatusCard variant="pending" title="티켓 정보를 불러오는 중입니다." />
        ) : noTicketState ? (
          <TicketStatusCard
            variant="error"
            title={noTicketState.title}
            description={noTicketState.description}
            actionLabel="확인"
            onAction={() => navigate('/ticket')}
          />
        ) : (
          <TicketBoardingPassCard waitingNumber={waitingNumber} isReceived={isReceived} />
        )}
      </div>

      <div className="pt-8">
        <TicketInfoListCard title="항대존 안내" items={TICKET_INFO_ITEMS} />
      </div>
    </section>
  );
};

export default MyTicketPage;
