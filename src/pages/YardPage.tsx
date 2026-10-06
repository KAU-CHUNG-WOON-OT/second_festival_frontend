import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroDialog from '../components/common/RetroDialog';
import CategoryList from '../components/common/CategoryList';
import SearchBar from '../components/common/SearchBar';
import BoothGrid from '../components/yard/BoothGrid';
import BoothMap from '../components/yard/BoothMap';
import { CATEGORIES, dummyBooths } from '../data/boothData';
import { FESTIVAL_DATE_LABEL } from '../data/timetableData';

const YardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapZoomOpen, setIsMapZoomOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredBooths = dummyBooths.filter((booth) => {
    const matchesCategory = selectedCategory === '전체' || booth.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      booth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booth.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booth.booth.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booth.category.includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader />

      <div className="pt-8">
        <span className="inline-flex h-[38px] items-center rounded-full border border-ink bg-mustard px-4 font-display text-[18px] leading-7">
          활주로 · {FESTIVAL_DATE_LABEL}
        </span>
      </div>
      <h1 className="pt-2 font-display text-[60px] leading-[60px]">{t('nav.yard')}</h1>

      <button
        type="button"
        onClick={() => setIsMapZoomOpen(true)}
        aria-label="부스 지도 크게 보기"
        className="mt-6 rounded-[16px] border-2 border-ink bg-paper p-5 text-left drop-shadow-[5px_5px_0px_var(--color-ink)]"
      >
        <span className="flex justify-between font-typewriter text-[12px] font-bold leading-4">
          <span>CAMPUS BOOTH MAP</span>
          <span className="opacity-60">탭하면 확대 ⌕</span>
        </span>
        <span className="block pt-2">
          <BoothMap compact />
        </span>
      </button>

      <div className="pt-6">
        <CategoryList categories={CATEGORIES} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      </div>
      <div className="pt-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t('search.boothPlaceholder')} />
      </div>
      <div className="pt-5">
        <BoothGrid
          booths={filteredBooths}
          onBoothClick={(booth) => navigate(`/yard/${booth.id}`)}
          isLoading={isLoading}
        />
      </div>

      {isMapZoomOpen && (
        <RetroDialog title="CAMPUS BOOTH MAP" onClose={() => setIsMapZoomOpen(false)}>
          <BoothMap />
        </RetroDialog>
      )}
    </div>
  );
};

export default YardPage;
