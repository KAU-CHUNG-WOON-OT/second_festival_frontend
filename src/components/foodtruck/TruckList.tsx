import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';
import TruckCard from './TruckCard';
import EmptyState from '../common/EmptyState';
import type { FoodTruckData } from '../../data/foodTruckData';

interface TruckListProps {
  trucks: FoodTruckData[];
  onTruckClick: (truck: FoodTruckData) => void;
  // 결과가 없을 때 필터·검색어 초기화
  onReset: () => void;
}

const TruckList = ({ trucks, onTruckClick, onReset }: TruckListProps) => {
  const { t } = useTranslation();

  if (trucks.length === 0) {
    return (
      <EmptyState
        icon={<FiSearch size={32} />}
        message={t('search.noResults')}
        action={{ label: t('search.reset'), onClick: onReset }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {trucks.map((truck) => (
        <TruckCard key={truck.id} truck={truck} onClick={() => onTruckClick(truck)} />
      ))}
    </div>
  );
};

export default TruckList;
