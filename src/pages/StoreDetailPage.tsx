import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import RetroPageHeader from '../components/common/RetroPageHeader';
import EmptyState from '../components/common/EmptyState';
import StoreDeals from '../components/stores/StoreDeals';
import StoreLiveStatus from '../components/stores/StoreLiveStatus';
import { useLanguage } from '../contexts/LanguageContext';
import { hasStoreDeals, storeEvents } from '../data/storeEventData';
import { track } from '@/lib/mixpanel';

const CARD = 'rounded-[16px] border-2 border-ink bg-paper p-5 text-ink shadow-[5px_5px_0px_0px_var(--color-ink)]';

// 가게 화면: 실시간 현황(혼잡도)과 축제 행사 내용. 시안이 없어 다른 상세 화면과 같은 구성으로 맞춤
const StoreDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const store = storeEvents.find((s) => s.id === Number(id));

  useEffect(() => {
    if (id) track('store_detail_viewed', { store_id: Number(id) });
  }, [id]);

  if (!store) {
    return (
      <div className="flex flex-col gap-6 px-5 pb-16 pt-5">
        <RetroPageHeader />
        <EmptyState
          message={isEng ? 'Store not found.' : '가게 정보를 찾을 수 없습니다.'}
          action={{ label: isEng ? 'Back to list' : '목록으로', onClick: () => navigate('/stores') }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader title={store.name} />

      {store.image && (
        <img
          src={store.image}
          alt={isEng ? `${store.name} storefront` : `${store.name} 가게 사진`}
          className="aspect-video w-full rounded-[16px] border-2 border-ink object-cover shadow-[5px_5px_0px_0px_var(--color-ink)]"
        />
      )}

      {/* 행사 없이 안내만 있는 가게(두꺼비하우스 등)는 '축제 행사' 카드 대신 사진 밑에 글자만 작게 */}
      {!hasStoreDeals(store) && store.note && (
        <p className="-mt-3 px-1 text-right font-body-kr text-[13px] leading-5 text-paper/80">
          {isEng ? store.note_en : store.note}
        </p>
      )}

      {/* 실시간 혼잡도: 지금 단계와 바뀐 시각 (30초마다 새로 받음) */}
      <StoreLiveStatus storeId={store.id} isEng={isEng} />

      {/* 네이버 지도의 가게 페이지 (거기서 길찾기). 휴대폰에서는 네이버 지도 앱으로 이어진다 */}
      {store.naverMapUrl && (
        <a
          href={store.naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('store_directions_clicked', { store_id: store.id })}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-paper font-display text-[18px] leading-7 text-ink shadow-[4px_4px_0px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
        >
          <FiMapPin size={20} aria-hidden />
          {isEng ? 'Directions on Naver Map' : '네이버 지도로 길찾기'}
        </a>
      )}

      {(store.intro || store.about) && (
        <section className={CARD}>
          <p className="font-typewriter text-[12px] leading-4 opacity-60">ABOUT</p>
          <h2 className="pt-2 font-display text-[22px] leading-7">{isEng ? 'About the store' : '가게 소개'}</h2>
          {store.intro && (
            <p className="whitespace-pre-line pt-3 font-body-kr text-[15px] font-semibold leading-[22px]">
              {isEng ? store.intro_en : store.intro}
            </p>
          )}
          {store.about?.map((section) => (
            <div key={section.label} className="mt-4 border-t border-dashed border-ink/30 pt-4">
              <p className="flex items-center gap-2">
                <span className="rounded-full bg-ink px-3 py-1 font-typewriter text-[12px] font-bold leading-4 text-paper">
                  {isEng ? section.label_en : section.label}
                </span>
                <span className="font-display text-[18px] leading-6">{isEng ? section.title_en : section.title}</span>
              </p>
              <p className="pt-2 font-body-kr text-[14px] leading-5 opacity-80">{isEng ? section.body_en : section.body}</p>
            </div>
          ))}
        </section>
      )}

      {hasStoreDeals(store) && (
        <section className={CARD}>
          <p className="font-typewriter text-[12px] leading-4 opacity-60">FESTIVAL DEALS</p>
          <h2 className="pb-4 pt-2 font-display text-[22px] leading-7">{isEng ? 'Festival deals' : '축제 행사'}</h2>
          <StoreDeals store={store} isEng={isEng} />
        </section>
      )}
    </div>
  );
};

export default StoreDetailPage;
