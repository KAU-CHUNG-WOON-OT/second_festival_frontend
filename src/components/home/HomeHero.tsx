import LanguageToggle from '../common/LanguageToggle';
import { FestivalPill } from '../common/RetroPageTitle';
import { useSidebar } from '../../contexts/SidebarContext';
import { FESTIVAL_DATE_LABEL } from '../../data/timetableData';
import menuIcon from '../../assets/home_menu.svg';
import cheongunLogo from '../../assets/cheongun_logo.svg';

const HomeHero = () => {
  const { openSidebar } = useSidebar();

  return (
    <section className="w-full px-5 pb-8 pt-5 text-paper">
      <div className="flex h-11 items-center justify-between">
        <button
          type="button"
          onClick={openSidebar}
          aria-label="메뉴 열기"
          className="-ml-3 flex size-11 items-center justify-center"
        >
          <img src={menuIcon} alt="" width={20} height={13} className="brightness-0 invert" />
        </button>
        <img src={cheongunLogo} alt="청운" width={46} height={32} className="brightness-0 invert" />
      </div>

      <div className="flex items-center justify-between pt-6">
        <FestivalPill />
        <LanguageToggle />
      </div>
      <h1 className="whitespace-nowrap pt-4 font-condensed text-[clamp(52px,18vw,72px)] font-medium uppercase leading-none tracking-[-1px]">
        {FESTIVAL_DATE_LABEL}
      </h1>
    </section>
  );
};

export default HomeHero;
