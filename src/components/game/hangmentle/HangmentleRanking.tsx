import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { GAME_CARD } from '../gameStyles';
import { fetchHangmentleRankings, hangmentleEventKeys } from '@/lib/api/hangmentle';
import { HANGMENTLE_RANKING_SIZE, formatKstTime } from '@/data/hangmentleEvent';

// 이벤트 탭을 보고 있는 동안 랭킹을 다시 받아 오는 간격 (화면이 꺼져 있거나 다른 탭이면 멈춘다)
const RANKING_REFRESH_MS = 30_000;

interface HangmentleRankingProps {
  round: number;
  // 탭 이름 (10시)
  label: string;
  // 내가 맞힌 순서. 랭킹 안이면 그 줄을 강조한다
  myRank: number | null;
}

// 이벤트 회차 랭킹: 먼저 맞힌 10명 (가린 이름·학과·맞힌 시각)
const HangmentleRanking = ({ round, label, myRank }: HangmentleRankingProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const rankingQuery = useQuery({
    queryKey: hangmentleEventKeys.rankings(round),
    queryFn: () => fetchHangmentleRankings(round),
    refetchInterval: RANKING_REFRESH_MS,
  });
  const entries = rankingQuery.data;

  const status = (text: string) => (
    <p className="py-4 text-center font-body-kr text-[14px] font-semibold opacity-60">{text}</p>
  );

  return (
    <section className={GAME_CARD} aria-live="polite">
      <p className="font-typewriter text-[12px] leading-4 opacity-60">
        {isEng ? 'FIRST TO SOLVE' : 'RANKING · 먼저 맞힌 순'}
      </p>
      <h2 className="pt-1 font-display text-[20px] leading-7">
        {isEng
          ? `${label} TOP ${HANGMENTLE_RANKING_SIZE}`
          : `${label} 랭킹 TOP ${HANGMENTLE_RANKING_SIZE}`}
      </h2>

      {entries === undefined ? (
        rankingQuery.isError ? (
          <div className="pt-2 text-center">
            {status(isEng ? 'Could not load the ranking.' : '랭킹을 불러오지 못했어요.')}
            <button
              type="button"
              onClick={() => rankingQuery.refetch()}
              className="h-10 w-full rounded-full border border-ink/20 font-body-kr text-[14px] font-semibold active:bg-ink/5"
            >
              {isEng ? 'Try Again' : '다시 시도'}
            </button>
          </div>
        ) : (
          status(isEng ? 'Loading…' : '랭킹을 불러오는 중이에요…')
        )
      ) : entries.length === 0 ? (
        status(isEng ? 'No one has solved it yet.' : '아직 맞힌 사람이 없어요')
      ) : (
        <ol className="pt-2">
          {entries.map((entry) => {
            const isMine = myRank !== null && entry.rank === myRank;
            return (
              <li
                key={entry.rank}
                aria-current={isMine ? 'true' : undefined}
                className={`flex items-center gap-3 border-b border-dashed border-ink/30 py-2 last:border-b-0 ${
                  isMine ? '-mx-2 rounded-[8px] border-b-0 bg-mustard/30 px-2' : ''
                }`}
              >
                <span
                  className={`w-7 shrink-0 font-condensed text-[20px] font-bold leading-6 ${
                    entry.rank <= 3 ? 'text-rust' : 'opacity-60'
                  }`}
                >
                  {entry.rank}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-display text-[16px] leading-6">
                      {entry.displayName}
                    </span>
                    {isMine && (
                      <span className="shrink-0 rounded-full border border-ink bg-rust px-2 font-typewriter text-[10px] font-bold leading-4 text-paper">
                        ME
                      </span>
                    )}
                  </span>
                  {entry.department && (
                    <span className="truncate font-body-kr text-[12px] leading-4 opacity-60">
                      {entry.department}
                    </span>
                  )}
                </span>
                <span className="shrink-0 font-condensed text-[16px] font-bold leading-6">
                  {formatKstTime(entry.solvedAt)}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <p className="pt-3 font-body-kr text-[12px] leading-4 opacity-60">
        {isEng
          ? 'Times are KST. Refreshes every 30 seconds.'
          : '맞힌 시각 기준이에요. 30초마다 새로 고쳐요.'}
      </p>
    </section>
  );
};

export default HangmentleRanking;
