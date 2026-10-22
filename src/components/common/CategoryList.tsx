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
    // 페이지 여백(px-5)까지 스크롤 영역을 넓혀 첫 칩이 가장자리에서 잘리지 않게 함
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          aria-pressed={selectedCategory === category}
          className={`h-9 shrink-0 whitespace-nowrap rounded-full px-4 font-body-kr text-[14px] font-semibold leading-5 transition-colors active:opacity-80 ${
            selectedCategory === category ? 'bg-ink text-paper' : 'bg-paper text-ink/70'
          }`}
        >
          {getCategoryLabel(category)}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;