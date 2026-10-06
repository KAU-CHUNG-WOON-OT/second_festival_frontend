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
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <TruckCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (trucks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-ink/50">
        <span className="mb-2 font-body-kr text-[32px]">⌕</span>
        <p className="font-body-kr text-[14px] font-medium">{t('search.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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