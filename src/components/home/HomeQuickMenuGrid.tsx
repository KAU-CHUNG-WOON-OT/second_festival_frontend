import { Link } from "react-router-dom";
import { FiPlay } from "react-icons/fi";

export interface HomeQuickMenuItem {
  title: string;
  sub: string;
  path: string;
  // 카드 배경·글자색 (Tailwind 클래스)
  colorClass: string;
}

interface HomeQuickMenuGridProps {
  items: HomeQuickMenuItem[];
}

const LETTERS = ["A", "B", "C", "D"];

// '교내 학과 · 동아리 부스'처럼 ' · '로 나뉜 부제: 조각은 끊지 않고, 좁아서 줄이 바뀌면 줄 앞에 오는 ·는 감춘다.
// 조각마다 왼쪽 여백(·자리)만큼 음수 여백으로 당겨 두어, 줄 맨 앞 조각의 ·는 상자 밖으로 나가 잘린다
const SubTitle = ({ text }: { text: string }) => (
  <span className="flex flex-wrap overflow-hidden">
    {text.split(" · ").map((part, index) => (
      <span key={part} className="relative -ml-[14px] whitespace-nowrap pl-[14px] pr-[14px] last:pr-0">
        {index > 0 && (
          <span aria-hidden className="absolute left-0 w-[14px] text-center">
            ·
          </span>
        )}
        {part}
      </span>
    ))}
  </span>
);

const HomeQuickMenuGrid = ({ items }: HomeQuickMenuGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, index) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex min-h-36 flex-col justify-between rounded-[8px] border border-ink p-4 drop-shadow-[4px_4px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] ${item.colorClass}`}
        >
          <div className="flex items-center justify-between font-typewriter text-[12px] leading-4">
            <span className="rounded-[4px] border border-current px-[6px]">{LETTERS[index]}</span>
            <FiPlay size={12} fill="currentColor" aria-hidden className="opacity-70" />
          </div>
          <div>
            <p className="font-display text-[24px] leading-[30px]">{item.title}</p>
            <p className="pt-1 font-body-kr text-[14px] leading-5 opacity-80">
              <SubTitle text={item.sub} />
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HomeQuickMenuGrid;
