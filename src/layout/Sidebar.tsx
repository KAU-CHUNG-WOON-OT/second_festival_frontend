import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIsLogin } from '../hooks/useIsLogin';
import { getKakaoLoginUrl } from '../lib/kakaoLogin';
import { saveLoginReturnPath } from '../lib/loginReturn';
import { track } from '@/lib/mixpanel';
import closeIcon from '../assets/sidebar_close.svg';
import kakaoIcon from '../assets/kakao_icon.svg';

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
  const { pathname } = useLocation();
  const isLogin = useIsLogin();

  // TODO: 시안의 '실시간 좌석'은 아직 페이지가 없어 제외
  const menuItems: MenuItem[] = [
    { label: t('nav.home'), path: '/home' },
    { label: t('nav.notice'), path: '/notice' },
    { label: t('nav.yard'), path: '/yard' },
    { label: t('nav.foodtruck'), path: '/foodtruck' },
    { label: t('nav.stores'), path: '/stores' },
    { label: t('nav.performance'), path: '/performance' },
    { label: t('nav.game'), path: '/game' },
    { label: t('nav.makers'), path: '/makers' },
  ];

  const handleLogin = () => {
    const loginUrl = getKakaoLoginUrl();
    if (!loginUrl) return;
    track('sidebar_kakao_login_clicked');
    // 로그인하고 나면 지금 보던 페이지로 돌아온다
    saveLoginReturnPath();
    window.location.href = loginUrl;
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
              aria-current={pathname === item.path ? 'page' : undefined}
              className={`py-[8px] font-body-kr text-[20px] leading-[22px] text-black ${
                pathname === item.path ? 'font-bold' : 'font-medium'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 로그인하지 않았을 때만 */}
        {!isLogin && (
          <button
            type="button"
            onClick={handleLogin}
            className="mx-5 mt-auto flex h-11 items-center justify-center gap-2 rounded-full border-2 border-ink bg-[#fee500] font-body-kr text-[15px] font-bold text-ink drop-shadow-[3px_3px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
          >
            <img src={kakaoIcon} alt="" width={18} height={17} />
            {t('sidebar.login')}
          </button>
        )}

        <p
          className={`whitespace-nowrap px-[31px] pb-10 font-display text-[36px] leading-9 text-rust ${isLogin ? 'mt-auto' : 'mt-6'}`}
        >
          활주로 <span className="font-typewriter text-[14px] tracking-[1.4px]">festival</span>
        </p>
      </aside>
    </div>
  );
};

export default Sidebar;
