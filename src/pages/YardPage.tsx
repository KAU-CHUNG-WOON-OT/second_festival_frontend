import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DayHeader, { getFestivalDayIndex } from '../components/common/DayHeader';
import FestivalMap from '../components/common/FestivalMap';
import CategoryList from '../components/common/CategoryList';
import SearchBar from '../components/common/SearchBar';
import BoothGrid from '../components/yard/BoothGrid';
import MapModal from '../components/common/MapModal';
import Footer from '../layout/Footer';
import day1Yard from '../assets/day1_yard.jpg';
import day1Yard2 from '../assets/day1_yard2.jpg';
import day2Yard from '../assets/day2_yard.jpg';
import day2Yard2 from '../assets/day2_yard2.jpg';
import day3Yard from '../assets/day3_yard.jpg';
import day3Yard2 from '../assets/day3_yard2.jpg';
import { CATEGORIES, dummyBooths } from '../data/boothData';

const BOOTH_MAP_IMAGES = [
  [
    { src: day1Yard,  label: '부스 배치도 1' },
    { src: day1Yard2, label: '부스 배치도 2' },
  ],
  [
    { src: day2Yard,  label: '부스 배치도 1' },
    { src: day2Yard2, label: '부스 배치도 2' },
  ],
  [
    { src: day3Yard,  label: '부스 배치도 1' },
    { src: day3Yard2, label: '부스 배치도 2' },
  ],
];

const YardPage = () => {
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

  const boothMapImages = selectedDay >= 0 ? BOOTH_MAP_IMAGES[selectedDay] : null;

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setSelectedCategory('전체');
  };

  const filteredBooths = dummyBooths.filter((booth) => {
    let matchesDay = true;
    if (selectedDay === 0) {
      matchesDay = booth.id >= 101 && booth.id <= 112;
    } else if (selectedDay === 1) {
      matchesDay = booth.id === 101 || (booth.id >= 113 && booth.id <= 118);
    } else if (selectedDay === 2) {
      matchesDay = booth.id >= 101 && booth.id <= 112;
    }

    const matchesCategory = selectedCategory === '전체' || booth.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      booth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booth.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booth.booth.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booth.category.includes(searchQuery);

    return matchesDay && matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6">
        <DayHeader selectedDay={selectedDay} onSelectDay={handleSelectDay} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {boothMapImages && (
          <div className="px-5 pt-3">
            <FestivalMap
              key={selectedDay}
              images={boothMapImages}
              onClick={(src) => { setMapImageSrc(src); setMapModalOpen(true); }}
            />
          </div>
        )}
        <div className="px-6">
          <CategoryList
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
        <div className="px-5 mt-3.5 mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('search.menuPlaceholder')}
          />
        </div>
        <div className="px-5 mb-4">
          <BoothGrid
            booths={filteredBooths}
            onBoothClick={(booth) => navigate(`/yard/${booth.id}`)}
            isLoading={isLoading}
          />
        </div>
        <Footer />
      </div>
      <MapModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        imageSrc={mapImageSrc}
      />
    </div>
  );
};

export default YardPage;