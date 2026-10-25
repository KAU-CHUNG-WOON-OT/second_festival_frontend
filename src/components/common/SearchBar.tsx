import { FiSearch, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "검색어를 입력해 주세요" }: SearchBarProps) => {
  const { t } = useTranslation();

  return (
    // 카드처럼 진한 테두리 + 흐림 없는 그림자. 포커스는 바깥 흰 테두리 + 안쪽 cream 배경
    <label className="flex h-12 items-center gap-2 rounded-full border-2 border-ink bg-paper pl-5 pr-1 text-ink outline-2 outline-offset-2 outline-transparent shadow-[3px_3px_0px_0px_var(--color-ink)] transition-colors focus-within:bg-cream focus-within:outline-paper">
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // 검색 버튼을 누르면 키보드를 내려 결과가 보이게
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent font-body-kr text-[16px] outline-none placeholder:text-ink/50"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t('search.clear')}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper active:opacity-80"
        >
          <FiX size={16} />
        </button>
      ) : (
        <span className="flex size-9 shrink-0 items-center justify-center text-ink">
          <FiSearch size={20} aria-hidden />
        </span>
      )}
    </label>
  );
};

export default SearchBar;
