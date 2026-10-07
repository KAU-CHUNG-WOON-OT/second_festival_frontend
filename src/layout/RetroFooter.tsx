import { useTranslation } from 'react-i18next';
import youtubeIcon from '../assets/footer_youtube.svg';
import instagramIcon from '../assets/footer_instagram.svg';

interface RetroFooterProps {
  // 홈 화면용: 줄무늬가 푸터 안쪽에 들어가고 여백·글자가 더 큼
  large?: boolean;
}

const RetroFooter = ({ large = false }: RetroFooterProps) => {
  const { t } = useTranslation();
  const iconBoxClass = `flex items-center justify-center rounded-[12px] bg-cream ${large ? 'size-11' : 'size-10'}`;

  return (
    <footer className="w-full">
      {!large && <div className="h-[6px] w-full bg-retro-stripe" />}
      <div
        className={`flex flex-col items-center bg-ink px-5 text-center text-paper ${large ? 'py-10' : 'py-7'}`}
      >
        {large && <div className="mb-6 h-2 w-full max-w-[320px] rounded-full bg-retro-stripe" />}
        <p
          className={`font-body-kr font-semibold ${large ? 'text-[16px] leading-6' : 'text-[14px] leading-5'}`}
        >
          {t('footer.organization')}
        </p>
        <div className={`flex gap-3 ${large ? 'pt-5' : 'pt-3'}`}>
          <a
            href="https://www.youtube.com/@kau_students"
            target="_blank"
            rel="noreferrer"
            aria-label="유튜브"
            className={iconBoxClass}
          >
            <img src={youtubeIcon} alt="" width={18} height={13} />
          </a>
          <a
            href="https://www.instagram.com/kau_students?igsh=MXRpNmF0MzA3MHZudA=="
            target="_blank"
            rel="noreferrer"
            aria-label="인스타그램"
            className={iconBoxClass}
          >
            <img src={instagramIcon} alt="" width={18} height={18} />
          </a>
        </div>
        <p className={`font-typewriter text-[12px] leading-4 opacity-60 ${large ? 'pt-5' : 'pt-3'}`}>
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default RetroFooter;
