import { useQuery } from '@tanstack/react-query';
import { fetchCurrentClub, type CurrentClub } from '../../lib/api/club';

export interface NowPlayingCardProps {
  clubName: string;
  clubStatus: string;
  clubType: string;
  clubCode: string;
}

const NowPlayingCard = ({ clubName, clubStatus, clubType, clubCode }: NowPlayingCardProps) => {
  return (
    <div className="mx-5 mb-3">
      <div
        className="relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-4"
        style={{
          background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 55%, #0284c7 100%)',
          boxShadow: '0 10px 28px rgba(2,132,199,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.6) 0%, transparent 70%)',
          }}
        />

        <div className="relative w-0.5 flex-shrink-0 self-stretch border-l-2 border-dashed border-white/60" />

        <div className="relative min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold leading-none text-[#0ea5e9] shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
              </span>
              {clubStatus}
            </span>
            <span className="rounded-md bg-white/25 px-2 py-0.5 text-[10px] font-bold leading-none text-gray-600 backdrop-blur-sm">
              {clubType}
            </span>
          </div>

          <p className="truncate text-[18px] font-extrabold  text-[#334153]">{clubName}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-[10px] font-bold tracking-[0.1em] text-white/90">NOW PLAYING</p>
            <p className="text-[10px] font-bold tracking-[0.1em] text-white/70">{clubCode}</p>
          </div>
        </div>
        <div
          className="relative flex flex-shrink-0 items-center justify-center text-white/70"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
        ></div>
      </div>
    </div>
  );
};

const NowPlayingEmpty = () => (
  <div className="mx-5 mb-3">
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
      style={{
        background: 'rgba(255,255,255,0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.45)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="w-1 flex-shrink-0 self-stretch rounded-full"
        style={{ background: 'linear-gradient(180deg, #cbd5e1, #94a3b8)' }}
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-bold leading-none"
            style={{ background: 'rgba(160,170,184,0.18)', color: '#8a94a6' }}
          >
            STAND BY
          </span>
        </div>
        <p className="truncate text-[13px] font-semibold text-[#8a94a6]">
          현재 진행 중인 공연이 없어요
        </p>
      </div>
    </div>
  </div>
);

const NowPlaying = () => {
  const { data: club, error } = useQuery<CurrentClub | null>({
    queryKey: ['club', 'current'],
    queryFn: fetchCurrentClub,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    retry: false,
  });

  if (error) {
    console.error('[NowPlaying] fetchCurrentClub failed:', error);
  }

  if (!club || club.clubStatus !== 'LIVE') {
    return <NowPlayingEmpty />;
  }

  return (
    <NowPlayingCard
      clubName={club.clubName}
      clubStatus={club.clubStatus}
      clubType={club.clubType}
      clubCode={club.clubCode}
    />
  );
};

export default NowPlaying;
