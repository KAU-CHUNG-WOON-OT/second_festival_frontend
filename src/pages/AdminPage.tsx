import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiLogOut, FiRefreshCw } from 'react-icons/fi';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import EmptyState from '../components/common/EmptyState';
import CongestionBadge from '../components/stores/CongestionBadge';
import { useServerNowAt, useServerNowEvery } from '../hooks/useServerNow';
import { useStoreCongestion } from '../hooks/useStoreCongestion';
import { ApiError } from '../lib/apiClient';
import {
  adminSessionExpiresMs,
  clearAdminSession,
  getAdminSession,
  type AdminSession,
} from '../lib/adminSession';
import {
  fetchAdminSession,
  storeCongestionKey,
  updateStoreCongestion,
} from '../lib/api/storeCongestion';
import { parseServerTime } from '../data/hangmentleClock';
import { storeEvents, type StoreEvent } from '../data/storeEventData';
import {
  CONGESTION_INFO,
  CONGESTION_LEVELS,
  congestionOf,
  formatSeoulClock,
  formatUpdatedAgo,
  patchStoreCongestion,
  type CongestionLevel,
  type StoreCongestion,
  type StoreCongestionOverview,
} from '../data/storeCongestion';
import type { AdminLoginState } from './AdminLoginPage';

const EXPIRED_NOTICE: AdminLoginState = { notice: '로그인이 만료됐어요. 다시 로그인해 주세요.' };
const isUnauthorized = (error: unknown) => error instanceof ApiError && error.status === 401;

const updateErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.status === 404) return '등록되지 않은 가게예요. 서버 설정을 확인해 주세요.';
    if (error.status === 400) return '잘못된 값이에요. 다시 눌러 주세요.';
    return '바꾸지 못했어요. 다시 눌러 주세요.';
  }
  return '연결이 불안정해 바꾸지 못했어요. 다시 눌러 주세요.';
};

interface StoreAdminCardProps {
  store: StoreEvent;
  index: number;
  entry: StoreCongestion | null;
  ready: boolean;
  token: string;
  now: number;
  onExpired: () => void;
}

