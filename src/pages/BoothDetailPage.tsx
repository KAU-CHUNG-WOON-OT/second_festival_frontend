import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import RetroPageHeader from '../components/common/RetroPageHeader';
import Poster from '../components/common/Poster';
import InfoCard from '../components/common/InfoCard';
import BoothIntroCard from '../components/yard/BoothIntroCard';
import MenuList from '../components/common/MenuList';
import PaymentCard from '../components/common/PaymentCard';
import { dummyBooths } from '../data/boothData';
import { track } from '@/lib/mixpanel';

const BoothDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const booth = dummyBooths.find((b) => b.id === Number(id));

  useEffect(() => {
    if (id) track('booth_detail_viewed', { booth_id: Number(id) });
  }, [id]);

  if (!booth) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-ink/60">
        <p className="font-display text-lg">{t('common.boothNotFound')}</p>
        <button onClick={() => navigate(-1)} className="mt-4 font-body-kr text-sm underline">
          {t('common.backToList')}
        </button>
      </div>
    );
  }

  const infoRows = [
    { label: isEng ? 'Type' : '구분', value: booth.category },
    { label: isEng ? 'Hours' : '운영 시간', value: booth.operatingTime },
    { label: isEng ? 'Booth' : '부스 위치', value: booth.booth },
    { label: isEng ? 'Instagram' : '인스타그램', value: booth.insta },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader title={isEng ? booth.name_en : booth.name} />

      {booth.poster && booth.poster.length > 0 && (
        <Poster images={booth.poster} name={isEng ? booth.name_en : booth.name} zoomTitle="부스 포스터" />
      )}
      <InfoCard rows={infoRows} />
      <BoothIntroCard introduction={booth.introduction} introduction_en={booth.introduction_en} />
      <MenuList menu={booth.menu} showLikes={true} likePrefix="menu" title="판매 · 참여 항목" />
      <PaymentCard account={booth.account} qrCode={booth.qr_img} />
    </div>
  );
};

export default BoothDetailPage;
