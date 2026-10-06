import { useLanguage } from "../../contexts/LanguageContext";
import type { TimetableEvent } from "../../data/timetableData";

interface TimetableItemProps {
  event: TimetableEvent;
  onClick: () => void;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  EVENT:       { label: "EVENT",       color: "#4A7FD2", bg: "rgba(74,127,210,0.12)" },
  PERFORMANCE: { label: "PERFORMANCE", color: "#E06B3A", bg: "rgba(224,107,58,0.12)" },
  CEREMONY:    { label: "CEREMONY",    color: "#7C5CBF", bg: "rgba(124,92,191,0.12)" },
  BREAKTIME:   { label: "BREAK",       color: "#8a94a6", bg: "rgba(138,148,166,0.15)" },
};

const TimetableItem = ({ event, onClick }: TimetableItemProps) => {
  const { language } = useLanguage();
  const isEng = language === "ENG";
  const type = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.EVENT;

  return (
    <div
      onClick={onClick}
      className="mx-5 mb-3 flex items-stretch gap-3 rounded-2xl px-4 py-3.5 cursor-pointer active:scale-[0.98] transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.45)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* 좌측 포인트 바 */}
      <div
        className="w-1 self-stretch rounded-full flex-shrink-0"
        style={{
          background: `linear-gradient(180deg, ${type.color}, ${type.color}aa)`,
        }}
      />

      <div className="min-w-0 flex-1">
        {/* 상단: 시간 + SCHEDULED 뱃지 */}
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-end gap-2">
            <span className="text-[24px] font-extrabold leading-none text-[#1d293d]">
              {event.time}
            </span>
            <span className="mb-0.5 text-[11px] font-semibold text-[#8a94a6]">
              KE 115
            </span>
          </div>
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-bold leading-none"
            style={{ color: "#4A7FD2", background: "rgba(74,127,210,0.15)" }}
          >
            SCHEDULED
          </span>
        </div>

        {/* 본문 */}
        <h3 className="truncate text-[15px] font-bold text-[#1d293d]">
          {isEng ? event.title_en : event.title}
        </h3>
        <p className="mb-2.5 truncate text-[12px] text-[#8a94a6]">
          {isEng ? event.description_en : event.description}
        </p>

        {/* 하단: 타입 + 무대 */}
        <div className="flex items-center justify-between">
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-bold leading-none"
            style={{ color: type.color, background: type.bg }}
          >
            {type.label}
          </span>
          <span className="text-[11px] font-semibold text-[#8a94a6]">
            {isEng ? event.stage_en : event.stage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimetableItem;
