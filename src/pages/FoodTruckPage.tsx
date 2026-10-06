import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DayHeader, { getFestivalDayIndex } from '../components/common/DayHeader';
import FestivalMap from '../components/common/FestivalMap';
import CategoryList from '../components/common/CategoryList';
import SearchBar from '../components/common/SearchBar';
import MapModal from '../components/common/MapModal';
import TruckList from '../components/foodtruck/TruckList';
import Footer from '../layout/Footer';
import day13Food from '../assets/day1,3_food.jpg';
import day2Food from '../assets/day2_food.jpg';
import { TRUCK_CATEGORIES, dummyTrucks } from '../data/foodTruckData';

const TRUCK_MAP_IMAGES = [
  [{ src: day13Food, label: '푸드트럭 배치도' }],
  [{ src: day2Food,  label: '푸드트럭 배치도' }],
  [{ src: day13Food, label: '푸드트럭 배치도' }],
];

const FoodTruckPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState(getFestivalDayIndex);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapImageSrc, setMapImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const truckMapImages = selectedDay >= 0 ? TRUCK_MAP_IMAGES[selectedDay] : null;

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setSelectedCategory('전체');
  };

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6">
        <DayHeader selectedDay={selectedDay} onSelectDay={handleSelectDay} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {truckMapImages && (
          <div className="px-5 pt-3">
            <FestivalMap
              key={selectedDay}
              images={truckMapImages}
              onClick={(src) => { setMapImageSrc(src); setMapModalOpen(true); }}
            />
          </div>
        )}
        <div className="px-6">
          <CategoryList
            categories={TRUCK_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
        <div className="px-5 mt-3.5 mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t('search.menuPlaceholder')} />
        </div>
        <div className="px-5 mb-4">
          <TruckList
            trucks={filteredTrucks}
            onTruckClick={(truck) => navigate(`/foodtruck/${truck.id}`)}
            isLoading={isLoading}
          />
        </div>
        <Footer />
      </div>
      <MapModal isOpen={mapModalOpen} onClose={() => setMapModalOpen(false)} imageSrc={mapImageSrc} />
    </div>
  );
};

export default FoodTruckPage;