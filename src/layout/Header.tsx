import { useEffect } from 'react';
import { FiMenu, FiChevronLeft } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImg from '../assets/logo_black.svg';
import { useTimeOfDay } from '../hooks/useTimeOfDay';
import { dummyBooths } from '../data/boothData';
import { dummyPubs } from '../data/pubData';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onOpenSidebar: () => void;
}

const Header = ({ onOpenSidebar }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const timeOfDay = useTimeOfDay();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isEng = language === 'ENG';

  const forceDarkHeader = location.pathname === '/onboarding' || location.pathname === '/info';
  const isMorning = forceDarkHeader || timeOfDay === 'morning';
  const textColorClass = isMorning ? 'text-black' : 'text-white';
  const logoFilterClass = isMorning ? 'brightness-0' : 'brightness-0 invert';

  const yardMatch = location.pathname.match(/^\/yard\/(\d+)$/);
  const pubMatch = location.pathname.match(/^\/pub\/(\d+)$/);
  const truckMatch = location.pathname.match(/^\/foodtruck\/(\d+)$/);
  const isDetailPage = !!(yardMatch || pubMatch || truckMatch);

  const getDetailTitle = () => {
    if (yardMatch) {
      const booth = dummyBooths.find((b) => b.id === Number(yardMatch[1]));
      if (!booth) return t('header.boothGuide');
      return isEng ? booth.name_en : booth.name;
    }
    if (pubMatch) {
      const pub = dummyPubs.find((p) => p.id === Number(pubMatch[1]));
      if (!pub) return t('header.pubGuide');
      return isEng ? pub.name_en : pub.name;
    }
    if (truckMatch) return t('header.foodtruckGuide');
    return '';
  };

  const getPageTitle = (path: string) => {
    if (path === '/notice') return t('nav.notice');
    if (path === '/timetable') return t('nav.timetable');
    if (path === '/performance') return t('nav.performance');
    if (path === '/foodtruck') return t('nav.foodtruck');
    if (path === '/yard') return t('nav.yard');
    if (path === '/pub') return t('nav.pub');
    if (path === '/makers') return t('nav.makers');
    return '';
  };

  const currentTitle = isDetailPage ? getDetailTitle() : getPageTitle(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
    const scrollableElements = document.getElementsByClassName('overflow-y-auto');
    for (let i = 0; i < scrollableElements.length; i++) {
      scrollableElements[i].scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <header className="sticky top-0 flex justify-between items-center p-6 z-40 bg-transparent">
      {isDetailPage ? (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center p-0 bg-transparent border-none cursor-pointer z-10"
        >
          <FiChevronLeft size={26} className={`transition-colors duration-300 ${textColorClass}`} />
        </button>
      ) : (
        <button
          onClick={onOpenSidebar}
          className="flex items-center justify-center p-0 bg-transparent border-none cursor-pointer z-10"
        >
          <FiMenu size={24} className={`transition-colors duration-300 ${textColorClass}`} />
        </button>
      )}

      <h1 className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold leading-tight text-center whitespace-pre-line transition-colors duration-300 ${textColorClass}`}>
        {currentTitle}
      </h1>

      <Link to="/home" aria-label="홈으로 이동" className="z-10">
        <img
          src={logoImg}
          alt="청운 로고"
          className={`h-6 w-auto cursor-pointer transition-all duration-300 ${logoFilterClass}`}
        />
      </Link>
    </header>
  );
};

export default Header;