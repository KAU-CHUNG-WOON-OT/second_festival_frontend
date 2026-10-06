import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../contexts/LanguageContext";
import RetroPageHeader from "../components/common/RetroPageHeader";
import LoginRequiredPopup from "../components/common/LoginRequiredPopup";
import Poster from "../components/common/Poster";
import InfoCard from "../components/common/InfoCard";
import MenuList, { type InitialMenuLike } from "../components/common/MenuList";
import exPhoto from "../assets/ex_photo.png";
import { dummyTrucks, type FoodTruckData } from "../data/foodTruckData";
import { fetchTruckLikes } from "../lib/api/truck";
import { useBarLike } from "../hooks/useBarLike";
import { track } from '@/lib/mixpanel';

const handleKakaoLogin = () => {
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  window.location.href = `${apiBase}/oauth2/authorization/kakao`;
};

const TruckLikeButton = ({ truck }: { truck: FoodTruckData }) => {
  const { likeCount, likedByMe, handleLike, isLogin } = useBarLike(truck.id, truck.likes ?? 0);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          if (!isLogin) {
            setIsLoginPopupOpen(true);
            return;
          }
          handleLike(e);
        }}
        aria-label="좋아요"
        className="flex shrink-0 items-center gap-1 rounded-full border border-ink bg-paper px-3 py-1 font-typewriter text-[14px] font-bold leading-5"
      >
        <span className={likedByMe ? "text-rust" : undefined}>{likedByMe ? "♥" : "♡"}</span>
        {likeCount}
      </button>
      {isLoginPopupOpen && (
        <LoginRequiredPopup onCancel={() => setIsLoginPopupOpen(false)} onLogin={handleKakaoLogin} />
      )}
    </>
  );
};

const FoodTruckDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === "ENG";

  const truck = dummyTrucks.find((t) => t.id === Number(id));

  const { data: truckLikes } = useQuery({
    queryKey: ['truck', 'likes'],
    queryFn: fetchTruckLikes,
    staleTime: 30 * 1000,
  });

  const menuLikesData = useMemo<Record<number, InitialMenuLike> | undefined>(() => {
    if (!truckLikes || !truck) return undefined;
    const bar = truckLikes.find((b) => b.barId === truck.id);
    if (!bar) return undefined;
    const map: Record<number, InitialMenuLike> = {};
    bar.menus.forEach((m) => {
      map[m.menuId] = { likeCount: m.likeCount, likedByMe: m.likedByMe };
    });
    return map;
  }, [truckLikes, truck]);

  useEffect(() => {
    if (id) track('foodtruck_detail_viewed', { foodtruck_id: Number(id) });
  }, [id]);

  if (!truck) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-ink/60">
        <p className="font-display text-lg">{t('common.truckNotFound')}</p>
        <button onClick={() => navigate(-1)} className="mt-4 font-body-kr text-sm underline">
          {t('common.backToList')}
        </button>
      </div>
    );
  }

  const infoRows = [
    { label: isEng ? "Days"  : "운영 일자",  value: truck.operatingDays },
    { label: isEng ? "Hours" : "운영 시간",  value: truck.operatingTime },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader title={t('header.foodtruckGuide')} />
      <Poster images={[truck.poster || exPhoto]} name={truck.name} />
      <InfoCard rows={infoRows} title={truck.name} titleAction={<TruckLikeButton truck={truck} />} highlight />
      <MenuList
        menu={truck.menu}
        showLikes={true}
        likePrefix="menu"
        initialLikesData={menuLikesData}
      />
    </div>
  );
};

export default FoodTruckDetailPage;
