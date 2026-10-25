import { useTranslation } from 'react-i18next';
import { FiInfo } from 'react-icons/fi';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDealPrice, storeEvents, type StoreDeal, type StoreEvent } from '../data/storeEventData';

const DealList = ({ deals, isEng }: { deals: StoreDeal[]; isEng: boolean }) => (
  <ul>
    {deals.map((deal) => (
      <li
        key={deal.menu}
        className="flex items-center gap-3 border-b border-dashed border-ink/30 py-[10px] first:pt-0 last:border-b-0 last:pb-0"
      >
        <span className="min-w-0 flex-1 font-body-kr text-[15px] font-semibold leading-[22px]">
          {isEng ? deal.menu_en : deal.menu}
        </span>
        {deal.price !== undefined && (
          <span className="flex shrink-0 items-center gap-[6px]">
            <span className="font-typewriter text-[18px] font-bold leading-6">{formatDealPrice(deal.price, isEng)}</span>
            {deal.discount && (
              <span className="rounded-[4px] bg-rust px-[6px] py-[2px] font-body-kr text-[12px] font-bold leading-4 text-paper">
                {isEng ? 'OFF' : '할인'}
              </span>
            )}
          </span>
        )}
      </li>
    ))}
  </ul>
);

// 쿠폰 모양 카드: 위는 가게 이름, 절취선(양옆 펀치 홈) 아래에 행사 목록
const StoreCard = ({ store, index, isEng }: { store: StoreEvent; index: number; isEng: boolean }) => (
  <article className="relative overflow-clip rounded-[16px] border-2 border-ink bg-paper text-ink shadow-[5px_5px_0px_0px_var(--color-ink)]">
    <header className="flex items-start justify-between gap-3 px-5 pb-4 pt-4">
      <div className="min-w-0">
        <p className="font-typewriter text-[12px] leading-4 opacity-60">STORE {String(index + 1).padStart(2, '0')}</p>
        <h2 className="pt-1 font-display text-[24px] leading-[30px]">{store.name}</h2>
      </div>
      {/* 실시간 혼잡도 뱃지 자리: 백엔드 연결 후 가게 이름 오른쪽에 붙인다 */}
    </header>

    <div className="relative border-t border-dashed border-ink/50 px-5 pb-5 pt-4">
      <span className="absolute -left-[10px] -top-[10px] size-5 rounded-full border border-ink bg-cream" />
      <span className="absolute -right-[10px] -top-[10px] size-5 rounded-full border border-ink bg-cream" />

      <div className="flex flex-col gap-5">
        {store.deals && store.deals.length > 0 && <DealList deals={store.deals} isEng={isEng} />}

        {store.groups?.map((group) => (
          <section key={group.label}>
            <span className="inline-flex rounded-full bg-ink px-3 py-1 font-body-kr text-[12px] font-bold leading-4 text-paper">
              {isEng ? group.label_en : group.label}
            </span>
            <div className="pt-3">
              <DealList deals={group.deals} isEng={isEng} />
            </div>
            {group.note && (
              <p className="pt-2 font-body-kr text-[13px] leading-5 opacity-70">{isEng ? group.note_en : group.note}</p>
            )}
          </section>
        ))}

        {store.note && (
          <p className="flex items-start gap-2 rounded-[8px] bg-cream px-3 py-2 font-body-kr text-[13px] leading-5 text-ink/80">
            <FiInfo size={14} aria-hidden className="mt-[3px] shrink-0" />
            {isEng ? store.note_en : store.note}
          </p>
        )}
      </div>
    </div>
  </article>
);

// 시안이 없어 게임·공연 목록과 같은 구성으로 맞춤
const StoreEventPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === 'ENG';

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
          <StoreCard key={store.id} store={store} index={index} isEng={isEng} />
        ))}
      </div>
    </div>
  );
};

export default StoreEventPage;
