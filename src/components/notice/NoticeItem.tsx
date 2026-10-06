import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import type { NoticeData } from "../../data/noticeData";

interface NoticeItemProps {
  notice: NoticeData;
  compact?: boolean;
  onClick: () => void;
}

const getNoticeIcon = (notice: NoticeData) => {
  if (notice.isNew) return "📢";
  if (notice.category === "공연") return "🎉";
  return "ℹ️";
};

const NoticeItem = ({ notice, compact = false, onClick }: NoticeItemProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isEng = language === "ENG";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[16px] border-2 border-ink bg-paper px-4 text-left text-ink drop-shadow-[4px_4px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] ${
        compact ? "py-3" : "py-4"
      }`}
    >
      <span className="font-body-kr text-[24px] leading-8">{getNoticeIcon(notice)}</span>
      {notice.isNew && (
        <span className="shrink-0 rounded-full border border-ink bg-rust px-3 py-[2px] font-typewriter text-[12px] font-bold leading-4 text-paper">
          {t("notice.new")}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[16px] leading-6">
          {isEng ? notice.title_en : notice.title}
        </p>
        <p className="pt-2 font-typewriter text-[12px] leading-4 opacity-60">{notice.date}</p>
      </div>
    </button>
  );
};

export default NoticeItem;
