import { Link } from "react-router-dom";

export interface HomeQuickMenuItem {
  title: string;
  sub: string;
  path: string;
}

interface HomeQuickMenuGridProps {
  items: HomeQuickMenuItem[];
}

const HomeQuickMenuGrid = ({ items }: HomeQuickMenuGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {items.map((item) => (
        <Link
          key={item.title}
          to={item.path}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl py-3 px-4 text-center active:scale-[0.97] transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.35)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.45)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <span className="text-[15px] font-bold text-[#1a2a5e]">{item.title}</span>
          <span className="text-[12px] font-medium text-[#1a2a5e]">{item.sub}</span>
        </Link>
      ))}
    </div>
  );
};

export default HomeQuickMenuGrid;