import { useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';
import { SECONDARY_BUTTON } from '../gameStyles';
import HangmentleIntro from './HangmentleIntro';
import CountdownText from './HangmentleCountdown';
import { useEventRoundPhases, useRoundOpenedHere } from './useEventRounds';
import { formatOpensAt, parseServerTime } from '@/data/hangmentleClock';
import {
  HANGMENTLE_EVENT_ROUNDS,
  type HangmentleEventRound,
  type RoundPhase,
} from '@/data/hangmentleEvent';
import type { HangmentleRoundInfo, HangmentleRoundsOverview } from '@/lib/api/hangmentle';

interface EventRoundCardProps {
  event: HangmentleEventRound;
  info: HangmentleRoundInfo | null;
  phase: RoundPhase | null;
  // 회차 요약을 아직 받는 중 / 받지 못함
  loading: boolean;
  failed: boolean;
  onOpen: () => void;
}

// 회차 카드: 열리기 전에는 남은 시간, 열리면 '진행 중'과 참여하기. 카드 어디를 눌러도 그 회차 화면으로 간다
const EventRoundCard = ({ event, info, phase, loading, failed, onOpen }: EventRoundCardProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const opensAtMs = parseServerTime(info?.opensAt ?? event.scheduledAt);

  const note = (text: string) => (
    <span className="font-body-kr text-[14px] font-semibold leading-5 opacity-70">{text}</span>
  );

  const status = () => {
    if (phase === null) {
      if (loading) return note(isEng ? 'Loading…' : '불러오는 중이에요…');
      if (failed) return note(isEng ? 'Could not load the time' : '시간을 불러오지 못했어요');
      return note(isEng ? 'Not open yet' : '아직 열리지 않았어요');
    }
    if (phase === 'countdown' && opensAtMs !== null) {
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
          <span className="flex h-10 items-center rounded-full border-2 border-ink bg-rust px-5 font-display text-[16px] text-paper drop-shadow-[3px_3px_0px_var(--color-ink)]">
            {isEng ? 'Join' : '참여하기'}
          </span>
        </>
      );
    }
    if (phase === 'opening') return note(isEng ? 'Opening soon…' : '곧 열려요');
    if (phase === 'notReady') {
      return note(isEng ? 'The puzzle is being prepared' : '문제를 준비하고 있어요');
    }
    return note(isEng ? 'Not open yet' : '아직 열리지 않았어요');
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-[16px] border-2 border-ink bg-paper text-left text-ink drop-shadow-[5px_5px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
    >
      <span className="flex items-center gap-4 px-5 pb-4 pt-5">
        <span className="shrink-0 rounded-[4px] border border-current px-[6px] font-typewriter text-[12px] leading-4">
          EVENT {String(event.round).padStart(2, '0')}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[24px] leading-[30px]">
            {isEng ? event.titleEn : event.title}
          </span>
          {opensAtMs !== null && (
            <span className="block pt-1 font-body-kr text-[14px] leading-5 opacity-70">
              {formatOpensAt(opensAtMs, isEng)}
            </span>
          )}
        </span>
        <FiChevronRight size={20} aria-hidden className="shrink-0 opacity-60" />
      </span>
      <span className="flex min-h-16 items-center justify-between gap-3 border-t border-dashed border-ink/50 px-5 py-3">
        {status()}
      </span>
    </button>
  );
};

interface HangmentleHubProps {
  overview: HangmentleRoundsOverview | undefined;
  overviewFailed: boolean;
  onRetryOverview: () => void;
  // auto: 보고 있는 동안 열려서 저절로 넘어가는 경우
  onOpenRound: (round: number, auto: boolean) => void;
  onPractice: () => void;
}

// 항멘틀 첫 화면(이벤트 안내): 설명 카드 · 10시·11시 문제 카드 · 연습하러 가기
const HangmentleHub = ({
  overview,
  overviewFailed,
  onRetryOverview,
  onOpenRound,
  onPractice,
}: HangmentleHubProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const phases = useEventRoundPhases(overview);
  // 이 화면을 보는 동안 문제가 열리면 그 문제 화면으로 데려간다
  const openedHere = useRoundOpenedHere(phases);
  useEffect(() => {
    if (openedHere !== null) onOpenRound(openedHere, true);
  }, [openedHere, onOpenRound]);

  return (
    <>
      <HangmentleIntro />

      <div className="flex flex-col gap-4">
        {HANGMENTLE_EVENT_ROUNDS.map((event, i) => (
          <EventRoundCard
            key={event.round}
            event={event}
            info={phases[i].info}
            phase={phases[i].phase}
            loading={!overview && !overviewFailed}
            failed={overviewFailed}
            onOpen={() => onOpenRound(event.round, false)}
          />
        ))}
        {overviewFailed && !overview && (
          <button
            type="button"
            onClick={onRetryOverview}
            className="h-10 w-full rounded-full bg-paper font-body-kr text-[14px] font-semibold text-ink active:opacity-80"
          >
            {isEng ? 'Reload the schedule' : '시간 다시 불러오기'}
          </button>
        )}
      </div>

      <button type="button" onClick={onPractice} className={SECONDARY_BUTTON}>
        {isEng ? 'Go Practice' : '연습하러 가기'}
      </button>
    </>
  );
};

export default HangmentleHub;
