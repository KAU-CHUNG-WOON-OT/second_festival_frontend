import { useTranslation } from 'react-i18next';
import TruckCard from './TruckCard';
import TruckCardSkeleton from './TruckCardSkeleton';
import type { FoodTruckData } from '../../data/foodTruckData';

interface TruckListProps {
  trucks: FoodTruckData[];
  onTruckClick: (truck: FoodTruckData) => void;
  isLoading?: boolean;
}

const TruckList = ({ trucks, onTruckClick, isLoading = false }: TruckListProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <TruckCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (trucks.length === 0) {
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
    <div className="flex flex-col gap-2.5">
      {trucks.map((truck) => (
        <TruckCard
          key={truck.id}
          truck={truck}
          onClick={() => onTruckClick(truck)}
        />
      ))}
    </div>
  );
};

export default TruckList;