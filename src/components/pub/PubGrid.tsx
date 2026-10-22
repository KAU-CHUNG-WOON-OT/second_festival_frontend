import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';
import PubCard from './PubCard';
import EmptyState from '../common/EmptyState';
import type { PubData } from '../../data/pubData';

interface PubGridProps {
  pubs: PubData[];
  onPubClick: (pub: PubData) => void;
  // 결과가 없을 때 검색어 초기화
  onReset: () => void;
}

const PubGrid = ({ pubs, onPubClick, onReset }: PubGridProps) => {
  const { t } = useTranslation();

  if (pubs.length === 0) {
    return (
      <EmptyState
        icon={<FiSearch size={32} />}
        message={t('search.noResults')}
        action={{ label: t('search.reset'), onClick: onReset }}
      />
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
