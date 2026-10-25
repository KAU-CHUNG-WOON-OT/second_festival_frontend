import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { useSidebar } from '../../contexts/SidebarContext';
import { fallbackPath } from '@/util/backFallback';
import { registerAdminLogoTap } from '@/lib/adminTap';
import SkyDots from './SkyDots';
import { skyBackground } from './retroLayout';
import cheongunLogo from '../../assets/cheongun_logo.svg';
import menuIcon from '../../assets/home_menu.svg';

interface RetroPageHeaderProps {
  title?: string;
  // 뒤로가기 대신 사이드바 메뉴 버튼 (목록 페이지)
  showMenu?: boolean;
  // false면 로고를 눌러도 아무 일도 없다 (운영진 로그인: 7번 누른 뒤 더 눌러도 그 화면에 머문다)
  logoLink?: boolean;
}

// 노을 배경 위 흰 아이콘 헤더: 메뉴 또는 뒤로가기 · (선택) 가운데 제목 · 청운 로고(홈 링크)
// 스크롤해도 화면 맨 위에 고정된다. 뒤에 하늘·별을 똑같이 깔고 아래 12px을 흐리게 해 내용이 자연스럽게 밑으로 들어간다.
// 상단바 전체가 탭을 받아 밑에 가려진 카드가 눌리지 않는다.
// 페이지 위 여백(pt-5)과 좌우 여백(px-5)을 음수 여백으로 덮어 처음부터 화면 맨 위·양끝에 맞춘다
const RetroPageHeader = ({ title, showMenu = false, logoLink = true }: RetroPageHeaderProps) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { openSidebar } = useSidebar();

  const handleLogoTap = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!registerAdminLogoTap()) return;
    event.preventDefault();
    navigate('/admin/login');
  };

  const logo = (
    <img src={cheongunLogo} alt="청운" width={46} height={32} draggable={false} className="brightness-0 invert" />
  );

  const goBack = () => {
    // BrowserRouter가 기록마다 매기는 순번. 0이면 앱에서 처음 연 화면이라 navigate(-1)은 앱 밖으로 나간다
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallbackPath(pathname, search), { replace: true });
  };

  return (
    <div
      className="sticky top-0 z-30 -mx-5 -mb-3 -mt-5 px-5 pb-3 pt-5"
      style={{
        background: skyBackground(),
        maskImage: 'linear-gradient(to bottom, black calc(100% - 12px), transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 12px), transparent)',
      }}
    >
      {/* 별은 불투명한 위 64px 안에서만 (아래 흐려지는 부분에 걸리면 지나가는 내용 위에 점처럼 찍힌다) */}
      <div className="absolute inset-x-0 top-0 h-16 overflow-hidden">
        <SkyDots night />
      </div>
      <div className="relative flex h-11 items-center justify-between text-paper">
        {showMenu ? (
          <button
            type="button"
            onClick={openSidebar}
            aria-label="메뉴 열기"
            className="-ml-3 flex size-11 items-center justify-center"
          >
            <img src={menuIcon} alt="" width={20} height={13} className="brightness-0 invert" />
          </button>
        ) : (
          <button
            type="button"
            onClick={goBack}
            aria-label="뒤로"
            className="-ml-3 flex size-11 items-center justify-center"
          >
            <FiChevronLeft size={26} />
          </button>
        )}
        {title && (
          <h1 className="absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate font-body-kr text-[16px] font-bold leading-6">
            {title}
          </h1>
        )}
        {/* 탭 영역만 44px 높이로 넓히고 음수 여백으로 로고 자리는 그대로 둔다.
            누르면 홈. 홈 로고와 같은 자리라서 빠르게 이어 누르면 관리자 입구 탭으로 같이 센다 (lib/adminTap) */}
        {logoLink ? (
          <Link
            to="/home"
            onClick={handleLogoTap}
            aria-label="홈으로 이동"
            className="-mr-2 flex h-11 touch-manipulation select-none items-center px-2"
          >
            {logo}
          </Link>
        ) : (
          <span className="-mr-2 flex h-11 touch-manipulation select-none items-center px-2">{logo}</span>
        )}
      </div>
    </div>
  );
};

export default RetroPageHeader;
