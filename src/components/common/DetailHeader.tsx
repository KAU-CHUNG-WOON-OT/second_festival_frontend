import { useNavigate } from "react-router-dom";

interface DetailHeaderProps {
  title: string;
}

const DetailHeader = ({ title }: DetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex-shrink-0">
      {/* 헤더 본체 */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-3"
        style={{ background: "var(--bg-header)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-white p-1 active:scale-90 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-[16px] font-bold text-white">{title}</h2>
        <div className="w-6" />
      </div>

      {/* 하단 블러 페이드 */}
      <div
        className="h-6 pointer-events-none"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          background: "linear-gradient(to bottom, var(--bg-header), transparent)",
        }}
      />
    </div>
  );
};

export default DetailHeader;