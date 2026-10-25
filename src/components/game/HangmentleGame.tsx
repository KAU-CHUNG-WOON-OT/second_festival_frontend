import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { track } from '@/lib/mixpanel';
import HangmentleEvent from './hangmentle/HangmentleEvent';
import HangmentleHub from './hangmentle/HangmentleHub';
import HangmentlePracticeView from './hangmentle/HangmentlePracticeView';
import { useEventRoundsOverview } from './hangmentle/useEventRounds';
import { findEventRound } from '@/data/hangmentleEvent';
import {
  hangmentleViewKey,
  hangmentleViewParams,
  isCanonicalHangmentleView,
  parseHangmentleView,
  type HangmentleView,
} from '@/data/hangmentleView';

// 항멘틀: 이벤트 안내(설명·10시·11시 문제 카드) → 회차 화면(?round=1) / 연습 화면(?view=practice).
// 화면은 주소 쿼리로 바꿔 상단 뒤로가기·브라우저 뒤로가기가 그대로 된다.
// 직접 누르면 기록을 쌓고(push), 문제가 열려 저절로 넘어가거나 연습 문제만 바꿀 때는 바꿔치기(replace)
const HangmentleGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const [searchParams, setSearchParams] = useSearchParams();
  const view = parseHangmentleView(searchParams);
  const event = view.kind === 'round' ? findEventRound(view.round) : null;
  const rootRef = useRef<HTMLDivElement>(null);

  // 회차 요약 + 서버 시계 맞추기 (1분마다, 화면이 다시 보일 때)
  const overviewQuery = useEventRoundsOverview();

  const go = useCallback(
    (next: HangmentleView, replace = false) =>
      setSearchParams((prev) => hangmentleViewParams(next, prev), { replace }),
    [setSearchParams],
  );

  // 없는 회차(?round=9) 등 잘못된 주소는 맞는 주소로 바꿔치기
  useEffect(() => {
    if (!isCanonicalHangmentleView(searchParams)) {
      setSearchParams((prev) => hangmentleViewParams(parseHangmentleView(prev), prev), {
        replace: true,
      });
    }
  }, [searchParams, setSearchParams]);

  // 화면이 바뀌면 맨 위부터 보여 준다 (주소의 경로가 같아서 Layout이 스크롤을 건드리지 않는다)
  const viewKey = hangmentleViewKey(view);
  const shownViewKey = useRef(viewKey);
  useEffect(() => {
    if (shownViewKey.current === viewKey) return;
    shownViewKey.current = viewKey;
    rootRef.current?.closest('.overflow-y-auto')?.scrollTo(0, 0);
  }, [viewKey]);

  const openRound = useCallback(
    (round: number, auto: boolean, source: 'card' | 'auto' | 'banner') => {
      track('hangmentle_round_entered', { round, source });
      go({ kind: 'round', round }, auto);
    },
    [go],
  );
  const openRoundFromHub = useCallback(
    (round: number, auto: boolean) => openRound(round, auto, auto ? 'auto' : 'card'),
    [openRound],
  );

  return (
    <div ref={rootRef} className="flex flex-col gap-6">
      {view.kind === 'hub' && (
        <HangmentleHub
          overview={overviewQuery.data}
          overviewFailed={overviewQuery.isError}
          onRetryOverview={() => overviewQuery.refetch()}
          onOpenRound={openRoundFromHub}
          onPractice={() => {
            track('hangmentle_practice_opened');
            go({ kind: 'practice', puzzleNo: 1 });
          }}
        />
      )}

      {/* 회차마다 새로 그려 입력창·불러온 순위가 다른 회차로 넘어가지 않게 한다 */}
      {event && (
        <HangmentleEvent
          key={event.round}
          event={event}
          onShowHub={() => go({ kind: 'hub' }, true)}
        />
      )}

      {view.kind === 'practice' && (
        <HangmentlePracticeView
          overview={overviewQuery.data}
          puzzleNo={view.puzzleNo}
          onSelectPuzzle={(puzzleNo) => go({ kind: 'practice', puzzleNo }, true)}
          onOpenRound={(round) => openRound(round, false, 'banner')}
        />
      )}

      <p className="text-center font-body-kr text-[11px] leading-4 text-ink/50">
        {isEng ? 'Word similarity' : '단어 유사도'}: fastText Korean vectors (CC BY-SA 3.0)
      </p>
    </div>
  );
};

export default HangmentleGame;
