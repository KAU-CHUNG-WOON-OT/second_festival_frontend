import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import RetroPageHeader from "../components/common/RetroPageHeader";
import EmptyState from "../components/common/EmptyState";
import Poster from "../components/common/Poster";
import InfoCard from "../components/common/InfoCard";
import MenuList from "../components/common/MenuList";
import exPhoto from "../assets/ex_photo.png";
import { dummyTrucks } from "../data/foodTruckData";
import { track } from '@/lib/mixpanel';

const FoodTruckDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === "ENG";

  const truck = dummyTrucks.find((t) => t.id === Number(id));

  useEffect(() => {
    if (id) track('foodtruck_detail_viewed', { foodtruck_id: Number(id) });
  }, [id]);

  if (!truck) {
    return (
      <div className="flex flex-col gap-6 px-5 pb-16 pt-5">
        <RetroPageHeader />
        <EmptyState
          message={
            dummyTrucks.length === 0
              ? isEng
                ? 'Food truck info will be announced soon.'
                : '푸드트럭 정보는 추후 공개 예정이에요.'
              : t('common.truckNotFound')
          }
          action={{ label: t('common.backToList'), onClick: () => navigate('/foodtruck') }}
        />
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
      <InfoCard rows={infoRows} title={truck.name} highlight />
      <MenuList menu={truck.menu} />
    </div>
  );
};

export default FoodTruckDetailPage;
