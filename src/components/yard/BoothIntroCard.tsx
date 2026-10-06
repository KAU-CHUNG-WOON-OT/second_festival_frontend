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
    <section className="rounded-[16px] border-2 border-ink bg-paper p-5 text-ink drop-shadow-[5px_5px_0px_var(--color-ink)]">
      <h2 className="font-display text-[20px] leading-7">{isEng ? "Introduction" : "부스 소개"}</h2>
      <p className="whitespace-pre-line pt-2 font-body-kr text-[16px] leading-6">{content}</p>
    </section>
  );
};

export default BoothIntroCard;
