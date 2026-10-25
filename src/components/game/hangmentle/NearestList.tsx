import { useLanguage } from '@/contexts/LanguageContext';
import { GAME_CARD, SECONDARY_BUTTON } from '../gameStyles';
import { HANGMENTLE_TOP_RANK, type HangmentleNeighbor } from '@/data/hangmentleData';

interface NearestListProps {
  // 맨 위에 보여 줄 정답 (모르면 null: 다른 기기에서 맞혀 이 기기에 기록이 없을 때)
  answer: string | null;
  neighbors: HangmentleNeighbor[];
  // 지금까지 보여 주기로 한 개수. HANGMENTLE_TOP_RANK보다 적으면 '더 보기'가 보인다
  count: number;
  onMore: () => void;
  guessedWords: Set<string>;
  showScore: (similarity: number) => string;
  // 서버에서 불러오는 경우의 상태
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

// 정답을 맞힌 뒤 보여 주는 유사도 순위 (정답과 가까운 단어 1000개)
const NearestList = ({
  answer,
  neighbors,
  count,
  onMore,
  guessedWords,
  showScore,
  loading = false,
  error = false,
  onRetry,
}: NearestListProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const rows = [...(answer ? [{ word: answer, similarity: 10000, rank: 0 }] : []), ...neighbors];

  return (
    <section className={GAME_CARD}>
      <p className="font-typewriter text-[12px] leading-4 opacity-60">
        {isEng ? 'SIMILARITY RANKING' : '유사도 순위'}
      </p>
      <ul className="pt-2">
        {rows.map((neighbor) => (
          <li
            key={neighbor.word}
            className={`flex items-center gap-3 border-b border-dashed border-ink/30 py-2 last:border-b-0 ${
              guessedWords.has(neighbor.word)
                ? '-mx-2 rounded-[8px] border-b-0 bg-mustard/30 px-2'
                : ''
            }`}
          >
            <span
              className={`w-10 shrink-0 font-typewriter text-[12px] leading-4 ${
                neighbor.rank === 0 ? 'font-bold text-rust' : 'opacity-50'
              }`}
            >
              {neighbor.rank === 0 ? (isEng ? 'ANS' : '정답') : neighbor.rank}
            </span>
            <span className="min-w-0 flex-1 truncate font-display text-[16px] leading-6">
              {neighbor.word}
            </span>
            <span className="shrink-0 font-condensed text-[15px] font-bold leading-6">
              {showScore(neighbor.similarity)}
            </span>
          </li>
        ))}
      </ul>
      {loading && (
        <p className="py-3 text-center font-body-kr text-[14px] font-semibold opacity-60">
          {isEng ? 'Loading…' : '불러오는 중입니다…'}
        </p>
      )}
      {error && !loading && (
        <div className="pt-3 text-center">
          <p className="font-body-kr text-[14px] font-semibold opacity-70">
            {isEng ? 'Could not load the ranking.' : '유사도 순위를 불러오지 못했습니다.'}
          </p>
          {onRetry && (
            <button type="button" onClick={onRetry} className={`${SECONDARY_BUTTON} mt-3`}>
              {isEng ? 'Try Again' : '다시 시도'}
            </button>
          )}
        </div>
      )}
      {!loading && !error && count < HANGMENTLE_TOP_RANK && neighbors.length >= count && (
        <button
          type="button"
          onClick={onMore}
          className="mt-3 h-10 w-full rounded-full border border-ink/20 font-body-kr text-[14px] font-semibold active:bg-ink/5"
        >
          {isEng ? 'Show more' : `더 보기 (${count}/${HANGMENTLE_TOP_RANK})`}
        </button>
      )}
      <p className="pt-3 font-body-kr text-[12px] leading-4 opacity-60">
        {isEng ? 'Highlighted words are ones you guessed.' : '노란 줄은 내가 입력한 단어예요.'}
      </p>
    </section>
  );
};

export default NearestList;
