import { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../contexts/LanguageContext";
import Poster from "../components/common/Poster";
import InfoCard from "../components/common/InfoCard";
import MenuList, { type InitialMenuLike } from "../components/common/MenuList";
import Footer from "../layout/Footer";
import exPhoto from "../assets/ex_photo.png";
import { dummyTrucks } from "../data/foodTruckData";
import { fetchTruckLikes } from "../lib/api/truck";
import { track } from '@/lib/mixpanel';

const FoodTruckDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === "ENG";
  const scrollRef = useRef<HTMLDivElement>(null);

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
    scrollRef.current?.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (id) track('foodtruck_detail_viewed', { foodtruck_id: Number(id) });
  }, [id]);

  if (!truck) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/60">
        <p className="text-lg font-semibold">{t('common.truckNotFound')}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm underline">
          {t('common.backToList')}
        </button>
      </div>
    );
  }

  const infoRows = [
    { label: isEng ? "Name"  : "트럭 이름",  value: truck.name },
    { label: isEng ? "Days"  : "운영 일자",  value: truck.operatingDays },
    { label: isEng ? "Hours" : "운영 시간",  value: truck.operatingTime },
  ];

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 24px)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 24px)",
      }}
    >
      <div className="px-5 mt-6 mb-4">
        <Poster images={[truck.poster || exPhoto]} name={truck.name} />
      </div>
      <div className="px-5 mb-4">
        <InfoCard rows={infoRows} />
      </div>
      <div className="px-5 mb-4">
        <MenuList
          menu={truck.menu}
          showLikes={true}
          likePrefix="menu"
          initialLikesData={menuLikesData}
        />
      </div>
      <Footer />
    </div>
  );
};

export default FoodTruckDetailPage;