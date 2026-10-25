import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiChevronRight } from "react-icons/fi";

interface HomeNoticeBannerProps {
  to: string;
  title: string;
  dateText: string;
}

// 히어로 바로 아래 공지 띠: 위아래 테두리를 두른 종이 띠 + NEW 뱃지 + 흐르는 제목 + 오른쪽 화살표
const HomeNoticeBanner = ({ to, title, dateText }: HomeNoticeBannerProps) => {
  const { t } = useTranslation();

  // 같은 문구 두 벌을 이어 붙여 끊김 없이 흐르게 함
  const item = (
    <span className="flex shrink-0 items-baseline gap-2 pr-14">
      <span className="font-body-kr text-[15px] font-bold leading-6">{title}</span>
      <span className="font-typewriter text-[12px] leading-4 opacity-60">{dateText}</span>
    </span>
  );

  return (
    <Link
      to={to}
      className="flex items-center gap-3 border-y-2 border-ink bg-paper py-[10px] pl-5 pr-3 text-ink active:bg-cream"
      aria-label="공지사항으로 이동"
    >
      <span className="shrink-0 rounded-full border border-ink bg-rust px-3 py-[2px] font-typewriter text-[12px] font-bold leading-4 text-paper">
        {t("notice.new")}
      </span>
      {/* 양 끝을 흐리게 해 글자가 잘리지 않고 스며들듯 흐름 */}
      <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-16px),transparent)]">
        <div className="flex w-max animate-[marquee_14s_linear_infinite] motion-reduce:animate-none">
          {item}
          {item}
        </div>
      </div>
      <FiChevronRight size={18} aria-hidden className="shrink-0 opacity-60" />
    </Link>
  );
};

export default HomeNoticeBanner;
