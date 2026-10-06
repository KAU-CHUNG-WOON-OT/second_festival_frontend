import lineupImage from '../../assets/home_lineup_yb.png';
import reelIcon from '../../assets/home_reel.svg';

// TODO: 라인업 확정 시 아티스트 목록으로 교체 (현재는 시안의 YB 한 장)
const HomeLineupCard = () => {
  const reel = (
    <img src={reelIcon} alt="" width={48} height={48} className="shrink-0 rotate-[-44.54deg]" />
  );

  return (
    <section className="rounded-[16px] border border-ink bg-mustard p-4 text-ink drop-shadow-[6px_6px_0px_var(--color-ink)]">
      <div className="flex justify-between font-typewriter text-[11px] font-bold leading-[16.5px]">
        <span>Artist Line-up</span>
        <span>C-90 · HI-FI</span>
      </div>

      <div className="relative mt-3 h-[206px] overflow-clip rounded-[8px] border border-ink bg-ink">
        <img src={lineupImage} alt="헤드라이너 YB" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-ink/0" />
        <span className="absolute left-4 top-3 font-typewriter text-[14px] leading-5 text-paper">● REC</span>
        <span className="absolute bottom-3 right-4 font-condensed text-[60px] font-black leading-[60px] text-paper">
          YB
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-full border border-ink bg-cream px-4 py-2">
        {reel}
        {reel}
      </div>
    </section>
  );
};

export default HomeLineupCard;
