import { useNavigate } from 'react-router-dom';
import LanguageToggle from '../common/LanguageToggle';
import { FestivalPill } from '../common/RetroPageTitle';
import { useSidebar } from '../../contexts/SidebarContext';
import { FESTIVAL_DATE_LABEL } from '../../data/timetableData';
import { registerAdminLogoTap } from '../../lib/adminTap';
import menuIcon from '../../assets/home_menu.svg';
import cheongunLogo from '../../assets/cheongun_logo.svg';

const HomeHero = () => {
  const { openSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogoTap = () => {
    if (registerAdminLogoTap()) navigate('/admin/login');
  };

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
        {/* 다른 화면 상단바 로고와 같은 자리·같은 탭 영역. 빠르게 7번 누르면 관리자 로그인 (lib/adminTap) */}
        <div onClick={handleLogoTap} className="-mr-2 flex h-11 touch-manipulation select-none items-center px-2">
          <img
            src={cheongunLogo}
            alt="청운"
            width={46}
            height={32}
            draggable={false}
            className="brightness-0 invert"
          />
        </div>
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
