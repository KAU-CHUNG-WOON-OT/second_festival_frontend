import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DayHeader, { getFestivalDayIndex } from '../components/common/DayHeader';
import FestivalMap from '../components/common/FestivalMap';
import SearchBar from '../components/common/SearchBar';
import MapModal from '../components/common/MapModal';
import PubGrid from '../components/pub/PubGrid';
import Footer from '../layout/Footer';
import day1Pub from '../assets/day1_pub.jpg';
import day1Pub2 from '../assets/day1_pub2.jpg';
import day3Pub from '../assets/day3_pub.png';
import day3Pub2 from '../assets/day3_pub2.jpg';
import { dummyPubs } from '../data/pubData';

const PUB_MAP_IMAGES = [
  [
    { src: day1Pub,  label: '주점 배치도 1' },
    { src: day1Pub2, label: '주점 배치도 2' },
  ],
  null,
  [
    { src: day3Pub,  label: '주점 배치도 1' },
    { src: day3Pub2, label: '주점 배치도 2' },
  ],
];

const PubPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getInitialDay = () => {
    const day = getFestivalDayIndex();
    return day === 1 ? 0 : day;
  };

  const [selectedDay, setSelectedDay] = useState(getInitialDay);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapImageSrc, setMapImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const pubMapImages = PUB_MAP_IMAGES[selectedDay];

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setSearchQuery('');
  };

  const filteredPubs = dummyPubs.filter((pub) => {
    const matchesSearch =
      searchQuery === '' ||
      pub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.booth.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.category.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6">
        <DayHeader
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          hiddenDays={[1]}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {pubMapImages && (
          <div className="px-6 pt-3">
            <FestivalMap
              key={selectedDay}
              images={pubMapImages}
              onClick={(src) => { setMapImageSrc(src); setMapModalOpen(true); }}
            />
          </div>
        )}
        <div className="px-6 mt-3.5 mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t('search.pubPlaceholder')} />
        </div>
        <div className="px-6 mb-4">
          <PubGrid pubs={filteredPubs} onPubClick={(pub) => navigate(`/pub/${pub.id}`)} isLoading={isLoading} />
        </div>
        <Footer />
      </div>
      <MapModal isOpen={mapModalOpen} onClose={() => setMapModalOpen(false)} imageSrc={mapImageSrc} />
    </div>
  );
};

export default PubPage;