import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiMusic } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import DayHeader from '../components/common/DayHeader';
import {
  fetchSingerVoteList,
  fetchVoteResults,
} from '../lib/api/maskedSinger';

interface RankedSinger {
  singerId: number;
  singerName: string;
  songName: string;
  voteCount: number;
}

const RANK_TAG_STYLE: Record<1 | 2 | 3, string> = {
  1: 'bg-[linear-gradient(180deg,#fbbf24_0%,#f59e0b_100%)]',
  2: 'bg-[linear-gradient(180deg,#cbd5e1_0%,#94a3b8_100%)]',
  3: 'bg-[linear-gradient(180deg,#fb923c_0%,#ea580c_100%)]',
};

interface RankCardProps {
  rank: 1 | 2 | 3;
  singer: RankedSinger;
}

const RankCard = ({ rank, singer }: RankCardProps) => {
  const { t } = useTranslation();
  const tagClass = RANK_TAG_STYLE[rank];

  return (
    <div className="w-[208px] overflow-hidden rounded-[20px] shadow-[0_22px_36px_rgba(15,23,42,0.22)]">
      <div className={`flex h-[72px] items-center px-[24px] ${tagClass}`}>
        <span className="text-[26px] font-extrabold leading-none tracking-[-0.02em] text-white">
          {t('maskedSinger.rankLabel', { rank })}
        </span>
      </div>
      <div className="flex flex-col items-center gap-[14px] bg-white px-[20px] pt-[28px] pb-[30px]">
        <p className="text-center text-[40px] font-extrabold leading-none tracking-[-0.04em] text-[#0f172a]">
          {singer.singerName}
        </p>
        <div className="flex items-center gap-[6px] text-[#64748b]">
          <FiMusic className="size-[16px]" />
          <span className="text-[16px] leading-none">{singer.songName}</span>
        </div>
      </div>
    </div>
  );
};

const MaskedSingerResultPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);


  const [resultsQuery, singersQuery] = useQueries({
    queries: [
      {
        queryKey: ['masked-singer', 'results'],
        queryFn: fetchVoteResults,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      {
        queryKey: ['masked-singer', 'singers'],
        queryFn: fetchSingerVoteList,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    ],
  });

  const isLoading = resultsQuery.isLoading || singersQuery.isLoading;

  const songMap = new Map(
    (singersQuery.data ?? []).map((s) => [s.singerId, s.songName]),
  );

  const top3: RankedSinger[] = (resultsQuery.data?.results ?? [])
    .slice(0, 3)
    .map((r) => ({
      singerId: r.singerId,
      singerName: r.singerName,
      voteCount: r.voteCount,
      songName: songMap.get(r.singerId) ?? '',
    }));
  const total = top3.length;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < total - 1;

  const handlePrev = () => canGoPrev && setCurrentIndex((i) => i - 1);
  const handleNext = () => canGoNext && setCurrentIndex((i) => i + 1);

  const safeIndex = Math.min(currentIndex, Math.max(0, total - 1));
  const current = top3[safeIndex];
  const rank = (safeIndex + 1) as 1 | 2 | 3;

  return (
    <section className="flex flex-1 flex-col pb-10 text-white">
      <div className="px-6 pb-6">
        <DayHeader
          selectedDay={0}
          onSelectDay={() => {}}
          showDayTabs={false}
          title={t('maskedSinger.title')}
        />
        <p className="mt-2 text-[14px] font-light leading-snug text-white/90">
          {t('maskedSinger.subtitle')}
        </p>
      </div>

      <div className="flex flex-col items-center px-6">
        {isLoading || !current ? (
          <p className="py-16 text-center text-[14px] text-white/85">
            {isLoading ? t('maskedSinger.loading') : t('maskedSinger.resultEmpty')}
          </p>
        ) : (
          <>
            <div className="relative flex w-full items-center justify-center pt-[18px]">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canGoPrev}
                aria-label="이전 순위"
                className="absolute left-[28px] top-1/2 z-10 flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#475569] shadow-[0_8px_18px_rgba(15,23,42,0.14)] backdrop-blur-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft className="size-[22px]" />
              </button>

              <RankCard rank={rank} singer={current} />

              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext}
                aria-label="다음 순위"
                className="absolute right-[28px] top-1/2 z-10 flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#475569] shadow-[0_8px_18px_rgba(15,23,42,0.14)] backdrop-blur-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronRight className="size-[22px]" />
              </button>
            </div>

            <div className="mt-[24px] flex items-center gap-[8px]">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`h-[8px] rounded-full transition-all duration-200 ${
                    i === safeIndex ? 'w-[28px] bg-[#334155]' : 'w-[8px] bg-[#cbd5e1]/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => navigate('/masked-singer')}
          className="mt-[32px] h-[56px] w-full max-w-[372px] rounded-[18px] bg-[linear-gradient(180deg,#475569_0%,#334155_100%)] text-[15px] font-bold tracking-[-0.02em] text-white shadow-[0_12px_24px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]"
        >
          {t('maskedSinger.backToVote')}
        </button>
      </div>
    </section>
  );
};

export default MaskedSingerResultPage;
