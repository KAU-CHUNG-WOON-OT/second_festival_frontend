import { useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsLogin } from '@/hooks/useIsLogin';
import { useServerNowAt } from '@/hooks/useServerNow';
import RetroDialog from '@/components/common/RetroDialog';
import { SECONDARY_BUTTON } from '../gameStyles';
import HangmentleIntro from './HangmentleIntro';
import CountdownText from './HangmentleCountdown';
import { KakaoLoginButton } from './HangmentleLogin';
import { useEventRoundPhases, useRoundOpenedHere } from './useEventRounds';
import { formatOpensAt, parseServerTime } from '@/data/hangmentleClock';
import {
  HANGMENTLE_HUB_ROUNDS,
  type HangmentleEventRound,
  type RoundPhase,
} from '@/data/hangmentleEvent';
import type { HangmentleRoundInfo, HangmentleRoundsOverview } from '@/lib/api/hangmentle';

interface EventRoundCardProps {
  event: HangmentleEventRound;
  info: HangmentleRoundInfo | null;
  phase: RoundPhase | null;
  // 회차 요약을 받았는지 (못 받았으면 예정 시각과 기기 시계로 센다)
  loaded: boolean;
  isLogin: boolean;
  onOpen: () => void;
  onNeedLogin: () => void;
}

