import { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import closeIcon from '../assets/sidebar_close.svg';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  path: string;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logoTapCount = useRef(0);
  const logoTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // TODO: 시안의 '가게 정보', '실시간 좌석'은 아직 페이지가 없어 제외
  const menuItems: MenuItem[] = [
    { label: t('nav.home'), path: '/home' },
    { label: t('nav.yard'), path: '/yard' },
    { label: t('nav.foodtruck'), path: '/foodtruck' },
    { label: t('nav.performance'), path: '/performance' },
    { label: t('nav.ticketReservation'), path: '/ticket' },
    { label: t('nav.makers'), path: '/makers' },
  ];

  // 로고 3번 탭 → 관리자 페이지
  const handleLogoTap = () => {
    logoTapCount.current += 1;
    if (logoTapTimer.current) clearTimeout(logoTapTimer.current);
    if (logoTapCount.current >= 3) {
      logoTapCount.current = 0;
      onClose();
      navigate('/admin');
      return;
    }
    logoTapTimer.current = setTimeout(() => {
      logoTapCount.current = 0;
    }, 2000);
  };

  return (
    <div
      onClick={onClose}
      className={`absolute inset-0 z-50 bg-[rgba(217,217,217,0.7)] transition-opacity duration-300 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`relative flex h-full w-[215px] flex-col rounded-r-[15px] bg-cream drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="메뉴 닫기"
          className="absolute left-[169px] top-3 flex size-9 items-center justify-center"
        >
          <img src={closeIcon} alt="" width={13} height={13} />
        </button>

        <nav className="flex flex-col px-5 pt-24">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`py-[9.5px] font-body-kr text-[20px] font-medium leading-[22px] text-black ${
                pathname === item.path ? 'underline' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p
          onClick={handleLogoTap}
          className="mt-auto px-[31px] pb-10 font-display text-[36px] leading-9 text-rust"
        >
          활주로
        </p>
      </aside>
    </div>
  );
};

export default Sidebar;
