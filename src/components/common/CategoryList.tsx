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
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`shrink-0 whitespace-nowrap rounded-full border border-ink px-5 py-2 font-display text-[16px] leading-6 ${
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