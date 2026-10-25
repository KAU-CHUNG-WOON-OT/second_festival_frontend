import { FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import logoImg from '../../assets/cheongun_logo.svg';
import type { FoodTruckData } from '../../data/foodTruckData';

interface TruckCardProps {
  truck: FoodTruckData;
  onClick: () => void;
}

const TruckCard = ({ truck, onClick }: TruckCardProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[16px] border-2 border-ink bg-paper px-4 py-[14px] text-left text-ink shadow-[4px_4px_0px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
    >
      <img
        src={truck.logo_img || logoImg}
        alt={`${truck.name} 로고`}
        onError={(e) => {
          e.currentTarget.src = logoImg;
        }}
        className="size-11 shrink-0 rounded-[8px] border border-ink bg-paper object-contain"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-[18px] leading-7">{truck.name}</h3>
        <p className="truncate font-body-kr text-[13px] leading-5 opacity-70">
          {isEng ? truck.tags_en.join('  ') : truck.tags.join('  ')}
        </p>
      </div>

      <FiChevronRight size={22} aria-hidden className="shrink-0 opacity-60" />
    </button>
  );
};

export default TruckCard;
