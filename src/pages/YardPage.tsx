import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMaximize2 } from 'react-icons/fi';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import MapModal from '../components/common/MapModal';
import CategoryList from '../components/common/CategoryList';
import SearchBar from '../components/common/SearchBar';
import StickyBar from '../components/common/StickyBar';
import BoothGrid from '../components/yard/BoothGrid';
import BoothMap from '../components/yard/BoothMap';
import { CATEGORIES, dummyBooths } from '../data/boothData';
import { useUrlFilters } from '../hooks/useUrlFilters';

const FILTER_DEFAULTS = { category: '전체', q: '' };

const YardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { filters, setFilter, resetFilters } = useUrlFilters(FILTER_DEFAULTS);
  const [isMapZoomOpen, setIsMapZoomOpen] = useState(false);

  const query = filters.q.trim().toLowerCase();
  const filteredBooths = dummyBooths.filter((booth) => {
    const matchesCategory = filters.category === '전체' || booth.category === filters.category;
    const matchesSearch =
      query === '' ||
      booth.name.toLowerCase().includes(query) ||
      booth.name_en.toLowerCase().includes(query) ||
      booth.booth.toLowerCase().includes(query) ||
      booth.category.includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader showMenu />

      <RetroPageTitle title={t('nav.yard')} />

      <button
        type="button"
        onClick={() => setIsMapZoomOpen(true)}
        aria-label="부스 지도 크게 보기"
        className="mt-6 rounded-[16px] border-2 border-ink bg-paper p-5 text-left drop-shadow-[5px_5px_0px_var(--color-ink)]"
      >
        <span className="flex justify-between font-typewriter text-[12px] font-bold leading-4">
          <span>CAMPUS BOOTH MAP</span>
          <span className="flex items-center gap-1 opacity-60">
            탭하면 확대 <FiMaximize2 size={12} aria-hidden />
          </span>
        </span>
        <span className="block pt-2">
          <BoothMap />
        </span>
      </button>

      {/* 스크롤해도 분류·검색창은 상단바 아래에 붙어 있다 */}
      <StickyBar>
        <CategoryList
          categories={CATEGORIES}
          selectedCategory={filters.category}
          onSelect={(category) => setFilter('category', category)}
        />
        <div className="pt-4">
          <SearchBar
            value={filters.q}
            onChange={(q) => setFilter('q', q)}
            placeholder={t('search.boothPlaceholder')}
          />
        </div>
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