// 가게 하나: 지금 단계 · 마지막 변경 시각 · 단계 버튼(여유/보통/혼잡/만석) · 현황 지우기.
// 누르는 즉시 화면에 반영하고(낙관적 갱신), 서버가 거절하면 이 가게 값만 되돌린다
const StoreAdminCard = ({
  store,
  index,
  entry,
  ready,
  token,
  now,
  onExpired,
}: StoreAdminCardProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const level = entry?.level ?? null;
  const updatedMs = parseServerTime(entry?.updatedAt);

  const mutation = useMutation({
    mutationFn: (next: CongestionLevel | null) => updateStoreCongestion(token, store.id, next),
    onMutate: async (next) => {
      setError(null);
      // 받아 오던 목록이 낙관적 값을 덮어쓰지 않게 멈춘다
      await queryClient.cancelQueries({ queryKey: storeCongestionKey });
      const overview = queryClient.getQueryData<StoreCongestionOverview>(storeCongestionKey);
      const previous = congestionOf(overview, store.id) ?? {
        storeId: store.id,
        level: null,
        updatedAt: null,
      };
      queryClient.setQueryData<StoreCongestionOverview>(storeCongestionKey, (old) =>
        patchStoreCongestion(old, { ...previous, level: next }),
      );
      return { previous };
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<StoreCongestionOverview>(storeCongestionKey, (old) =>
        patchStoreCongestion(old, saved),
      );
    },
    onError: (err, _next, context) => {
      // 다른 가게를 바꾸는 중일 수 있으니 이 가게 값만 되돌린다
      if (context) {
        queryClient.setQueryData<StoreCongestionOverview>(storeCongestionKey, (old) =>
          patchStoreCongestion(old, context.previous),
        );
      }
      if (isUnauthorized(err)) {
        onExpired();
        return;
      }
      setError(updateErrorMessage(err));
    },
  });

  const disabled = !ready || mutation.isPending;

  return (
    <article className="relative overflow-clip rounded-[16px] border-2 border-ink bg-paper text-ink shadow-[5px_5px_0px_0px_var(--color-ink)]">
      <header className="flex items-start justify-between gap-3 px-5 pb-4 pt-4">
        <div className="min-w-0">
          <p className="font-typewriter text-[12px] leading-4 opacity-60">
            STORE {String(index + 1).padStart(2, '0')} · #{store.id}
          </p>
          <h2 className="pt-1 font-display text-[24px] leading-[30px]">{store.name}</h2>
        </div>
        {level ? (
          <span className="pt-[2px]">
            <CongestionBadge level={level} isEng={false} />
          </span>
        ) : (
          <span className="mt-[2px] shrink-0 rounded-full border border-dashed border-ink/50 px-3 py-[3px] font-body-kr text-[13px] font-bold leading-4 text-ink/50">
            미등록
          </span>
        )}
      </header>

      <div className="relative border-t border-dashed border-ink/50 px-5 pb-5 pt-4">
        <span className="absolute -left-[10px] -top-[10px] size-5 rounded-full border border-ink bg-cream" />
        <span className="absolute -right-[10px] -top-[10px] size-5 rounded-full border border-ink bg-cream" />

        <p className="font-typewriter text-[12px] leading-4 opacity-70" aria-live="polite">
          {mutation.isPending
            ? '저장 중…'
            : updatedMs !== null
              ? `${formatUpdatedAgo(updatedMs, now, false)} · ${formatSeoulClock(updatedMs)}`
              : '아직 현황이 등록되지 않았어요'}
        </p>

        <div
          className="grid grid-cols-4 gap-2 pt-3"
          role="group"
          aria-label={`${store.name} 혼잡도`}
        >
          {CONGESTION_LEVELS.map((item) => {
            const selected = item === level;
            return (
              <button
                key={item}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => {
                  if (!selected) mutation.mutate(item);
                }}
                className={`h-12 rounded-[12px] border-2 border-ink font-display text-[17px] leading-6 transition-transform disabled:cursor-not-allowed ${
                  selected
                    ? `${CONGESTION_INFO[item].colorClass} translate-x-[2px] translate-y-[2px]`
                    : 'bg-cream text-ink drop-shadow-[3px_3px_0px_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50'
                }`}
              >
                {CONGESTION_INFO[item].label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={disabled || level === null}
          onClick={() => mutation.mutate(null)}
          className="mt-3 h-10 w-full rounded-full border border-dashed border-ink/60 font-body-kr text-[13px] font-semibold text-ink/80 active:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
        >
          현황 지우기
        </button>

        {error && (
          <p role="alert" className="pt-3 font-body-kr text-[13px] font-bold leading-5 text-rust">
            {error}
          </p>
        )}
      </div>
    </article>
  );
};

// 로그인을 확인한 뒤의 관리 화면
const AdminConsole = ({
  session,
  onLogout,
  onExpired,
}: {
  session: AdminSession;
  onLogout: () => void;
  onExpired: () => void;
}) => {
  const { data, isError, refetch, isFetching } = useStoreCongestion({ poll: false });
  const now = useServerNowEvery(15_000);
  const expiresMs = adminSessionExpiresMs(session);

  return (
    <>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-[16px] border-2 border-ink bg-paper px-4 py-3 text-ink drop-shadow-[4px_4px_0px_var(--color-ink)]">
        <div className="min-w-0">
          <p className="font-typewriter text-[11px] leading-4 opacity-60">SESSION</p>
          <p className="font-body-kr text-[14px] font-semibold leading-5">
            {expiresMs !== null ? `${formatSeoulClock(expiresMs)}까지 로그인 유지` : '로그인됨'}
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex h-10 shrink-0 items-center gap-2 rounded-full border-2 border-ink bg-ink px-4 font-body-kr text-[14px] font-semibold text-paper active:opacity-80"
        >
          <FiLogOut size={15} aria-hidden />
          로그아웃
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 pt-6 text-ink">
        <p className="font-typewriter text-[12px] leading-4 tracking-[3.6px]">STORES</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex h-9 items-center gap-[6px] rounded-full bg-paper px-4 font-body-kr text-[13px] font-semibold text-ink/80 active:opacity-80 disabled:opacity-50"
        >
          <FiRefreshCw
            size={14}
            aria-hidden
            className={isFetching ? 'animate-spin motion-reduce:animate-none' : ''}
          />
          새로고침
        </button>
      </div>

      {!data && isError && (
        <div className="pt-4">
          <EmptyState
            message="지금 현황을 불러오지 못했어요."
            action={{ label: '다시 불러오기', onClick: () => refetch() }}
          />
        </div>
      )}

      <div className="flex flex-col gap-5 pt-4">
        {storeEvents.map((store, index) => (
          <StoreAdminCard
            key={store.id}
            store={store}
            index={index}
            entry={congestionOf(data, store.id)}
            ready={Boolean(data)}
            token={session.token}
            now={now}
            onExpired={onExpired}
          />
        ))}
      </div>

      <p className="pt-6 font-body-kr text-[13px] leading-5 text-ink/70">
        손님 화면(가게 정보)은 30초마다 새로 받아요. 바꾼 뒤 손님 화면에 보이기까지 최대 30초 걸릴
        수 있어요.
      </p>
    </>
  );
};

// 관리자 화면: 가게별 실시간 혼잡도 바꾸기. 토큰이 없거나 만료됐거나 서버가 401이면 로그인으로.
// 예전 공연 상태(동아리) 관리 화면은 백엔드가 없어 이 화면으로 바꿨다
const AdminPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // 처음 그릴 때 한 번 읽는다 (로그아웃·만료 때는 아래에서 지우고 로그인으로 보냄)
  const [session] = useState(() => getAdminSession());
  const expiresMs = session ? adminSessionExpiresMs(session) : null;
  // 만료 시각을 지나는 순간 다시 그린다
  const now = useServerNowAt([expiresMs]);

  const sessionQuery = useQuery({
    queryKey: ['admin', 'session'],
    queryFn: () => fetchAdminSession(session!.token),
    enabled: session !== null,
    retry: (count, error) => !isUnauthorized(error) && count < 1,
    staleTime: 0,
    gcTime: 0,
  });

  const leave = (state?: AdminLoginState) => {
    clearAdminSession();
    queryClient.removeQueries({ queryKey: ['admin'] });
    navigate('/admin/login', { replace: true, state });
  };

  const expired =
    !session || expiresMs === null || now >= expiresMs || isUnauthorized(sessionQuery.error);
  if (expired) {
    clearAdminSession();
    return <Navigate to="/admin/login" replace state={session ? EXPIRED_NOTICE : undefined} />;
  }

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader />
      <RetroPageTitle title="관리자" caption="LIVE STATUS · STAFF" />
      <p className="pt-3 font-body-kr text-[14px] leading-5 text-paper/80">
        버튼을 누르면 가게 정보 화면의 실시간 현황이 바뀌어요.
      </p>

      {sessionQuery.isPending ? (
        <div className="mt-6 rounded-[16px] border-2 border-ink bg-paper px-5 py-8 text-center font-body-kr text-[15px] font-semibold text-ink/70 drop-shadow-[5px_5px_0px_var(--color-ink)]">
          로그인을 확인하고 있어요…
        </div>
      ) : sessionQuery.isError ? (
        <div className="pt-6">
          <EmptyState
            message="로그인을 확인하지 못했어요. 연결을 확인해 주세요."
            action={{ label: '다시 시도', onClick: () => sessionQuery.refetch() }}
          />
        </div>
      ) : (
        <AdminConsole
          session={session}
          onLogout={() => leave()}
          onExpired={() => leave(EXPIRED_NOTICE)}
        />
      )}
    </div>
  );
};

export default AdminPage;
