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

  // 홈 공지 띠: HOT 공지 → 중요 공지 → 가장 최근 공지 순으로 하나 (각각 그중 최신)
  const latestNotices = [...dummyNotices].sort((a, b) => b.date.localeCompare(a.date));
  const bannerNotice =
    latestNotices.find((n) => n.isHot) ?? latestNotices.find((n) => n.isImportant) ?? latestNotices[0];

  // 시안의 '가게 정보'·'실시간 좌석' 자리는 부스 정보·가게 정보로 연결 (실시간 좌석은 가게 화면에서 보여 줌)
  const QUICK_MENUS: HomeQuickMenuItem[] = [
    { title: t('home.boothInfo'), sub: t('home.yardEvent'), path: '/yard', colorClass: 'bg-mustard text-ink' },
    { title: t('home.foodTruck'), sub: t('home.foodLocations'), path: '/foodtruck', colorClass: 'bg-rust text-paper' },
    { title: t('home.performance'), sub: t('home.clubsEvents'), path: '/performance', colorClass: 'bg-olive text-paper' },
    { title: t('home.storeInfo'), sub: t('home.localStores'), path: '/stores', colorClass: 'bg-sky-light text-ink' },
  ];

  return (
    <div className="flex flex-col text-ink">
      <HomeHero />

      {bannerNotice && (
        <HomeNoticeBanner
          to={`/notice?id=${bannerNotice.id}`}
          title={isEng ? bannerNotice.title_en : bannerNotice.title}
          dateText={bannerNotice.date}
        />
      )}

      {/* 게임(행사)을 맨 위에 얇게 */}
      <section className="flex flex-col gap-6 px-5 pb-10 pt-6">
        <HomeGameSection to="/game" />
        <HomeQuickMenuGrid items={QUICK_MENUS} />
      </section>

      <section className="px-5 pb-12">
        <HomeLineupCard />
      </section>
    </div>
  );
};

export default HomePage;
