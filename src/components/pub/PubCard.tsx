import { useLanguage } from '../../contexts/LanguageContext';
import type { PubData } from '../../data/pubData';
import logoImg from '../../assets/cheongun_logo.svg';

interface PubCardProps {
  pub: PubData;
  onClick: () => void;
}

// 시안이 없어 부스 카드와 같은 모양으로 맞춤
const PubCard = ({ pub, onClick }: PubCardProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[159px] w-full flex-col items-center gap-2 rounded-[16px] border-2 border-ink bg-paper px-3 py-6 text-center text-ink drop-shadow-[4px_4px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
    >
      <img
        src={pub.logo_img || logoImg}
        alt={`${pub.name} 로고`}
        onError={(e) => {
          e.currentTarget.src = logoImg;
        }}
        className="h-12 w-[68px] object-contain"
      />
      <h3 className="break-keep font-display text-[18px] leading-[22.5px]">
        {isEng ? pub.name_en : pub.name}
      </h3>
      <p className="whitespace-pre-line font-body-kr text-[14px] leading-5 opacity-70">
        {pub.booth}
      </p>
    </button>
  );
};

export default PubCard;
