import { useTranslation } from 'react-i18next';
import DayHeader from '../components/common/DayHeader';
import LanguageToggle from '../components/common/LanguageToggle';
import HomeNoticeBanner from '../components/home/HomeNoticeBanner';
import HomeQuickMenuGrid, { type HomeQuickMenuItem } from '../components/home/HomeQuickMenuGrid';
import HomeTicketSection from '../components/home/HomeTicketSection';
import { dummyNotices } from '../data/noticeData';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const importantNotice = dummyNotices
    .filter((n) => n.isImportant)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  const QUICK_MENUS: HomeQuickMenuItem[] = [
    { title: t('home.boothInfo'), sub: t('home.yardEvent'), path: '/yard' },
    { title: t('home.foodTruck'), sub: t('home.foodLocations'), path: '/foodtruck' },
    { title: t('home.performance'), sub: t('home.clubsEvents'), path: '/performance' },
    { title: t('home.pubGuide'), sub: t('home.deptYard'), path: '/pub' },
  ];

  return (
    <div className="flex flex-1 flex-col pb-5">
      <div className="px-6 relative">
        <div className="absolute right-6 top-8 z-10">
          <LanguageToggle />
        </div>
        <DayHeader selectedDay={-1} onSelectDay={() => {}} showDayTabs={false} />
      </div>
      <div className="flex flex-col gap-4 px-6">
        {importantNotice && (
          <HomeNoticeBanner
            to="/notice"
            title={isEng ? importantNotice.title_en : importantNotice.title}
            dateText={importantNotice.date}
          />
        )}
        <HomeQuickMenuGrid items={QUICK_MENUS} />
        <HomeTicketSection to="/ticket" />
      </div>
    </div>
  );
};

export default HomePage;
