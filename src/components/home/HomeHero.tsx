import LanguageToggle from '../common/LanguageToggle';
import { useSidebar } from '../../contexts/SidebarContext';
import { FESTIVAL_DATE_LABEL } from '../../data/timetableData';
import heroImage from '../../assets/home_hero.png';
import menuIcon from '../../assets/home_menu.svg';
import cheongunLogo from '../../assets/cheongun_logo.svg';

const HomeHero = () => {
  const { openSidebar } = useSidebar();

  return (
    <section className="relative h-[426px] w-full overflow-clip">
      <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(63,143,201,0.4)_0%,rgba(63,143,201,0)_50%,rgba(107,45,42,0)_50%,rgba(107,45,42,0.8)_100%)]" />

      <div className="relative flex items-center justify-between px-5 pt-5">
        <button
          type="button"
          onClick={openSidebar}
          aria-label="메뉴 열기"
          className="flex size-11 items-center justify-center rounded-full border border-paper/80 bg-ink/30 backdrop-blur-[8px]"
        >
          <img src={menuIcon} alt="" width={18} height={12} />
        </button>
        <span className="font-typewriter text-[12px] leading-4 tracking-[3.6px] text-paper">
          SIDE A · 90 MIN
        </span>
        <img src={cheongunLogo} alt="청운" width={51} height={36} />
      </div>

      <div className="relative px-5 pt-14">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-mustard bg-ink/40 px-5 py-[6px] font-display text-[18px] leading-7 text-mustard backdrop-blur-[8px]">
            활주로
          </span>
          <LanguageToggle />
        </div>
        <p className="pt-10 font-typewriter text-[11px] leading-[16.5px] tracking-[3.3px] text-mustard">
          KOREA AEROSPACE UNIVERSITY
        </p>
        <h1 className="pt-2 font-condensed text-[88.5px] font-black uppercase leading-[75px] tracking-[-2.2px] text-paper drop-shadow-[4px_4px_0px_var(--color-rust)]">
          {FESTIVAL_DATE_LABEL}
        </h1>
        <p className="pt-4 font-display text-[24px] leading-8 text-paper">가을에 재생 버튼을 누르다</p>
      </div>

      <div className="absolute bottom-0 left-0 h-3 w-full bg-retro-stripe" />
    </section>
  );
};

export default HomeHero;
