import { Link } from "react-router-dom";

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
            <span className="opacity-70">▶</span>
          </div>
          <div>
            <p className="font-display text-[24px] leading-[30px]">{item.title}</p>
            <p className="pt-1 font-body-kr text-[14px] leading-5 opacity-80">{item.sub}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HomeQuickMenuGrid;
