import { useLanguage } from '../../contexts/LanguageContext';
import logoImg from '../../assets/cheongun_logo.svg';

export interface MenuItem {
  id: number;
  name: string;
  name_en?: string;
  price: string;
  image?: string;
}

interface MenuListProps {
  menu: MenuItem[];
  // 카드 제목 (예: '판매 · 참여 항목'). 없으면 '— MENU —'
  title?: string;
}

const MenuList = ({ menu, title }: MenuListProps) => {
  const { language } = useLanguage();

  if (menu.length === 0) return null;

  return (
    <section className="rounded-[16px] border-2 border-ink bg-paper p-5 text-ink drop-shadow-[5px_5px_0px_var(--color-ink)]">
      {title ? (
        <h2 className="font-display text-[20px] leading-7">{title}</h2>
      ) : (
        <h2 className="font-typewriter text-[12px] leading-4 tracking-[3.6px]">— MENU —</h2>
      )}
      <ul className="pt-2">
        {menu.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 border-b border-dashed border-ink/40 py-4 last:border-b-0"
          >
            <img
              src={item.image || logoImg}
              alt=""
              onError={(e) => {
                e.currentTarget.src = logoImg;
              }}
              className="size-8 shrink-0 rounded-[4px] object-contain"
            />
            <span className="min-w-0 flex-1 font-display text-[18px] leading-7">
              {language === 'ENG' && item.name_en ? item.name_en : item.name}
            </span>
            <span className="shrink-0 font-typewriter text-[18px] font-bold leading-7">
              {item.price}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MenuList;
