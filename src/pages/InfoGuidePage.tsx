import { useEffect, useRef, useState } from 'react';
import Footer from '../layout/Footer';
import logoImg from '../assets/logo.svg';
import { useLanguage } from '../contexts/LanguageContext';
import {
  goodsItems,
  goodsNotices,
  goodsNoticesEn,
  goodsSaleInfo,
  locationItems,
  partnerItems,
} from '../data/infoGuideData';

type Tab = 'goods' | 'location' | 'partner';

const TAB_LABELS: Record<Tab, { ko: string; en: string }> = {
  location: { ko: '위치 안내', en: 'Location' },
  goods:    { ko: '굿즈 안내', en: 'Goods' },
  partner:  { ko: '제휴사 안내', en: 'Partners' },
};

const ImagePlaceholder = ({ className = '', isEng = false }: { className?: string; isEng?: boolean }) => (
  <div className={`flex items-center justify-center bg-white/20 ${className}`}>
    <span className="text-[12px] font-medium text-white/40">
      {isEng ? 'Coming soon' : '사진 준비 중'}
    </span>
  </div>
);

// ════════════════════════════════════════════════
//  스켈레톤
// ════════════════════════════════════════════════
const SKELETON_SHELL =
  'rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 animate-pulse';

const GoodsSkeleton = () => (
  <div className="flex flex-col gap-3 pb-6">
    {/* 현장 판매 안내 */}
    <div className={`${SKELETON_SHELL} p-4`}>
      <div className="mb-3 h-4 w-24 rounded-md bg-white/70" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-3/4 rounded-md bg-white/60" />
        <div className="h-3 w-2/3 rounded-md bg-white/60" />
        <div className="h-3 w-1/2 rounded-md bg-white/60" />
      </div>
    </div>

    {/* 굿즈 그리드 */}
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`${SKELETON_SHELL} overflow-hidden`}>
          <div className="h-28 w-full bg-white/55" />
          <div className="flex flex-col gap-1.5 p-3">
            <div className="h-3 w-3/4 rounded-md bg-white/70" />
            <div className="h-2.5 w-1/2 rounded-md bg-white/60" />
          </div>
        </div>
      ))}
    </div>

    {/* 안내사항 */}
    <div className={`${SKELETON_SHELL} p-4`}>
      <div className="mb-3 h-4 w-20 rounded-md bg-white/70" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 w-full rounded-md bg-white/60" />
        ))}
      </div>
    </div>
  </div>
);

const LocationSkeleton = () => (
  <div className="flex flex-col gap-2 pb-6">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className={`${SKELETON_SHELL} px-4 py-3.5`}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-white/70" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-3 w-1/3 rounded-md bg-white/70" />
            <div className="h-2.5 w-2/3 rounded-md bg-white/60" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const PartnerSkeleton = () => (
  <div className="flex flex-col gap-3 pb-6">
    <div className="h-3 w-20 rounded-md bg-white/40 animate-pulse" />
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className={`${SKELETON_SHELL} overflow-hidden`}>
        <div className="h-32 w-full bg-white/55" />
        <div className="flex flex-col gap-2 p-4">
          <div className="h-4 w-1/2 rounded-md bg-white/70" />
          <div className="h-2.5 w-2/3 rounded-md bg-white/60" />
          <div className="mt-2 flex flex-col gap-1.5">
            <div className="h-3 w-3/4 rounded-md bg-white/60" />
            <div className="h-3 w-2/3 rounded-md bg-white/60" />
          </div>
          <div className="mt-2 h-10 w-full rounded-xl bg-white/50" />
        </div>
      </div>
    ))}
  </div>
);

const useTabLoading = (delay = 600) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return isLoading;
};

