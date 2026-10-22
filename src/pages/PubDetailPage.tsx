import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import RetroPageHeader from "../components/common/RetroPageHeader";
import EmptyState from "../components/common/EmptyState";
import Poster from "../components/common/Poster";
import InfoCard from "../components/common/InfoCard";
import MenuList from "../components/common/MenuList";
import PaymentCard from "../components/common/PaymentCard";
import { dummyPubs } from "../data/pubData";
import { track } from '@/lib/mixpanel';

// 시안이 없어 부스 상세 시안과 같은 구성으로 맞춤
const PubDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === "ENG";

  const pub = dummyPubs.find((p) => p.id === Number(id));

  useEffect(() => {
    if (id) track('pub_detail_viewed', { pub_id: Number(id) });
  }, [id]);

  if (!pub) {
    return (
      <div className="flex flex-col gap-6 px-5 pb-16 pt-5">
        <RetroPageHeader />
        <EmptyState
          message={t('common.pubNotFound')}
          action={{ label: t('common.backToList'), onClick: () => navigate('/pub') }}
        />
      </div>
    );
  }

  const infoRows = [
    { label: isEng ? "Dept."      : "학과",      value: isEng ? pub.name_en : pub.name },
    { label: isEng ? "Hours"      : "운영 시간",  value: pub.operatingTime },
    { label: isEng ? "Location"   : "주점 위치",  value: pub.booth },
    { label: isEng ? "Instagram"  : "인스타그램", value: pub.insta },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader title={isEng ? pub.name_en : pub.name} />
      {pub.poster && pub.poster.length > 0 && (
        <Poster images={pub.poster} name={isEng ? pub.name_en : pub.name} zoomTitle="주점 포스터" />
      )}
      <InfoCard rows={infoRows} />
      <MenuList menu={pub.menu} />
      <PaymentCard account={pub.account} qrCode={pub.qr_img} />
    </div>
  );
};

export default PubDetailPage;
