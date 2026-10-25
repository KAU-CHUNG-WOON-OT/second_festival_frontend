import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import StoreDeals from '../components/stores/StoreDeals';
import CongestionBadge from '../components/stores/CongestionBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { useStoreCongestion } from '../hooks/useStoreCongestion';
import { hasStoreDeals, storeEvents, type StoreEvent } from '../data/storeEventData';
import { congestionLabel, congestionOf, type CongestionLevel } from '../data/storeCongestion';

// 쿠폰 모양 카드: 위는 가게 이름과 실시간 혼잡도 뱃지, 절취선(양옆 펀치 홈) 아래에 행사 목록, 맨 아래는 가게 화면(실시간 현황)으로 가는 안내.
// 행사가 없는 가게는 행사 목록 없이 이름 바로 아래에 안내가 온다.
// 카드 전체를 누르면 가게 화면으로 간다
const StoreCard = ({
  store,
  index,
  level,
  isEng,
}: {
  store: StoreEvent;
  index: number;
  level: CongestionLevel | null;
  isEng: boolean;
}) => (
  <Link
    to={`/stores/${store.id}`}
    aria-label={
      isEng
        ? `${store.name}${level ? ` (now ${congestionLabel(level, true)})` : ''}: see live status`
        : `${store.name}${level ? ` (지금 ${congestionLabel(level, false)})` : ''} 실시간 현황 보기`
    }
    className="relative block overflow-clip rounded-[16px] border-2 border-ink bg-paper text-ink shadow-[5px_5px_0px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
  >
    <header className="flex items-start justify-between gap-3 px-5 pb-4 pt-4">
      <div className="min-w-0">
        <p className="font-typewriter text-[12px] leading-4 opacity-60">STORE {String(index + 1).padStart(2, '0')}</p>
        <h2 className="pt-1 font-display text-[24px] leading-[30px]">{store.name}</h2>
      </div>
      {/* 실시간 혼잡도 뱃지: 아직 등록되지 않았거나 불러오지 못했으면 비워 둔다 */}
      {level && (
        <span className="pt-[2px]">
          <CongestionBadge level={level} isEng={isEng} />
        </span>
      )}
    </header>

    {hasStoreDeals(store) && (
      <div className="relative border-t border-dashed border-ink/50 px-5 pb-5 pt-4">
        <span className="absolute -left-[10px] -top-[10px] size-5 rounded-full border border-ink bg-cream" />
        <span className="absolute -right-[10px] -top-[10px] size-5 rounded-full border border-ink bg-cream" />
        <StoreDeals store={store} isEng={isEng} />
      </div>
    )}

    <p className="flex items-center justify-between gap-2 border-t-2 border-ink bg-cream px-5 py-3 font-body-kr text-[13px] font-semibold leading-5">
      {isEng ? 'Tap to see the live status' : '누르면 실시간 현황을 볼 수 있어요'}
      <FiChevronRight size={18} aria-hidden className="shrink-0" />
    </p>
  </Link>
);

// 시안이 없어 게임·공연 목록과 같은 구성으로 맞춤
const StoreEventPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  // 가게별 실시간 혼잡도 (이 화면이 떠 있는 동안 30초마다)
  const { data: congestion } = useStoreCongestion();

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader showMenu />
      <RetroPageTitle title={t('nav.stores')} caption="FESTIVAL DEALS" />
      <p className="pt-3 font-body-kr text-[14px] leading-5 text-paper/80">
        {isEng
          ? 'During the festival, these shops near campus are running special deals.'
          : '축제 기간에 학교 앞 가게에서 이런 행사를 해요.'}
      </p>

      <div className="flex flex-col gap-5 pt-6">
        {storeEvents.map((store, index) => (
          <StoreCard
            key={store.id}
            store={store}
            index={index}
            level={congestionOf(congestion, store.id)?.level ?? null}
            isEng={isEng}
          />
        ))}
      </div>
    </div>
  );
};

export default StoreEventPage;
