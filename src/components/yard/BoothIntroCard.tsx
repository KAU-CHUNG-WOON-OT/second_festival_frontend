import { useLanguage } from "../../contexts/LanguageContext";

interface BoothIntroCardProps {
  introduction?: string;
  introduction_en?: string;
}

const BoothIntroCard = ({ introduction, introduction_en }: BoothIntroCardProps) => {
  const { language } = useLanguage();
  const isEng = language === "ENG";
  const content = isEng && introduction_en ? introduction_en : introduction;

  if (!content) return null;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
      <h3 className="text-[14px] font-bold text-[#2B3A5C] mb-3">
        {isEng ? "Introduction" : "부스 소개"}
      </h3>
      <p className="text-[13px] text-[#3a4558] leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
};

export default BoothIntroCard;