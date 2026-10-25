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

  // 시안의 '가게 정보'·'실시간 좌석' 자리는 부스 정보·주점 안내로 연결 ('가게 정보'는 사이드바에서 /stores로 연결, '실시간 좌석'은 아직 페이지가 없음)
  const QUICK_MENUS: HomeQuickMenuItem[] = [
    { title: t('home.boothInfo'), sub: t('home.yardEvent'), path: '/yard', colorClass: 'bg-mustard text-ink' },
    { title: t('home.foodTruck'), sub: t('home.foodLocations'), path: '/foodtruck', colorClass: 'bg-rust text-paper' },
    { title: t('home.performance'), sub: t('home.clubsEvents'), path: '/performance', colorClass: 'bg-olive text-paper' },
    { title: t('home.pubGuide'), sub: t('home.deptYard'), path: '/pub', colorClass: 'bg-sky-light text-ink' },
  ];

  return (
    <div className="flex flex-col text-ink">
      <HomeHero />

      {importantNotice && (
        <HomeNoticeBanner
          to={`/notice?id=${importantNotice.id}`}
          title={isEng ? importantNotice.title_en : importantNotice.title}
          dateText={importantNotice.date}
        />
      )}

      <section className="px-5 pb-10 pt-8">
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