// ════════════════════════════════════════════════
//  굿즈 안내
// ════════════════════════════════════════════════
const GoodsTab = () => {
  const isLoading = useTabLoading();
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  if (isLoading) return <GoodsSkeleton />;
  return (
  <div className="flex flex-col gap-3 pb-6">
    <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 p-4">
      <p className="text-[13px] font-bold text-[#2B3A5C] mb-2.5">
        {isEng ? 'On-site Sales' : '현장 판매 안내'}
      </p>
      <div className="flex flex-col gap-1.5 text-[12px]">
        <div className="flex gap-2">
          <span className="text-[#2B3A5C]/50 w-16 flex-shrink-0">{isEng ? 'Location' : '판매 장소'}</span>
          <span className="font-semibold text-[#2B3A5C]">
            {isEng ? goodsSaleInfo.location_en : goodsSaleInfo.location}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-[#2B3A5C]/50 w-16 flex-shrink-0">{isEng ? 'Hours' : '판매 시간'}</span>
          <span className="font-semibold text-[#2B3A5C]">
            {isEng ? goodsSaleInfo.hours_en : goodsSaleInfo.hours}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-[#2B3A5C]/50 w-16 flex-shrink-0">{isEng ? 'Payment' : '결제 방법'}</span>
          <span className="font-semibold text-[#2B3A5C]">
            {isEng ? goodsSaleInfo.payment_en : goodsSaleInfo.payment}
          </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      {goodsItems.map((item) => (
        <div
          key={item.id}
          className="relative rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 overflow-hidden"
        >
          {item.badge && (
            <span
              className={`absolute top-2.5 right-2.5 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${
                item.badge === 'BEST' ? 'bg-orange-400' : 'bg-[#3B6FB5]'
              }`}
            >
              {item.badge}
            </span>
          )}
          {item.imageUrl
            ? <img src={item.imageUrl} alt={item.name} className="w-full h-28 object-cover" />
            : <ImagePlaceholder className="h-28 w-full" isEng={isEng} />
          }
          <div className="p-3">
            <p className="text-[13px] font-bold text-[#2B3A5C]">
              {isEng ? item.name_en : item.name}
            </p>
            {/* ✅ 0원이면 사전 예약 상품으로 표시 */}
            <p className="mt-0.5 text-[12px] text-[#2B3A5C]/60">
              {item.price === 0
                ? (isEng ? 'Pre-order' : '사전 예약 상품')
                : (isEng ? `KRW ${item.price.toLocaleString()}` : `${item.price.toLocaleString()}원`)}
            </p>
          </div>
        </div>
      ))}
    </div>

    <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 p-4">
      <p className="text-[13px] font-bold text-[#2B3A5C] mb-2.5">
        {isEng ? 'Notice' : '안내사항'}
      </p>
      <ul className="flex flex-col gap-2">
        {(isEng ? goodsNoticesEn : goodsNotices).map((notice, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px] text-[#2B3A5C]/80 leading-relaxed">
            <span className="text-[#3B6FB5] flex-shrink-0 mt-px">•</span>
            {notice}
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

// ════════════════════════════════════════════════
//  위치 안내
// ════════════════════════════════════════════════
const LocationTab = () => {
  const isLoading = useTabLoading();
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const [openId, setOpenId] = useState<number | null>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const setItemRef = (id: number) => (el: HTMLDivElement | null) => {
    if (el) itemRefs.current.set(id, el);
    else itemRefs.current.delete(id);
  };

  const handleToggle = (id: number) => {
    setOpenId((prev) => {
      const next = prev === id ? null : id;
      if (next !== null) {
        // 새로 열린 항목을 화면 중앙으로 스크롤 (펼침 애니메이션 끝난 후)
        window.setTimeout(() => {
          itemRefs.current
            .get(id)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 320);
      }
      return next;
    });
  };

  if (isLoading) return <LocationSkeleton />;

  return (
    <div className="flex flex-col gap-3 pb-6">
      <div className="flex flex-col gap-2">
        {locationItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              ref={setItemRef(item.id)}
              className="overflow-hidden rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 scroll-mt-24 scroll-mb-24"
            >
              <button onClick={() => handleToggle(item.id)} className="flex w-full items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/60 flex-shrink-0 overflow-hidden">
                    <img
                      src={logoImg}
                      alt="청운 로고"
                      className="w-5 h-5 object-contain"
                      style={{ filter: 'grayscale(100%) brightness(0.55)' }}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-bold text-[#2B3A5C]">
                      {isEng ? item.name_en : item.name}
                    </p>
                    {!isOpen && (
                      <p className="text-[11px] text-[#2B3A5C]/55 mt-0.5">
                        {isEng ? item.detail_en : item.detail}
                      </p>
                    )}
                  </div>
                </div>
                <span className={`text-[#2B3A5C]/40 text-[18px] font-light transition-transform duration-200 inline-block ${isOpen ? 'rotate-90' : ''}`}>
                  ›
                </span>
              </button>

              <div className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="min-h-0">
                <div className="px-4 pb-4">
                  <p className="text-[12px] text-[#2B3A5C]/55 mb-2.5">
                    {isEng ? item.detail_en : item.detail}
                  </p>
                  <div className="overflow-hidden rounded-xl border border-white/30">
                    {item.images && item.images.length > 0 ? (
                      <div className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {item.images.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt={`${item.name} ${i + 1}`}
                            className="w-full flex-shrink-0 snap-start object-cover"
                          />
                        ))}
                      </div>
                    ) : item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full object-cover" />
                    ) : (
                      <ImagePlaceholder className="h-44 w-full rounded-xl" isEng={isEng} />
                    )}
                  </div>
                </div>
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════
//  제휴사 안내
// ════════════════════════════════════════════════
const PartnerTab = () => {
  const isLoading = useTabLoading();
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  if (isLoading) return <PartnerSkeleton />;
  return (
  <div className="flex flex-col gap-3 pb-6">
    <p className="text-[13px] text-white/60">
      {isEng ? `${partnerItems.length} Partners` : `입점부스 ${partnerItems.length}개`}
    </p>
    {partnerItems.map((partner) => (
      <div key={partner.id} className="overflow-hidden rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40">
        <div className="relative">
          {partner.imageUrl
            ? <img src={partner.imageUrl} alt={partner.name} className="w-full h-32 object-cover" />
            : <ImagePlaceholder className="h-32 w-full" isEng={isEng} />
          }
        </div>
        <div className="p-4">
          <p className="text-[15px] font-bold text-[#2B3A5C]">{partner.name}</p>
          <p className="mt-0.5 whitespace-pre-line text-[12px] text-[#2B3A5C]/55">
            {isEng ? partner.description_en : partner.description}
          </p>
          <div className="mt-3 flex flex-col gap-1.5 text-[12px] text-[#2B3A5C]/70">
            <div className="flex gap-2">
              <span className="text-[#2B3A5C]/40 w-12 flex-shrink-0">{isEng ? 'Dates' : '운영일'}</span>
              <span>{isEng ? partner.hours_en : partner.hours}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#2B3A5C]/40 w-12 flex-shrink-0">{isEng ? 'Items' : '품목'}</span>
              <span>{(isEng ? partner.tags_en : partner.tags).join(' · ')}</span>
            </div>
          </div>
          {partner.benefit && (
            <div className="mt-3 rounded-xl bg-[#3B6FB5]/10 border border-[#3B6FB5]/15 px-3.5 py-2.5">
              <p className="text-[11px] font-bold text-[#3B6FB5] mb-0.5">
                {isEng ? 'Special Offer' : '특별 혜택'}
              </p>
              <p className="text-[12px] text-[#2B3A5C]/75 leading-relaxed">
                {isEng ? partner.benefit_en : partner.benefit}
              </p>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
  );
};

// ════════════════════════════════════════════════
//  메인 페이지
// ════════════════════════════════════════════════
const InfoGuidePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('location');
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const tabOrder: Tab[] = ['location', 'goods', 'partner'];

  return (
    <div className="flex min-h-full flex-col">
      <div className="px-6 pt-8 pb-5">
        <h1 className="text-[34px] font-extrabold text-white tracking-tight leading-tight mt-3 mb-5">
          {isEng ? TAB_LABELS[activeTab].en : TAB_LABELS[activeTab].ko}
        </h1>
        <div className="flex gap-2">
          {tabOrder.map((tabId) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={`flex-1 py-2 rounded-full text-[12px] font-bold transition-all duration-200 ${
                activeTab === tabId
                  ? 'bg-white text-[#3B6FB5] shadow-[0_2px_12px_rgba(255,255,255,0.35)]'
                  : 'bg-white/20 text-white border border-white/30'
              }`}
            >
              {isEng ? TAB_LABELS[tabId].en : TAB_LABELS[tabId].ko}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 pt-1">
        {activeTab === 'goods'    && <GoodsTab />}
        {activeTab === 'location' && <LocationTab />}
        {activeTab === 'partner'  && <PartnerTab />}
      </div>

      <Footer />
    </div>
  );
};

export default InfoGuidePage;