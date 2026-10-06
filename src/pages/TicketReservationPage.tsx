import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DayHeader from '@/components/common/DayHeader';
import TicketInfoListCard from '@/components/ticket/TicketInfoListCard';
import TicketReservationHero from '@/components/ticket/TicketReservationHero';
import TicketWaitingCompleteCard from '@/components/ticket/TicketWaitingCompleteCard';
import { fetchTicketCounter, fetchTicketExists, requestTicketReservation } from '@/lib/api/ticket';
import { fetchMyProfile } from '@/lib/api/user';
import { ApiError } from '@/lib/apiClient';
import { useIsLogin } from '@/hooks/useIsLogin';
import { useTicketCounterStream } from '@/hooks/useTicketCounterStream';
import { setTicketIssuePending } from '@/lib/ticketIssueSession';
import { useServerClock } from '@/hooks/useServerClock';
import type { StudentType } from '@/lib/userInfoStorage';
import { track } from '@/lib/mixpanel';

const TICKET_MAX_RESERVATION = 900;
const TICKET_RESERVATION_CLOSED = true;
const TICKET_OPEN_AT_MS_BY_TYPE: Record<StudentType, number> = {
  UNDERGRADUATE: Date.parse('2026-05-20T10:00:00+09:00'),
  ON_LEAVE: Date.parse('2026-05-20T12:00:00+09:00'),
  GRADUATE: Date.parse('2026-05-20T10:00:00+09:00'),
};
const TICKET_OPEN_LABEL_BY_TYPE: Record<StudentType, string> = {
  UNDERGRADUATE: '5월 20일 10시 오픈',
  ON_LEAVE: '5월 20일 12시 오픈',
  GRADUATE: '5월 20일 10시 오픈',
};
const DEFAULT_STUDENT_TYPE: StudentType = 'UNDERGRADUATE';
const COUNTDOWN_DISPLAY_THRESHOLD_MS = 24 * 60 * 60 * 1000;

const formatCountdown = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const TICKET_INFO_ITEMS: readonly string[] = [
  '항대존은 특별 공연 및 이벤트 구역입니다',
  '예약 시간: 05월 20일 10:00 ~ 15:00',
  '휴학생의 경우 12:00부터 예약 가능합니다',
  '1인 1회만 예약 가능합니다',
  '총학생회 청운 부스에서 팔찌를 수령 후 항대존 입장이 가능합니다',
];

type TicketFlowStep = 'reservation' | 'waiting';

const TicketReservationPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isLogin = useIsLogin();
  const { serverNowMs, syncError } = useServerClock();
  const [currentStep, setCurrentStep] = useState<TicketFlowStep>('reservation');
  // 더블클릭/연타 시 중복 mutate 방지용 동기 lock.
  // React state(isPending)는 비동기라 빠른 연타에 늦게 반영되어 race 가능.
  const reserveLockRef = useRef(false);

  // Initial fetch via REST; live updates pushed via SSE into the same cache.
  const { data: counterData } = useQuery({
    queryKey: ['ticket', 'counter'],
    queryFn: fetchTicketCounter,
    staleTime: 5000,
    placeholderData: keepPreviousData,
  });
  useTicketCounterStream();
  const currentReservation = counterData?.current_count ?? 0;

  const { data: existsData } = useQuery({
    queryKey: ['ticket', 'exists'],
    queryFn: fetchTicketExists,
    enabled: isLogin,
    staleTime: 5000,
  });
  const alreadyReserved = existsData?.exists === true;

  // studentType은 한 세션 동안 사실상 정적이라 영구 캐시. 새로고침 시 1회만 호출.
  const { data: myProfile } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: fetchMyProfile,
    enabled: isLogin,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  const userStudentType: StudentType = myProfile?.studentType ?? DEFAULT_STUDENT_TYPE;
  const ticketOpenAtMs = TICKET_OPEN_AT_MS_BY_TYPE[userStudentType];

  const hasServerTime = serverNowMs !== null;
  const isReservationOpen = hasServerTime && serverNowMs >= ticketOpenAtMs;
  const reserveDisabledByOpenTime = !isReservationOpen;
  const remainingMs =
    hasServerTime && reserveDisabledByOpenTime ? ticketOpenAtMs - serverNowMs : 0;
  const showCountdown =
    isLogin &&
    hasServerTime &&
    reserveDisabledByOpenTime &&
    remainingMs > 0 &&
    remainingMs <= COUNTDOWN_DISPLAY_THRESHOLD_MS;

  const reserveDisabledLabel = !isLogin
    ? '로그인이 필요합니다'
    : showCountdown
      ? `오픈까지 ${formatCountdown(remainingMs)}`
      : hasServerTime
        ? TICKET_OPEN_LABEL_BY_TYPE[userStudentType]
        : syncError
          ? '서버 시간 확인 실패 (재시도 중)'
          : '시간 동기화 중...';
  // 비로그인은 시간과 무관하게 항상 disabled 표시 (Kakao 로그인 유도)
  const reserveDisabledForUi = !isLogin || reserveDisabledByOpenTime;

  const handleKakaoLogin = useCallback(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (!apiBase) return;
    const trimmed = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    window.location.href = `${trimmed}/oauth2/authorization/kakao`;
  }, []);

  const reserveMutation = useMutation({
    mutationFn: requestTicketReservation,
    onSuccess: () => {
      track('ticket_reserved', { student_type: userStudentType });
      setTicketIssuePending();
      queryClient.invalidateQueries({ queryKey: ['ticket', 'counter'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', 'exists'] });
      setCurrentStep('waiting');
    },
    onError: (error) => {
      const status = error instanceof ApiError ? error.status : undefined;
      const code = error instanceof ApiError ? error.code : undefined;
      track('ticket_reserve_failed', {
        student_type: userStudentType,
        status,
        code,
        message: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof ApiError && error.status === 401) {
        // refresh interceptor가 이미 silent refresh를 시도한 뒤에도 401이면 사실상 로그아웃 상태
        handleKakaoLogin();
        return;
      }
      const message =
        error instanceof ApiError && error.message
          ? error.message
          : '예약 요청에 실패했습니다. 잠시 후 다시 시도해주세요.';
      window.alert(message);
    },
    onSettled: () => {
      reserveLockRef.current = false;
    },
  });

  const handleReserve = () => {
    if (reserveDisabledByOpenTime) return;
    track('ticket_reserve_clicked', {
      student_type: userStudentType,
      is_login: isLogin,
      already_reserved: alreadyReserved,
      current_reservation: currentReservation,
    });
    if (!isLogin) {
      handleKakaoLogin();
      return;
    }
    if (reserveLockRef.current || reserveMutation.isPending) return;
    reserveLockRef.current = true;
    reserveMutation.mutate();
  };

  return (
    <section className="relative flex min-h-[965px] w-full flex-col">
      <div className="relative z-10 flex min-h-[965px] w-full flex-col items-center px-[20px] pb-[24px]">
        <div className="w-full max-w-[361px]">
          <DayHeader selectedDay={1} onSelectDay={() => {}} showDayTabs={false} title="팔찌 안내" />

          <div className="mt-[44px] flex w-full justify-center">
            {currentStep === 'waiting' ? (
              <TicketWaitingCompleteCard
                estimatedWaitText="약 15분"
                onConfirm={() => navigate('/myticket')}
              />
            ) : (
              <div className="w-full">
                <TicketReservationHero
                  title="항대존 입장 팔찌"
                  subtitle="선착순 900명 한정"
                  currentReservation={currentReservation}
                  maxReservation={TICKET_MAX_RESERVATION}
                  ctaLabel={reserveMutation.isPending ? '예약 처리 중...' : '지금 예약하기'}
                  alreadyReserved={alreadyReserved}
                  reserveDisabled={TICKET_RESERVATION_CLOSED || reserveDisabledForUi}
                  reserveDisabledLabel={reserveDisabledLabel}
                  isClosed={TICKET_RESERVATION_CLOSED}
                  onReserve={handleReserve}
                />

                <div className="mt-[16px] flex flex-col gap-[16px]">
                  <TicketInfoListCard title="항대존 안내" items={TICKET_INFO_ITEMS} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default TicketReservationPage;
