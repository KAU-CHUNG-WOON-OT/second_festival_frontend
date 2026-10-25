import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';
import BoothCard from './BoothCard';
import EmptyState from '../common/EmptyState';
import type { BoothData } from '../../data/boothData';

interface BoothGridProps {
  booths: BoothData[];
  onBoothClick: (booth: BoothData) => void;
  // 결과가 없을 때 필터·검색어 초기화 (필터가 있는 화면에서만)
  onReset?: () => void;
}

const BoothGrid = ({ booths, onBoothClick, onReset }: BoothGridProps) => {
  const { t } = useTranslation();

  if (booths.length === 0) {
    return (
      <EmptyState
        icon={<FiSearch size={32} />}
        message={t('search.noResults')}
        action={onReset ? { label: t('search.reset'), onClick: onReset } : undefined}
      />
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
