import { FiInstagram, FiYoutube } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-white">
      <div className="mx-auto flex max-w-[402px] flex-col items-center gap-[16px] px-[32px] py-[24px] text-center min-[402px]:px-[72px]">
        <p className="whitespace-nowrap text-[14px] font-medium leading-[22px] text-[#4a5565]">
          {t('footer.organization')}
        </p>
        <div className="flex items-center gap-[12px] text-[#4a5565]">
          <a href="https://www.youtube.com/@kau_students" target="_blank" rel="noreferrer" aria-label="유튜브" className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-[#f1f3f5]">
            <FiYoutube size={22} />
          </a>
          <a href="https://www.instagram.com/kau_students?igsh=MXRpNmF0MzA3MHZudA==" target="_blank" rel="noreferrer" aria-label="인스타그램" className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-[#f1f3f5]">
            <FiInstagram size={22} />
          </a>
        </div>
        <p className="whitespace-nowrap text-[11px] font-medium leading-[22px] text-[#4a5565]">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;