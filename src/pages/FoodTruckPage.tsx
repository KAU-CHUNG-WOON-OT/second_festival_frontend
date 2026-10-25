import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import FestivalMap from '../components/common/FestivalMap';
import CategoryList from '../components/common/CategoryList';
import SearchBar from '../components/common/SearchBar';
import StickyBar from '../components/common/StickyBar';
import MapModal from '../components/common/MapModal';
import TruckList from '../components/foodtruck/TruckList';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { useLanguage } from '../contexts/LanguageContext';
import day13Food from '../assets/day1,3_food.jpg';
import { TRUCK_CATEGORIES, dummyTrucks } from '../data/foodTruckData';

// TODO: 새 축제 푸드트럭 배치도로 교체 (현재 지난 축제 이미지)
const TRUCK_MAP_IMAGES = [{ src: day13Food, label: '푸드트럭 배치도' }];
const FILTER_DEFAULTS = { category: '전체', q: '' };

// 시안이 없어 부스 정보 시안과 같은 구성으로 맞춤
const FoodTruckPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const { filters, setFilter, resetFilters } = useUrlFilters(FILTER_DEFAULTS);
  const [mapImageSrc, setMapImageSrc] = useState<string | null>(null);

  // 공개 전 (data/foodTruckData의 목록이 비어 있음): 제목 아래 '추후 공개 예정'만
  if (dummyTrucks.length === 0) {
    return (
      <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
        <RetroPageHeader showMenu />
        <RetroPageTitle title={t('nav.foodtruck')} />
        <section className="mt-6 flex flex-col items-center rounded-[16px] border-2 border-ink bg-paper px-5 py-10 text-center shadow-[5px_5px_0px_0px_var(--color-ink)]">
          <p className="font-typewriter text-[12px] leading-4 tracking-[3.6px] opacity-60">COMING SOON</p>
          <p className="pt-3 font-display text-[26px] leading-8">{isEng ? 'Coming soon' : '추후 공개 예정'}</p>
          <p className="pt-2 font-body-kr text-[14px] leading-5 opacity-70">
            {isEng ? 'Food truck info will be announced soon.' : '푸드트럭 정보는 곧 공개돼요.'}
          </p>
        </section>
      </div>
    );
  }

  const query = filters.q.trim().toLowerCase();
  const filteredTrucks = dummyTrucks.filter((truck) => {
    const matchesCategory = filters.category === '전체' || truck.category === filters.category;
    // 검색창 안내가 '메뉴 검색'이므로 메뉴 이름까지 찾는다
    const matchesSearch =
      query === '' ||
      truck.name.toLowerCase().includes(query) ||
      truck.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      truck.tags_en.some((tag) => tag.toLowerCase().includes(query)) ||
      truck.menu.some((item) => item.name.includes(query) || item.name_en?.toLowerCase().includes(query)) ||
      truck.category.includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader showMenu />

      <RetroPageTitle title={t('nav.foodtruck')} />

      <div className="pt-6">
        <FestivalMap title="FOOD TRUCK MAP" images={TRUCK_MAP_IMAGES} onClick={setMapImageSrc} />
      </div>
      {/* 스크롤해도 분류·검색창은 상단바 아래에 붙어 있다 */}
      <StickyBar>
        <CategoryList
          categories={TRUCK_CATEGORIES}
          selectedCategory={filters.category}
          onSelect={(category) => setFilter('category', category)}
        />
        <div className="pt-4">
          <SearchBar
            value={filters.q}
            onChange={(q) => setFilter('q', q)}
            placeholder={t('search.menuPlaceholder')}
          />
        </div>
      </StickyBar>
      <div className="pt-5">
        <TruckList
          trucks={filteredTrucks}
          onTruckClick={(truck) => navigate(`/foodtruck/${truck.id}`)}
          onReset={resetFilters}
        />
      </div>

      <MapModal isOpen={!!mapImageSrc} onClose={() => setMapImageSrc(null)} imageSrc={mapImageSrc ?? ''} />
    </div>
  );
};

export default FoodTruckPage;
