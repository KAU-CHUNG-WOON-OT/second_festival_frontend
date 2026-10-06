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
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <BoothCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (booths.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-ink/50">
        <span className="mb-2 font-body-kr text-[32px]">⌕</span>
        <p className="font-body-kr text-[14px] font-medium">{t('search.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {booths.map((booth) => (
        <BoothCard key={booth.id} booth={booth} onClick={() => onBoothClick(booth)} />
      ))}
    </div>
  );
};

export default BoothGrid;