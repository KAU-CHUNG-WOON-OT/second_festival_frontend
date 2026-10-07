import { useTranslation } from 'react-i18next';
import HomeHero from '../components/home/HomeHero';
import HomeLineupCard from '../components/home/HomeLineupCard';
import HomeNoticeBanner from '../components/home/HomeNoticeBanner';
import HomeQuickMenuGrid, { type HomeQuickMenuItem } from '../components/home/HomeQuickMenuGrid';
import HomeGameSection from '../components/home/HomeGameSection';
import { dummyNotices } from '../data/noticeData';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const importantNotice = dummyNotices
    .filter((n) => n.isImportant)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  // 시안의 '가게 정보' 자리는 해당 페이지가 아직 없어 주점 안내로 연결
  const QUICK_MENUS: HomeQuickMenuItem[] = [
    { title: t('home.boothInfo'), sub: t('home.yardEvent'), path: '/yard', colorClass: 'bg-maroon text-paper' },
    { title: t('home.pubGuide'), sub: t('home.deptYard'), path: '/pub', colorClass: 'bg-mustard text-ink' },
    { title: t('home.foodTruck'), sub: t('home.foodLocations'), path: '/foodtruck', colorClass: 'bg-rust text-paper' },
    { title: t('home.performance'), sub: t('home.clubsEvents'), path: '/performance', colorClass: 'bg-olive text-paper' },
  ];

  return (
    <div className="flex flex-col bg-cream text-ink">
      <HomeHero />

      {importantNotice && (
        <HomeNoticeBanner
          to="/notice"
          title={isEng ? importantNotice.title_en : importantNotice.title}
          dateText={importantNotice.date}
        />
      )}

      <section className="px-5 py-10">
        <h2 className="pb-5 font-typewriter text-[12px] leading-4 tracking-[3.6px]">— TRACK LIST —</h2>
        <HomeQuickMenuGrid items={QUICK_MENUS} />
      </section>

      <section className="flex flex-col gap-8 px-5 pb-12">
        <HomeLineupCard />
        <HomeGameSection to="/game" />
      </section>
    </div>
  );
};

export default HomePage;
