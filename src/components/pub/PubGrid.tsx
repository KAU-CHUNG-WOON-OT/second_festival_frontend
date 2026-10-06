import { useTranslation } from 'react-i18next';
import PubCard from './PubCard';
import BoothCardSkeleton from '../yard/BoothCardSkeleton';
import type { PubData } from '../../data/pubData';

interface PubGridProps {
  pubs: PubData[];
  onPubClick: (pub: PubData) => void;
  isLoading?: boolean;
}

const PubGrid = ({ pubs, onPubClick, isLoading = false }: PubGridProps) => {
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

  if (pubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-ink/50">
        <span className="mb-2 font-body-kr text-[32px]">⌕</span>
        <p className="font-body-kr text-[14px] font-medium">{t('search.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {pubs.map((pub) => (
        <PubCard key={pub.id} pub={pub} onClick={() => onPubClick(pub)} />
      ))}
    </div>
  );
};

export default PubGrid;