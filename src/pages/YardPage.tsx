import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMaximize2 } from 'react-icons/fi';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import MapModal from '../components/common/MapModal';
import CategoryList from '../components/common/CategoryList';
import StickyBar from '../components/common/StickyBar';
import BoothGrid from '../components/yard/BoothGrid';
import BoothMap from '../components/yard/BoothMap';
import { useLanguage } from '../contexts/LanguageContext';
import { CATEGORIES, dummyBooths } from '../data/boothData';
import { useUrlFilters } from '../hooks/useUrlFilters';

const FILTER_DEFAULTS = { category: '전체' };

// 부스 정보: 배치도 아래에 분류 칩과 부스 목록 (검색 없음)
const YardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const { filters, setFilter, resetFilters } = useUrlFilters(FILTER_DEFAULTS);
  const [isMapZoomOpen, setIsMapZoomOpen] = useState(false);

  const filteredBooths = dummyBooths.filter(
    (booth) => filters.category === '전체' || booth.category === filters.category,
  );

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader showMenu />

      <RetroPageTitle title={t('nav.yard')} />

      <button
        type="button"
        onClick={() => setIsMapZoomOpen(true)}
        aria-label="부스 지도 크게 보기"
        className="mt-6 rounded-[16px] border-2 border-ink bg-paper p-5 text-left shadow-[5px_5px_0px_0px_var(--color-ink)]"
      >
        <span className="flex justify-between font-typewriter text-[12px] font-bold leading-4">
          <span>CAMPUS BOOTH MAP</span>
          <span className="flex items-center gap-1 opacity-60">
            {language === 'ENG' ? 'Tap to zoom' : '탭하면 확대'} <FiMaximize2 size={12} aria-hidden />
          </span>
        </span>
        <span className="block pt-2">
          <BoothMap />
        </span>
      </button>

      {/* 스크롤해도 분류 칩은 상단바 아래에 붙어 있다 */}
      <StickyBar>
        <CategoryList
          categories={CATEGORIES}
          selectedCategory={filters.category}
          onSelect={(category) => setFilter('category', category)}
        />
      </StickyBar>
      <div className="pt-5">
        <BoothGrid
          booths={filteredBooths}
          onBoothClick={(booth) => navigate(`/yard/${booth.id}`)}
          onReset={resetFilters}
        />
      </div>

      <MapModal isOpen={isMapZoomOpen} onClose={() => setIsMapZoomOpen(false)}>
        <BoothMap />
      </MapModal>
    </div>
  );
};

export default YardPage;
