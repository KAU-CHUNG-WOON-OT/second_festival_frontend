import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import Poster from "../components/common/Poster";
import InfoCard from "../components/common/InfoCard";
import MenuList from "../components/common/MenuList";
import PaymentCard from "../components/common/PaymentCard";
import Footer from "../layout/Footer";
import { dummyPubs } from "../data/pubData";
import { track } from '@/lib/mixpanel';

const PubDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === "ENG";
  const scrollRef = useRef<HTMLDivElement>(null);

  const pub = dummyPubs.find((p) => p.id === Number(id));

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (id) track('pub_detail_viewed', { pub_id: Number(id) });
  }, [id]);

  if (!pub) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/60">
        <p className="text-lg font-semibold">{t('common.pubNotFound')}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm underline">
          {t('common.backToList')}
        </button>
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
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 24px)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 24px)",
      }}
    >
      
      <div className="mt-6"></div>
      {pub.poster && pub.poster.length > 0 && (
        <div className="px-5 mb-4">
          <Poster images={pub.poster} name={isEng ? pub.name_en : pub.name} />
        </div>
      )}

      <div className="px-5 mb-4">
        <InfoCard rows={infoRows} />
      </div>

      <div className="px-5 mb-4">
        <MenuList menu={pub.menu} showLikes={true} likePrefix="menu" />
      </div>

      <div className="px-5 mb-4">
        <PaymentCard account={pub.account} qrCode={pub.qr_img} />
      </div>

      <Footer />
    </div>
  );
};

export default PubDetailPage;