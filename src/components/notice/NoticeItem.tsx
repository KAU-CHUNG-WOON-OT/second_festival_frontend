import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import type { NoticeData } from "../../data/noticeData";
import noticeIcon from "../../assets/notice_icon.svg";

interface NoticeItemProps {
  notice: NoticeData;
  onClick: () => void;
}

const NoticeItem = ({ notice, onClick }: NoticeItemProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === "ENG";

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer active:scale-[0.98] transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(180,190,210,0.5)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
        <img src={noticeIcon} alt="공지" className="w-4 h-4 object-contain opacity-60" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {notice.isNew && (
            <span className="shrink-0 rounded-md bg-gradient-to-r from-[#ff2056] to-[#f6339a] px-1.5 py-0.5 text-[9px] font-bold text-white">
              {t('notice.new')}
            </span>
          )}
          {notice.isImportant && (
            <span className="shrink-0 rounded-md bg-[#FF6B35]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#FF6B35]">
              {t('notice.important')}
            </span>
          )}
        </div>
        <p className="text-[13px] font-semibold text-[#1a2a5e] truncate">
          {isEng ? notice.title_en : notice.title}
        </p>
        <p className="text-[10px] text-[#8a94a6]">{notice.date}</p>
      </div>

      <svg className="w-3.5 h-3.5 text-[#8a94a6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

export default NoticeItem;