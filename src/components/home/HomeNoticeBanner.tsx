import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiChevronRight } from "react-icons/fi";

interface HomeNoticeBannerProps {
  to: string;
  title: string;
  dateText: string;
  // 공지 목록과 같은 뱃지 (HOT 노랑, NEW 주황). 없으면 뱃지 없이
  badge?: 'hot' | 'new';
}

// 히어로 바로 아래 공지 띠: 위아래 테두리를 두른 종이 띠 + HOT·NEW 뱃지 + 흐르는 제목 + 오른쪽 화살표.
// 기기의 '동작 줄이기'가 켜져 있으면 흐르지 않고 한 벌만 보인다 (넘치면 오른쪽 끝이 흐려짐)
const HomeNoticeBanner = ({ to, title, dateText, badge }: HomeNoticeBannerProps) => {
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
      {badge && (
        <span
          className={`shrink-0 rounded-full border border-ink px-3 py-[2px] font-typewriter text-[12px] font-bold leading-4 ${
            badge === 'hot' ? 'bg-mustard' : 'bg-rust text-paper'
          }`}
        >
          {t(badge === 'hot' ? 'notice.hot' : 'notice.new')}
        </span>
      )}
      {/* 양 끝을 흐리게 해 글자가 잘리지 않고 스며들듯 흐름 */}
      <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-16px),transparent)]">
        <div className="flex w-max animate-[marquee_14s_linear_infinite] motion-reduce:animate-none">
          {item}
          <span aria-hidden className="flex motion-reduce:hidden">
            {item}
          </span>
        </div>
      </div>
      <FiChevronRight size={18} aria-hidden className="shrink-0 opacity-60" />
    </Link>
  );
};

export default HomeNoticeBanner;
