import { useTranslation } from 'react-i18next';
import BoothCard from './BoothCard';
import BoothCardSkeleton from './BoothCardSkeleton';
import type { BoothData } from '../../data/boothData';

interface BoothGridProps {
  booths: BoothData[];
  onBoothClick: (booth: BoothData) => void;
  isLoading?: boolean;
}

const BoothGrid = ({ booths, onBoothClick, isLoading = false }: BoothGridProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-5 mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <BoothCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (booths.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="text-[14px] font-medium">{t('search.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 mx-auto">
      {booths.map((booth) => (
        <BoothCard key={booth.id} booth={booth} onClick={() => onBoothClick(booth)} />
      ))}
    </div>
  );
};

export default BoothGrid;