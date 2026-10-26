import { useLanguage, type Language } from "../../contexts/LanguageContext";

const OPTIONS: Language[] = ["KOR", "ENG"];

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex rounded-full border border-paper/80 bg-ink/40 p-[2px] backdrop-blur-[8px]">
      {OPTIONS.map((option) => {
        const isActive = language === option;
        return (
          <button
            key={option}
            type="button"
            // 지금 언어를 눌러도 다른 언어로 바뀐다
            onClick={toggleLanguage}
            aria-pressed={isActive}
            className={`rounded-full px-3 py-[6px] font-typewriter text-[12px] font-bold leading-4 ${
              isActive ? "bg-mustard text-ink" : "text-paper"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageToggle;
