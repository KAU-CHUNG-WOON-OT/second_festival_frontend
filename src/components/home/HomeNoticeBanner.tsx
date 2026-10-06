import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HomeNoticeBannerProps {
  to: string;
  title: string;
  dateText: string;
}

const HomeNoticeBanner = ({ to, title, dateText }: HomeNoticeBannerProps) => {
  const { t } = useTranslation();

  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl px-4 py-3.5 active:scale-[0.98] transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.45)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
      aria-label="공지사항으로 이동"
    >
      {/* 왼쪽 포인트 바 */}
      <div
        className="w-1 self-stretch rounded-full flex-shrink-0"
        style={{ background: "linear-gradient(180deg, #ff8099, #ffaac0)" }}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-bold leading-none"
            style={{
              background: "rgba(255,160,185,0.25)",
              color: "#e05070",
            }}
          >
            {t('notice.new')}
          </span>
          <span className="text-[11px] text-[#8a94a6]">{dateText}</span>
        </div>
        <p className="truncate text-[13px] font-bold text-[#1d293d]">{title}</p>
      </div>

      <svg className="w-4 h-4 text-[#8a94a6] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
};

export default HomeNoticeBanner;