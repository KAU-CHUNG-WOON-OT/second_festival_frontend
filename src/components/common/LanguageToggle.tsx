import { useLanguage } from "../../contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  const isKor = language === "KOR";

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center rounded-full p-0.5 transition-all duration-300 active:scale-95"
      style={{
        background: "rgba(255,255,255,0.2)",
        border: "1px solid rgba(255,255,255,0.3)",
        width: "64px",
        height: "28px",
      }}
    >
      <div
        className="absolute top-0.5 rounded-full transition-all duration-300"
        style={{
          width: "28px",
          height: "22px",
          background: "linear-gradient(135deg, #4ade80, #22c55e)",
          left: isKor ? "2px" : "calc(100% - 30px)",
          boxShadow: "0 1px 4px rgba(34,197,94,0.4)",
        }}
      />
      <span
        className="relative z-10 flex-1 text-center text-[10px] font-bold transition-colors duration-300"
        style={{ color: isKor ? "white" : "rgba(255,255,255,0.6)" }}
      >
        KOR
      </span>
      <span
        className="relative z-10 flex-1 text-center text-[10px] font-bold transition-colors duration-300"
        style={{ color: !isKor ? "white" : "rgba(255,255,255,0.6)" }}
      >
        ENG
      </span>
    </button>
  );
};

export default LanguageToggle;