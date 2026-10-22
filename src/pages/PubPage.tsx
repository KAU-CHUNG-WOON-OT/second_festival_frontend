import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import FestivalMap from '../components/common/FestivalMap';
import SearchBar from '../components/common/SearchBar';
import StickyBar from '../components/common/StickyBar';
import MapModal from '../components/common/MapModal';
import PubGrid from '../components/pub/PubGrid';
import day1Pub from '../assets/day1_pub.jpg';
import day1Pub2 from '../assets/day1_pub2.jpg';
import { dummyPubs } from '../data/pubData';
import { useUrlFilters } from '../hooks/useUrlFilters';

// TODO: 새 축제 주점 배치도로 교체 (현재 지난 축제 1일차 이미지)
const PUB_MAP_IMAGES = [
  { src: day1Pub, label: '주점 배치도 1' },
  { src: day1Pub2, label: '주점 배치도 2' },
];
const FILTER_DEFAULTS = { q: '' };

// 시안이 없어 부스 정보 시안과 같은 구성으로 맞춤
const PubPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { filters, setFilter, resetFilters } = useUrlFilters(FILTER_DEFAULTS);
  const [mapImageSrc, setMapImageSrc] = useState<string | null>(null);

  const query = filters.q.trim().toLowerCase();
  const filteredPubs = dummyPubs.filter(
    (pub) =>
      query === '' ||
      pub.name.toLowerCase().includes(query) ||
      pub.name_en.toLowerCase().includes(query) ||
      pub.booth.toLowerCase().includes(query) ||
      pub.category.includes(query),
  );

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader showMenu />

      <RetroPageTitle title={t('nav.pub')} />

      <div className="pt-6">
        <FestivalMap images={PUB_MAP_IMAGES} onClick={setMapImageSrc} />
      </div>
      {/* 스크롤해도 검색창은 상단바 아래에 붙어 있다 */}
      <StickyBar>
        <SearchBar value={filters.q} onChange={(q) => setFilter('q', q)} placeholder={t('search.pubPlaceholder')} />
      </StickyBar>
      <div className="pt-5">
        <PubGrid pubs={filteredPubs} onPubClick={(pub) => navigate(`/pub/${pub.id}`)} onReset={resetFilters} />
      </div>

      <MapModal isOpen={!!mapImageSrc} onClose={() => setMapImageSrc(null)} imageSrc={mapImageSrc ?? ''} />
    </div>
  );
};

export default PubPage;
