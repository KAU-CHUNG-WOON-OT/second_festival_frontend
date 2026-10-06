import { useTranslation } from 'react-i18next';
import youtubeIcon from '../assets/footer_youtube.svg';
import instagramIcon from '../assets/footer_instagram.svg';

const RetroFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full">
      <div className="h-[6px] w-full bg-[linear-gradient(90deg,var(--color-rust)_0%,var(--color-rust)_33.3%,var(--color-mustard)_33.3%,var(--color-mustard)_66.6%,var(--color-sky-light)_66.6%,var(--color-sky-light)_100%)]" />
      <div className="flex flex-col items-center bg-ink px-5 py-7 text-center text-paper">
        <p className="font-body-kr text-[14px] font-semibold leading-5">{t('footer.organization')}</p>
        <div className="flex gap-3 pt-3">
          <a
            href="https://www.youtube.com/@kau_students"
            target="_blank"
            rel="noreferrer"
            aria-label="유튜브"
            className="flex size-10 items-center justify-center rounded-[12px] bg-cream"
          >
            <img src={youtubeIcon} alt="" width={18} height={13} />
          </a>
          <a
            href="https://www.instagram.com/kau_students?igsh=MXRpNmF0MzA3MHZudA=="
            target="_blank"
            rel="noreferrer"
            aria-label="인스타그램"
            className="flex size-10 items-center justify-center rounded-[12px] bg-cream"
          >
            <img src={instagramIcon} alt="" width={18} height={18} />
          </a>
        </div>
        <p className="pt-3 font-typewriter text-[12px] leading-4 opacity-60">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default RetroFooter;
