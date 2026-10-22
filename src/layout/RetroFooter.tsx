import { useTranslation } from 'react-i18next';
import youtubeIcon from '../assets/footer_youtube.svg';
import instagramIcon from '../assets/footer_instagram.svg';

const RetroFooter = () => {
  const { t } = useTranslation();
  const iconBoxClass = 'flex size-11 items-center justify-center rounded-[12px] bg-cream';

  return (
    <footer className="flex w-full flex-col items-center border-t border-ink/10 bg-paper px-5 py-8 text-center text-ink">
      <p className="font-body-kr text-[14px] font-semibold leading-5">{t('footer.organization')}</p>
      <div className="flex gap-3 pt-4">
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
      <p className="pt-4 font-typewriter text-[12px] leading-4 opacity-60">{t('footer.copyright')}</p>
    </footer>
  );
};

export default RetroFooter;
