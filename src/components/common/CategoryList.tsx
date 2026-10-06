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
    <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-250 whitespace-nowrap ${
            selectedCategory === category
              ? 'bg-[#2B3A5C] text-white shadow-[0_2px_10px_rgba(43,58,92,0.25)]'
              : 'bg-white/55 text-[#4a5568] hover:bg-white/75'
          }`}
        >
          {getCategoryLabel(category)}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;