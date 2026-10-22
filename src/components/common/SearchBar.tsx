import { FiSearch, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "검색어를 입력해주세요" }: SearchBarProps) => {
  const { t } = useTranslation();

  return (
    <label className="flex h-12 items-center gap-2 rounded-full bg-paper pl-5 pr-2 text-ink outline-2 outline-offset-2 outline-transparent focus-within:outline-paper">
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
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink/60 active:bg-ink/10"
        >
          <FiX size={18} />
        </button>
      ) : (
        <span className="flex size-9 shrink-0 items-center justify-center text-ink/60">
          <FiSearch size={20} aria-hidden />
        </span>
      )}
    </label>
  );
};

export default SearchBar;
