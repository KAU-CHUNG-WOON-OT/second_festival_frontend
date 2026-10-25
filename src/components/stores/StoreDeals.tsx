import { FiInfo } from 'react-icons/fi';
import { formatDealPrice, type StoreDeal, type StoreEvent } from '../../data/storeEventData';

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
            {/* '할인 1,000원'처럼 할인 표시를 금액 앞에 둔다 */}
            {deal.discount && (
              <span className="rounded-[4px] bg-rust px-[6px] py-[2px] font-body-kr text-[12px] font-bold leading-4 text-paper">
                {isEng ? 'OFF' : '할인'}
              </span>
            )}
            <span className="font-typewriter text-[18px] font-bold leading-6">{formatDealPrice(deal.price, isEng)}</span>
          </span>
        )}
      </li>
    ))}
  </ul>
);

// 가게 카드·가게 화면 공통: 묶음 없는 행사, 조건별 묶음(일반/예약), 맨 아래 안내
const StoreDeals = ({ store, isEng }: { store: StoreEvent; isEng: boolean }) => (
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
);

export default StoreDeals;
