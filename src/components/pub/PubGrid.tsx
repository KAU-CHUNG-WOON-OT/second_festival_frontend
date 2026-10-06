import { useTranslation } from 'react-i18next';
import PubCard from './PubCard';
import PubCardSkeleton from './PubCardSkeleton';
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
      <div className="grid grid-cols-2 gap-5 mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <PubCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (pubs.length === 0) {
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
      {pubs.map((pub) => (
        <PubCard key={pub.id} pub={pub} onClick={() => onPubClick(pub)} />
      ))}
    </div>
  );
};

export default PubGrid;