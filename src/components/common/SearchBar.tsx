interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "검색어를 입력해주세요" }: SearchBarProps) => {
  return (
    <label className="flex items-center gap-3 rounded-full border-2 border-ink bg-paper px-5 py-3 text-ink">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent font-body-kr text-[16px] outline-none placeholder:text-ink/50"
      />
      <span aria-hidden className="font-body-kr text-[20px] leading-7">
        ⌕
      </span>
    </label>
  );
};

export default SearchBar;
