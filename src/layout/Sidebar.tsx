import { useEffect, useRef, useState } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fastivalLogo from '../assets/fastival_logo.svg';
import { useIsLogin } from '../hooks/useIsLogin';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  path: string;
}

interface MenuGroup {
  key: string;
  label: string;
  items: MenuItem[];
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const isLogin = useIsLogin();
  const navigate = useNavigate();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const logoTapCount = useRef(0);
  const logoTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpenGroup(null);
  }, [isOpen]);

  const groups: MenuGroup[] = [
    {
      key: 'main',
      label: t('nav.category.main'),
      items: [
        { label: t('nav.home'), path: '/home' },
        ...(isLogin ? [{ label: t('nav.myReservation'), path: '/myticket' }] : []),
        { label: t('nav.notice'), path: '/notice' },
      ],
    },
    {
      key: 'schedule',
      label: t('nav.category.schedule'),
      items: [
        { label: t('nav.timetable'), path: '/timetable' },
        { label: t('nav.performance'), path: '/performance' },
        { label: t('nav.maskedSinger'), path: '/masked-singer' },
        { label: t('nav.ticketReservation'), path: '/ticket' },
      ],
    },
    {
      key: 'booth',
      label: t('nav.category.booth'),
      items: [
        { label: t('nav.yard'), path: '/yard' },
        { label: t('nav.pub'), path: '/pub' },
        { label: t('nav.foodtruck'), path: '/foodtruck' },
      ],
    },
    {
      key: 'info',
      label: t('nav.category.info'),
      items: [
        { label: t('nav.infoGuide'), path: '/info-guide' },
        { label: t('nav.makers'), path: '/makers' },
      ],
    },
  ];

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

  const handleKakaoLogin = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (!apiBase) return;
    const trimmed = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    window.location.href = `${trimmed}/oauth2/authorization/kakao`;
  };

  const handleToggle = (key: string) => {
    setOpenGroup((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      />
      <aside
        className={`absolute top-20 left-0 z-50 flex h-full w-[240px] flex-col bg-[#D9E8F1] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-5">
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-transparent p-0"
            aria-label="메뉴 닫기"
          >
            <FiX size={22} className="text-gray-700" />
          </button>
        </div>

        <ul className="flex flex-col gap-1 px-6 pt-2">
          {groups.map((group) => {
            const expanded = openGroup === group.key;
            return (
              <li key={group.key}>
                <button
                  onClick={() => handleToggle(group.key)}
                  aria-expanded={expanded}
                  className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent py-2.5 text-left"
                >
                  <span className="text-[17px] font-bold text-gray-800">
                    {group.label}
                  </span>
                  <FiChevronDown
                    size={16}
                    className={`text-gray-600 transition-transform duration-200 ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                    expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <ul className="min-h-0 flex flex-col gap-0.5 pl-5">
                    {group.items.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={onClose}
                          className="block py-1.5 text-[15px] font-medium text-gray-700"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        {!isLogin && (
          <div className="px-6 pt-4">
            <button
              onClick={handleKakaoLogin}
              className="w-full rounded-[12px] bg-[#FEE500] py-[12px] text-[14px] font-bold text-[#191919] active:opacity-80"
            >
              카카오 로그인
            </button>
          </div>
        )}

        <div className="mt-auto mb-[50%] flex justify-center px-6">
          <img
            src={fastivalLogo}
            alt="활공제 로고"
            className="w-full max-w-[140px] opacity-30"
            style={{ filter: 'brightness(0)' }}
            onClick={handleLogoTap}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
