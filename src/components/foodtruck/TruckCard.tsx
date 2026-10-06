import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import logoImg from "../../assets/logo.svg";
import type { FoodTruckData } from "../../data/foodTruckData";
import { useBarLike } from "../../hooks/useBarLike";

interface TruckCardProps {
  truck: FoodTruckData;
  onClick: () => void;
}

const TruckCard = ({ truck, onClick }: TruckCardProps) => {
  const { language } = useLanguage();
  const isEng = language === "ENG";
  const { likeCount, likedByMe, handleLike, isLogin } = useBarLike(truck.id, truck.likes ?? 0);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const onLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLogin) {
      setIsLoginPopupOpen(true);
      return;
    }
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    await handleLike(e);
  };

  const handleKakaoLogin = () => {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    window.location.href = `${apiBase}/oauth2/authorization/kakao`;
  };

  return (
    <>
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.5); }
          60%  { transform: scale(0.85); }
          100% { transform: scale(1); }
        }
        .heart-pop { animation: heartPop 0.4s ease; }
      `}</style>

      <div
        onClick={onClick}
        className="bg-white/55 backdrop-blur-sm border border-white/45 rounded-2xl px-4 py-3.5 flex items-center gap-3.5 cursor-pointer active:scale-[0.98] transition-all duration-200
          shadow-[0_1px_8px_rgba(0,0,0,0.04)]
          hover:bg-white/70 hover:shadow-[0_3px_12px_rgba(0,0,0,0.07)]"
      >
        <div className="w-11 h-11 rounded-xl bg-white/60 flex items-center justify-center overflow-hidden flex-shrink-0">
          {truck.logo_img ? (
            <img src={truck.logo_img} alt={`${truck.name} 로고`} className="w-full h-full object-cover" />
          ) : (
            <img src={logoImg} alt="기본 로고" className="w-7 h-7 object-contain opacity-20" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-[#2B3A5C] truncate">{truck.name}</h3>
          <p className="text-[12px] text-[#4d4d4d] truncate mt-0.5">
            {isEng ? truck.tags_en.join("  ") : truck.tags.join("  ")}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={onLike} className="flex items-center gap-1">
            <svg
              className={`w-4.5 h-4.5 ${isAnimating ? "heart-pop" : ""}`}
              fill={likedByMe ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "#f87171" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-[11px] font-medium text-[#8a94a6]">{likeCount}</span>
          </button>
          <svg className="w-4 h-4 text-[#bcc3cf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {isLoginPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 bg-black/20 backdrop-blur-[2px]">
          <div className="relative w-[280px]">
            <div className="absolute inset-x-0 bottom-[-8px] h-[18px] rounded-b-[18px] bg-[#8aa4d4]/60" />
            <div className="relative rounded-[20px] bg-white/95 backdrop-blur-md px-5 pb-4 pt-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <p className="text-center text-[13px] font-bold text-[#2B3A5C] mb-3">
                로그인이 필요한 서비스예요
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLoginPopupOpen(false)}
                  className="h-[38px] flex-1 rounded-[12px] bg-[#f1f3f6] text-[13px] font-bold text-[#8a94a6]"
                >
                  취소
                </button>
                <button
                  onClick={handleKakaoLogin}
                  className="h-[38px] flex-1 rounded-[12px] bg-[#2d54ba] text-[13px] font-bold text-white"
                >
                  로그인하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TruckCard;