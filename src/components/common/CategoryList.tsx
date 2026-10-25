import { useTranslation } from 'react-i18next';

interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const CategoryList = ({ categories, selectedCategory, onSelect }: CategoryListProps) => {
  const { t } = useTranslation();

  const getCategoryLabel = (cat: string): string => {
    const map: Record<string, string> = {
      '전체': t('category.all'),
      '분식': t('category.snacks'),
      '디저트': t('category.dessert'),
      '식사': t('category.meal'),
      '학과': t('category.department'),
      '동아리': t('category.club'),
      '학생참여': t('category.studentParticipation'),
    };
    return map[cat] ?? cat;
  };

  return (
    // 페이지 여백(px-5)까지 스크롤 영역을 넓혀 첫 칩이 가장자리에서 잘리지 않게 함.
    // 스크롤 영역은 아래로 넘치는 그림자도 자르므로 그림자만큼 아래 여백을 두고 같은 크기의 음수 여백으로 상쇄
    <div className="-mx-5 -mb-[3px] flex gap-2 overflow-x-auto px-5 pb-[3px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          aria-pressed={selectedCategory === category}
          className={`h-9 shrink-0 whitespace-nowrap rounded-full border-2 border-ink px-4 font-body-kr text-[14px] font-semibold leading-5 shadow-[2px_2px_0px_0px_var(--color-ink)] transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
            selectedCategory === category ? 'bg-ink text-paper' : 'bg-paper text-ink'
          }`}
        >
          {getCategoryLabel(category)}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;