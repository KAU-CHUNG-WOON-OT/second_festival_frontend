import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RetroPageHeader from '../components/common/RetroPageHeader';
import EmptyState from '../components/common/EmptyState';
import StoreDeals from '../components/stores/StoreDeals';
import { useLanguage } from '../contexts/LanguageContext';
import { storeEvents } from '../data/storeEventData';
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
          message={isEng ? 'Store not found.' : '가게 정보를 찾을 수 없어요.'}
          action={{ label: isEng ? 'Back to list' : '목록으로', onClick: () => navigate('/stores') }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader title={store.name} />

      {/* 실시간 혼잡도: 백엔드 API가 생기면 이 카드에 현재 상태와 바뀐 시각을 보여 준다 */}
      <section className={CARD}>
        <div className="flex items-center justify-between gap-3">
          <p className="font-typewriter text-[12px] leading-4 opacity-60">LIVE STATUS</p>
          <span className="rounded-full border border-ink/30 px-3 py-[2px] font-body-kr text-[12px] font-bold leading-4 text-ink/60">
            {isEng ? 'Coming soon' : '준비 중'}
          </span>
        </div>
        <h2 className="pt-2 font-display text-[22px] leading-7">{isEng ? 'Live status' : '실시간 현황'}</h2>
        <p className="pt-2 font-body-kr text-[14px] leading-[22px] text-ink/70">
          {isEng
            ? 'How busy this store is right now will appear here soon.'
            : '지금 가게가 얼마나 붐비는지 곧 여기에서 볼 수 있어요.'}
        </p>
      </section>

      <section className={CARD}>
        <p className="font-typewriter text-[12px] leading-4 opacity-60">FESTIVAL DEALS</p>
        <h2 className="pb-4 pt-2 font-display text-[22px] leading-7">{isEng ? 'Festival deals' : '축제 행사'}</h2>
        <StoreDeals store={store} isEng={isEng} />
      </section>
    </div>
  );
};

export default StoreDetailPage;
