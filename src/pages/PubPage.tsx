import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import FestivalMap from '../components/common/FestivalMap';
import SearchBar from '../components/common/SearchBar';
import MapModal from '../components/common/MapModal';
import PubGrid from '../components/pub/PubGrid';
import day1Pub from '../assets/day1_pub.jpg';
import day1Pub2 from '../assets/day1_pub2.jpg';
import { dummyPubs } from '../data/pubData';

// TODO: 새 축제 주점 배치도로 교체 (현재 지난 축제 1일차 이미지)
const PUB_MAP_IMAGES = [
  { src: day1Pub, label: '주점 배치도 1' },
  { src: day1Pub2, label: '주점 배치도 2' },
];

// 시안이 없어 부스 정보 시안과 같은 구성으로 맞춤
const PubPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mapImageSrc, setMapImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader />

      <RetroPageTitle title={t('nav.pub')} showDate />

      <div className="pt-6">
        <FestivalMap images={PUB_MAP_IMAGES} onClick={setMapImageSrc} />
      </div>
      <div className="pt-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={t('search.pubPlaceholder')} />
      </div>
      <div className="pt-5">
        <PubGrid pubs={filteredPubs} onPubClick={(pub) => navigate(`/pub/${pub.id}`)} isLoading={isLoading} />
      </div>

      <MapModal isOpen={!!mapImageSrc} onClose={() => setMapImageSrc(null)} imageSrc={mapImageSrc ?? ''} />
    </div>
  );
};

export default PubPage;
