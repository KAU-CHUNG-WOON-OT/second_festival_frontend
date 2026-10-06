import { useQuery } from '@tanstack/react-query';
import { fetchCurrentClub, type CurrentClub } from '../../lib/api/club';
import reelIcon from '../../assets/cassette_reel.svg';

export interface NowPlayingCardProps {
  clubName: string;
  clubStatus: string;
  clubType: string;
  clubCode: string;
}

const NowPlayingCard = ({ clubName, clubStatus, clubType, clubCode }: NowPlayingCardProps) => {
  const reel = <img src={reelIcon} alt="" width={44} height={44} className="shrink-0 rotate-[-21.74deg]" />;

  return (
    <section className="rounded-[16px] border-2 border-ink bg-rust p-4 text-paper drop-shadow-[6px_6px_0px_var(--color-ink)]">
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-full bg-mustard shadow-[0_0_0_2px_var(--color-paper)]" />
        <span className="font-typewriter text-[12px] leading-4 tracking-[1.2px]">NOW PLAYING</span>
        <span className="rounded-[4px] bg-paper px-[6px] py-[2px] font-typewriter text-[12px] font-bold leading-4 tracking-[1.2px] text-rust">
          {clubStatus}
        </span>
      </div>
      <div className="pt-3">
        <h2 className="truncate font-display text-[30px] leading-9">{clubName}</h2>
        <p className="font-body-kr text-[16px] leading-6 opacity-90">{clubType}</p>
        <p className="pt-3 font-typewriter text-[14px] leading-5">TRACK {clubCode}</p>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-full border border-ink bg-ink px-3 py-[6px]">
        {reel}
        {reel}
      </div>
    </section>
  );
};

const NowPlayingEmpty = () => (
  <section className="flex items-center gap-3 rounded-[16px] border-2 border-ink bg-paper px-4 py-[14px] text-ink drop-shadow-[4px_4px_0px_var(--color-ink)]">
    <span className="rounded-[4px] bg-ink/15 px-2 py-[2px] font-typewriter text-[11px] font-bold leading-4 text-ink/60">
      STAND BY
    </span>
    <p className="truncate font-body-kr text-[14px] font-semibold opacity-70">현재 진행 중인 공연이 없어요</p>
  </section>
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
