interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "검색어를 입력해주세요" }: SearchBarProps) => {
  return (
    <div className="relative mx-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-3 px-5 pr-12 rounded-2xl bg-white/60 backdrop-blur-sm text-[14px] text-gray-700 placeholder-gray-400/80 outline-none border border-white/50 focus:border-[#7EAED9]/40 focus:bg-white/75 transition-all duration-200"
      />
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400/70"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
};

export default SearchBar;