import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import Poster from '../components/common/Poster';
import InfoCard from '../components/common/InfoCard';
import BoothIntroCard from '../components/yard/BoothIntroCard';
import MenuList from '../components/common/MenuList';
import PaymentCard from '../components/common/PaymentCard';
import Footer from '../layout/Footer';
import { dummyBooths } from '../data/boothData';
import { track } from '@/lib/mixpanel';

const BoothDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const scrollRef = useRef<HTMLDivElement>(null);

  const booth = dummyBooths.find((b) => b.id === Number(id));

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (id) track('booth_detail_viewed', { booth_id: Number(id) });
  }, [id]);

  if (!booth) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/60">
        <p className="text-lg font-semibold">{t('common.boothNotFound')}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm underline">
          {t('common.backToList')}
        </button>
      </div>
    );
  }

  const infoRows = [
    { label: isEng ? 'Dept.'     : '학과',      value: isEng ? booth.name_en : booth.name },
    { label: isEng ? 'Hours'     : '운영 시간',  value: booth.operatingTime },
    { label: isEng ? 'Booth'     : '부스 위치',  value: booth.booth },
    { label: isEng ? 'Instagram' : '인스타그램', value: booth.insta },
  ];

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 24px)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 24px)',
      }}
    >
      
      <div className="mt-6"></div>
      {booth.poster && booth.poster.length > 0 && (
        <div className="px-5 mb-4">
          <Poster images={booth.poster} name={isEng ? booth.name_en : booth.name} />
        </div>
      )}
      <div className="px-5 mb-4">
        <InfoCard rows={infoRows} />
      </div>
      <div className="px-5 mb-4">
        <BoothIntroCard introduction={booth.introduction} introduction_en={booth.introduction_en} />
      </div>
      <div className="px-5 mb-4">
        <MenuList menu={booth.menu} showLikes={true} likePrefix="menu" />
      </div>
      <div className="px-5 mb-4">
        {/* ✅ qr_img를 PaymentCard로 전달 */}
        <PaymentCard account={booth.account} qrCode={booth.qr_img} />
      </div>
      <Footer />
    </div>
  );
};

export default BoothDetailPage;