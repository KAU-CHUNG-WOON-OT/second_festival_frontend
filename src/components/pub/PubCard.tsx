import { useLanguage } from '../../contexts/LanguageContext';
import type { PubData } from '../../data/pubData';

interface PubCardProps {
  pub: PubData;
  onClick: () => void;
}

const PubCard = ({ pub, onClick }: PubCardProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-2.5 transition-all duration-200 cursor-pointer active:scale-[0.96] flex flex-col items-center justify-center text-center aspect-square"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(180,190,210,0.5)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="mb-2 flex items-center justify-center overflow-hidden w-20 h-20 rounded-xl">
        {pub.logo_img && (
          <img src={pub.logo_img} alt={`${pub.name} 로고`} className="w-full h-full object-cover" />
        )}
      </div>
      
      <h3 className="font-semibold text-[#2B3A5C] text-[12px] leading-tight break-keep mb-0.5">
        {isEng ? pub.name_en : pub.name}
      </h3>
      <p className="text-[10px] font-medium text-[#9ca3af] whitespace-pre-line">{pub.booth}</p>
    </div>
  );
};

export default PubCard;