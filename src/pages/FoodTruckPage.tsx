import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RetroPageHeader from '../components/common/RetroPageHeader';
import FestivalMap from '../components/common/FestivalMap';
import CategoryList from '../components/common/CategoryList';
import SearchBar from '../components/common/SearchBar';
import MapModal from '../components/common/MapModal';
import TruckList from '../components/foodtruck/TruckList';
import day13Food from '../assets/day1,3_food.jpg';
import { TRUCK_CATEGORIES, dummyTrucks } from '../data/foodTruckData';
import { FESTIVAL_DATE_LABEL } from '../data/timetableData';

// TODO: 새 축제 푸드트럭 배치도로 교체 (현재 지난 축제 이미지)
const TRUCK_MAP_IMAGES = [{ src: day13Food, label: '푸드트럭 배치도' }];

// 시안이 없어 부스 정보 시안과 같은 구성으로 맞춤
const FoodTruckPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapImageSrc, setMapImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredTrucks = dummyTrucks.filter((truck) => {
    const matchesCategory = selectedCategory === '전체' || truck.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      truck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      truck.tags_en.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      truck.category.includes(searchQuery);
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
      <h1 className="pt-2 font-display text-[60px] leading-[60px]">{t('nav.foodtruck')}</h1>

      <div className="pt-6">
        <FestivalMap images={TRUCK_MAP_IMAGES} onClick={setMapImageSrc} />
      </div>
      <div className="pt-6">
        <CategoryList categories={TRUCK_CATEGORIES} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
      </div>
      <div className="pt-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t('search.menuPlaceholder')} />
      </div>
      <div className="pt-5">
        <TruckList
          trucks={filteredTrucks}
          onTruckClick={(truck) => navigate(`/foodtruck/${truck.id}`)}
          isLoading={isLoading}
        />
      </div>

      <MapModal isOpen={!!mapImageSrc} onClose={() => setMapImageSrc(null)} imageSrc={mapImageSrc ?? ''} />
    </div>
  );
};

export default FoodTruckPage;
