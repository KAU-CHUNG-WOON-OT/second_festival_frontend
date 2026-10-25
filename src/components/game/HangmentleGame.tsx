import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import CategoryList from '../common/CategoryList';
import HangmentleEvent from './hangmentle/HangmentleEvent';
import HangmentlePractice from './hangmentle/HangmentlePractice';
import { HANGMENTLE_PUZZLE_COUNT } from '@/data/hangmentleData';
import { HANGMENTLE_EVENT_ROUNDS, type HangmentleEventRound } from '@/data/hangmentleEvent';

type HangmentleTab =
  | { id: string; label: string; labelEn: string; kind: 'practice'; puzzleNo: number }
  | { id: string; label: string; labelEn: string; kind: 'event'; event: HangmentleEventRound };

// 연습 문제(브라우저에서 채점, 랭킹 없음) 다음에 이벤트 회차(서버 채점, 랭킹)
const TABS: HangmentleTab[] = [
  ...Array.from({ length: HANGMENTLE_PUZZLE_COUNT }, (_, i) => ({
    id: `practice-${i + 1}`,
    label: `연습 ${i + 1}`,
    labelEn: `Practice ${i + 1}`,
    kind: 'practice' as const,
    puzzleNo: i + 1,
  })),
  ...HANGMENTLE_EVENT_ROUNDS.map((event) => ({
    id: `event-${event.round}`,
    label: event.label,
    labelEn: event.labelEn,
    kind: 'event' as const,
    event,
  })),
];
// 처음 들어오면 10시 이벤트 회차
const DEFAULT_TAB_ID = `event-${HANGMENTLE_EVENT_ROUNDS[0].round}`;

const HangmentleGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const [tabId, setTabId] = useState(DEFAULT_TAB_ID);
  const tab = TABS.find((t) => t.id === tabId) ?? TABS[0];
  const tabLabel = (t: HangmentleTab) => (isEng ? t.labelEn : t.label);

  return (
    <div className="flex flex-col gap-6">
      <p className="font-body-kr text-[14px] leading-5 text-paper/80">
        {isEng
          ? 'Guess the secret Korean word. Each guess shows how close its meaning is — use the scores as clues.'
          : '정답 단어와 뜻이 얼마나 가까운지 유사도(%)로 알려 줘요. 유사도가 높은 단어를 실마리 삼아 정답을 찾아보세요.'}
      </p>

      <CategoryList
        categories={TABS.map(tabLabel)}
        selectedCategory={tabLabel(tab)}
        onSelect={(label) =>
          setTabId(TABS.find((t) => tabLabel(t) === label)?.id ?? DEFAULT_TAB_ID)
        }
      />

      {/* 탭마다 새로 그려 입력창·강조 줄·불러온 순위가 다른 문제로 넘어가지 않게 한다 */}
      {tab.kind === 'practice' ? (
        <HangmentlePractice key={tab.id} puzzleNo={tab.puzzleNo} />
      ) : (
        <HangmentleEvent key={tab.id} event={tab.event} />
      )}

      <p className="text-center font-body-kr text-[11px] leading-4 text-ink/50">
        {isEng ? 'Word similarity' : '단어 유사도'}: fastText Korean vectors (CC BY-SA 3.0)
      </p>
    </div>
  );
};

export default HangmentleGame;
