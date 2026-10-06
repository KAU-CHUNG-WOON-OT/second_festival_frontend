import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import logoImg from '../../assets/cheongun_logo.svg';
import type { FoodTruckData } from '../../data/foodTruckData';
import { useBarLike } from '../../hooks/useBarLike';
import LoginRequiredPopup from '../common/LoginRequiredPopup';

interface TruckCardProps {
  truck: FoodTruckData;
  onClick: () => void;
}

const TruckCard = ({ truck, onClick }: TruckCardProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const { likeCount, likedByMe, handleLike, isLogin } = useBarLike(truck.id, truck.likes ?? 0);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const onLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLogin) {
      setIsLoginPopupOpen(true);
      return;
    }
    await handleLike(e);
  };

  const handleKakaoLogin = () => {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    window.location.href = `${apiBase}/oauth2/authorization/kakao`;
  };

  return (
    <>
      <div
        onClick={onClick}
        className="flex cursor-pointer items-center gap-3 rounded-[16px] border-2 border-ink bg-paper px-4 py-[14px] text-ink drop-shadow-[4px_4px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
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

        <button
          type="button"
          onClick={onLike}
          aria-label="좋아요"
          className="flex shrink-0 items-center gap-1 rounded-full border border-ink px-3 py-1 font-typewriter text-[13px] font-bold"
        >
          <span className={likedByMe ? 'text-rust' : undefined}>{likedByMe ? '♥' : '♡'}</span>
          {likeCount}
        </button>
      </div>

      {isLoginPopupOpen && (
        <LoginRequiredPopup
          onCancel={() => setIsLoginPopupOpen(false)}
          onLogin={handleKakaoLogin}
        />
      )}
    </>
  );
};

export default TruckCard;