// 회차 카드: 열리기 전에는 남은 시간을 실시간으로, 열리면 '진행 중'과 참여하기.
// 로그인하지 않았으면 누를 때 로그인을 부탁하고, 로그인했으면 열린 뒤(또는 끝난 뒤)에만 회차 화면으로 간다.
// 열리기 전에 눌러도 따로 안내하지 않는다 (보고 있으면 열리는 순간 저절로 넘어간다)
const EventRoundCard = ({ event, info, phase, loaded, isLogin, onOpen, onNeedLogin }: EventRoundCardProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  // 예정 시각은 회차 요약을 받기 전(또는 못 받았을 때)에만 쓴다. 받은 뒤에는 서버 값만 (비어 있으면 시간을 준비하는 중)
  const opensAtMs = parseServerTime(loaded ? info?.opensAt : event.scheduledAt);
  // 열릴 시각을 지나는 순간 다시 그린다 (요약을 못 받았을 때 카운트다운을 '곧 열려요'로)
  const now = useServerNowAt([opensAtMs]);
  const waiting = opensAtMs !== null && now < opensAtMs;

  // 요약을 못 받았는데 예정 시각이 지났으면 들어가 보게 한다 (회차 화면이 직접 상태를 받는다)
  const canEnter = phase === 'open' || phase === 'closed' || (phase === null && !waiting);
  const action = !isLogin ? onNeedLogin : canEnter ? onOpen : null;

  const note = (text: string) => (
    <span className="font-body-kr text-[14px] font-semibold leading-5 opacity-70">{text}</span>
  );

  const status = () => {
    if (info && !info.open && opensAtMs === null) {
      return note(isEng ? 'Time to be announced' : '시간 준비 중.');
    }
    if ((phase === 'countdown' || phase === null) && waiting) {
      return (
        <>
          <span className="font-body-kr text-[13px] font-semibold leading-5 opacity-60">
            {isEng ? 'Starts in' : '시작까지'}
          </span>
          <CountdownText
            targetMs={opensAtMs}
            className="font-condensed text-[28px] font-bold leading-8"
          />
        </>
      );
    }
    if (phase === 'open') {
      return (
        <>
          <span className="flex items-center gap-1.5 rounded-full bg-rust px-3 py-[3px] font-body-kr text-[12px] font-bold leading-4 text-paper">
            <span
              aria-hidden
              className="size-1.5 animate-pulse rounded-full bg-paper motion-reduce:animate-none"
            />
            {isEng ? 'LIVE' : '진행 중'}
          </span>
          <span className="flex h-10 items-center rounded-full border-2 border-ink bg-rust px-5 font-display text-[16px] text-paper shadow-[3px_3px_0px_0px_var(--color-ink)]">
            {isEng ? 'Join' : '참여하기'}
          </span>
        </>
      );
    }
    if (phase === 'opening' || phase === null) return note(isEng ? 'Opening soon…' : '곧 열려요.');
    if (phase === 'notReady') {
      return note(isEng ? 'The puzzle is being prepared' : '문제 준비 중.');
    }
    return note(isEng ? 'Not open yet' : '아직 열리지 않았습니다.');
  };

  const body = (
    <>
      <span className="flex items-center gap-4 px-5 pb-4 pt-5">
        {event.test ? (
          <span className="shrink-0 rounded-[4px] border border-rust bg-rust px-[6px] font-typewriter text-[12px] font-bold leading-4 text-paper">
            TEST
          </span>
        ) : (
          <span className="shrink-0 rounded-[4px] border border-current px-[6px] font-typewriter text-[12px] leading-4">
            EVENT {String(event.round).padStart(2, '0')}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[24px] leading-[30px]">
            {isEng ? event.titleEn : event.title}
          </span>
          {!event.test && opensAtMs !== null && (
            <span className="block pt-1 font-body-kr text-[14px] leading-5 opacity-70">
              {formatOpensAt(opensAtMs, isEng)}
            </span>
          )}
        </span>
        {action && <FiChevronRight size={20} aria-hidden className="shrink-0 opacity-60" />}
      </span>
      <span className="flex min-h-16 items-center justify-between gap-3 border-t border-dashed border-ink/50 px-5 py-3">
        {status()}
      </span>
    </>
  );

  const card = 'block w-full rounded-[16px] border-2 border-ink bg-paper text-left text-ink shadow-[5px_5px_0px_0px_var(--color-ink)]';
  // 누를 일이 없으면 버튼이 아닌 그냥 카드
  if (!action) return <div className={card}>{body}</div>;
  return (
    <button
      type="button"
      onClick={action}
      className={`${card} transition-transform active:translate-x-[2px] active:translate-y-[2px]`}
    >
      {body}
    </button>
  );
};

interface HangmentleHubProps {
  overview: HangmentleRoundsOverview | undefined;
  // auto: 보고 있는 동안 열려서 저절로 넘어가는 경우
  onOpenRound: (round: number, auto: boolean) => void;
  onPractice: () => void;
}

// 항멘틀 첫 화면(이벤트 안내): 테스트 문제 카드 · 설명 카드 · 연습하러 가기 · 10시·11시 문제 카드
const HangmentleHub = ({ overview, onOpenRound, onPractice }: HangmentleHubProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const isLogin = useIsLogin();
  // 비회원이 회차 카드를 눌렀을 때 띄우는 로그인 부탁
  const [loginFor, setLoginFor] = useState<HangmentleEventRound | null>(null);

  const phases = useEventRoundPhases(overview, HANGMENTLE_HUB_ROUNDS);
  // 이 화면을 보는 동안 문제가 열리면 그 문제 화면으로 데려간다
  const openedHere = useRoundOpenedHere(phases);
  useEffect(() => {
    if (openedHere !== null) onOpenRound(openedHere, true);
  }, [openedHere, onOpenRound]);

  const card = (event: HangmentleEventRound, i: number) => (
    <EventRoundCard
      key={event.round}
      event={event}
      info={phases[i].info}
      phase={phases[i].phase}
      loaded={!!overview}
      isLogin={isLogin}
      onOpen={() => onOpenRound(event.round, false)}
      onNeedLogin={() => setLoginFor(event)}
    />
  );

  return (
    <>
      {/* 테스트 문제는 화면 맨 위에 */}
      {HANGMENTLE_HUB_ROUNDS.map((event, i) => event.test && card(event, i))}

      <HangmentleIntro />

      <button type="button" onClick={onPractice} className={SECONDARY_BUTTON}>
        {isEng ? 'Go Practice' : '연습하러 가기'}
      </button>

      <div className="flex flex-col gap-4">
        {HANGMENTLE_HUB_ROUNDS.map((event, i) => !event.test && card(event, i))}
      </div>

      {loginFor && (
        <RetroDialog title={isEng ? 'LOGIN' : '로그인'} onClose={() => setLoginFor(null)}>
          <div className="px-1 pb-1 pt-2 text-center">
            <p className="font-display text-[20px] leading-7">
              {isEng ? 'Please log in first' : '로그인이 필요합니다.'}
            </p>
            <p className="pb-4 pt-2 font-body-kr text-[14px] leading-5 opacity-70">
              {isEng
                ? `Log in with Kakao to join the ${loginFor.titleEn}.`
                : `카카오로 로그인하면 ${loginFor.title}에 참여할 수 있어요.`}
            </p>
            <KakaoLoginButton source="hub" round={loginFor.round} />
          </div>
        </RetroDialog>
      )}
    </>
  );
};

export default HangmentleHub;
