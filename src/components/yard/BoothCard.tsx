import { useLanguage } from '../../contexts/LanguageContext';
import type { BoothData } from '../../data/boothData';

interface BoothCardProps {
  booth: BoothData;
  onClick: () => void;
}

const BoothCard = ({ booth, onClick }: BoothCardProps) => {
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
        {booth.logo_img && (
          <img src={booth.logo_img} alt={`${booth.name} 로고`} className="w-full h-full object-cover" />
        )}
      </div>
      
      <h3 className="font-semibold text-[#2B3A5C] text-[12px] leading-tight break-keep mb-0.5">
        {isEng ? booth.name_en : booth.name}
      </h3>
      <p className="text-[10px] font-medium text-[#9ca3af] whitespace-pre-line">{booth.booth}</p>
    </div>
  );
};

export default BoothCard;