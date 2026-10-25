import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';
import CategoryList from '../../common/CategoryList';
import HangmentlePractice from './HangmentlePractice';
import { useEventRoundPhases, useRoundOpenedHere } from './useEventRounds';
import { HANGMENTLE_PUZZLE_COUNT } from '@/data/hangmentleData';
import { findEventRound, type HangmentleEventRound } from '@/data/hangmentleEvent';
import type { HangmentleRoundsOverview } from '@/lib/api/hangmentle';

const PUZZLE_NOS = Array.from({ length: HANGMENTLE_PUZZLE_COUNT }, (_, i) => i + 1);

interface RoundOpenBannerProps {
  event: HangmentleEventRound;
  onJoin: () => void;
  onClose: () => void;
}

// 연습 중에 이벤트 문제가 열리면 화면 아래에 띄우는 안내 (풀던 연습 문제는 그대로 둔다).
// 페이지 본문은 푸터보다 아래 층이라 body에 바로 그려야 푸터 위에 보인다
const RoundOpenBanner = ({ event, onJoin, onClose }: RoundOpenBannerProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-5 pb-[max(20px,env(safe-area-inset-bottom))]">
      <div
        role="status"
        className="pointer-events-auto flex w-full max-w-[390px] items-center gap-3 rounded-[16px] border-2 border-ink bg-mustard py-3 pl-4 pr-2 text-ink drop-shadow-[5px_5px_0px_var(--color-ink)]"
      >
        <div className="min-w-0 flex-1">
          <p className="font-typewriter text-[11px] leading-4 opacity-70">EVENT OPEN</p>
          <p className="font-display text-[18px] leading-6">
            {isEng ? `The ${event.titleEn} is open!` : `${event.title}가 열렸어요`}
          </p>
        </div>
        <button
          type="button"
          onClick={onJoin}
          className="h-10 shrink-0 rounded-full border-2 border-ink bg-rust px-4 font-display text-[15px] text-paper drop-shadow-[3px_3px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
        >
          {isEng ? 'Join' : '참여하기'}
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={isEng ? 'Close' : '닫기'}
          className="flex size-9 shrink-0 items-center justify-center rounded-full active:bg-ink/10"
        >
          <FiX size={18} aria-hidden />
        </button>
      </div>
    </div>,
    document.body,
  );
};

interface HangmentlePracticeViewProps {
  overview: HangmentleRoundsOverview | undefined;
  puzzleNo: number;
  onSelectPuzzle: (puzzleNo: number) => void;
  onOpenRound: (round: number) => void;
}

// 연습 화면: 연습 1·2 (브라우저에서 채점, 이벤트 API는 부르지 않음). 보는 동안 이벤트 문제가 열리면 안내만 띄운다
// (회차 요약은 HangmentleGame이 회차가 열리기 5분 전부터 열릴 때까지만 받아 넘겨 준다)
const HangmentlePracticeView = ({
  overview,
  puzzleNo,
  onSelectPuzzle,
  onOpenRound,
}: HangmentlePracticeViewProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const label = (no: number) => (isEng ? `Practice ${no}` : `연습 ${no}`);

  const [dismissed, setDismissed] = useState<number[]>([]);
  const openedHere = useRoundOpenedHere(useEventRoundPhases(overview), dismissed);
  const openedEvent = openedHere === null ? null : findEventRound(openedHere);

  return (
    <>
      <p className="font-body-kr text-[14px] leading-5 text-paper/80">
        {isEng
          ? 'Practice puzzles for anyone, no login needed. Each guess shows how close its meaning is — use the scores as clues.'
          : '로그인 없이 누구나 풀 수 있는 연습 문제예요. 유사도가 높은 단어를 실마리 삼아 정답을 찾아보세요.'}
      </p>

      <CategoryList
        categories={PUZZLE_NOS.map(label)}
        selectedCategory={label(puzzleNo)}
        onSelect={(selected) => onSelectPuzzle(PUZZLE_NOS.find((no) => label(no) === selected) ?? 1)}
      />

      {/* 문제마다 새로 그려 입력창·강조 줄이 다른 문제로 넘어가지 않게 한다 */}
      <HangmentlePractice key={puzzleNo} puzzleNo={puzzleNo} />

      {openedEvent && (
        <RoundOpenBanner
          event={openedEvent}
          onJoin={() => onOpenRound(openedEvent.round)}
          onClose={() => setDismissed((prev) => [...prev, openedEvent.round])}
        />
      )}
    </>
  );
};

export default HangmentlePracticeView;
