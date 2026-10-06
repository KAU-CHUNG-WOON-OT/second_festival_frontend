import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HomeNoticeBannerProps {
  to: string;
  title: string;
  dateText: string;
}

const HomeNoticeBanner = ({ to, title, dateText }: HomeNoticeBannerProps) => {
  const { t } = useTranslation();

  // 같은 문구 두 벌을 이어 붙여 끊김 없이 흐르게 함
  const item = (
    <span className="flex shrink-0 items-center gap-2 pr-16">
      <span className="font-body-kr text-[16px] font-bold leading-6">📢 {title}</span>
      <span className="font-typewriter text-[12px] leading-4 opacity-60">{dateText}</span>
    </span>
  );

  return (
    <Link
      to={to}
      className="flex items-center gap-3 border-y border-ink bg-paper px-4 py-3 text-ink"
      aria-label="공지사항으로 이동"
    >
      <span className="shrink-0 rounded-[4px] bg-rust px-2 py-[2px] font-typewriter text-[12px] font-bold leading-4 text-paper">
        {t("notice.new")}
      </span>
      <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
        <div className="flex w-max animate-[marquee_14s_linear_infinite]">
          {item}
          {item}
        </div>
      </div>
    </Link>
  );
};

export default HomeNoticeBanner;
