import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import type { TimetableEvent } from "../../data/timetableData";

interface TimetableModalProps {
  event: TimetableEvent | null;
  onClose: () => void;
}

const TYPE_CONFIG: Record<string, { label: string; label_en: string; color: string; bg: string; emoji: string }> = {
  EVENT:       { label: "이벤트", label_en: "Event",       color: "#4A7FD2", bg: "rgba(74,127,210,0.1)",  emoji: "🎯" },
  PERFORMANCE: { label: "공연",   label_en: "Performance", color: "#E06B3A", bg: "rgba(224,107,58,0.1)",  emoji: "🎵" },
  CEREMONY:    { label: "행사",   label_en: "Ceremony",    color: "#7C5CBF", bg: "rgba(124,92,191,0.1)",  emoji: "🎊" },
  CLUB:        { label: "동아리", label_en: "Club",        color: "#3f8fc9", bg: "rgba(63,143,201,0.1)",  emoji: "🎸" },
};

const TimetableModal = ({ event, onClose }: TimetableModalProps) => {
  const { language } = useLanguage();
  const isEng = language === "ENG";
  const [closing, setClosing] = useState(false);
  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  if (!event) return null;

  const type = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.EVENT;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 280);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchDeltaY.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    touchDeltaY.current = delta;
    if (delta > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
      sheetRef.current.style.transition = "none";
    }
  };

  const handleTouchEnd = () => {
    if (touchDeltaY.current > 80) handleClose();
    else if (sheetRef.current) {
      sheetRef.current.style.transform = "translateY(0)";
      sheetRef.current.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
    }
  };

  const infoItems = [
    { label: isEng ? "Time" : "공연 시간",  value: event.time },
    { label: isEng ? "Stage" : "공연 장소", value: isEng ? event.stage_en : event.stage },
    { label: isEng ? "Date" : "날짜",       value: isEng ? event.date_en : event.date },
  ];

  return createPortal(
    <>
      <style>{`
        @keyframes slideUp   { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideDown { from { transform: translateY(0); }    to { transform: translateY(100%); } }
        @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut   { from { opacity: 1; } to { opacity: 0; } }
        .modal-slide-up   { animation: slideUp   0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .modal-slide-down { animation: slideDown 0.28s cubic-bezier(0.4,0,1,1)     forwards; }
        .overlay-in  { animation: fadeIn  0.28s ease forwards; }
        .overlay-out { animation: fadeOut 0.28s ease forwards; }
      `}</style>

      <div
        className={`fixed inset-0 z-[9999] flex items-end justify-center ${closing ? "overlay-out" : "overlay-in"}`}
        style={{ background: "rgba(0,0,0,0.35)" }}
        onClick={handleClose}
      >
        <div
          ref={sheetRef}
          className={`w-[85%] max-w-[340px] rounded-t-3xl overflow-hidden ${closing ? "modal-slide-down" : "modal-slide-up"}`}
          style={{ background: "#F0F2F5", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)" }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-8 h-1 rounded-full bg-gray-300" />
          </div>

          <div className="px-5 pt-3 pb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ color: type.color, background: type.bg }}>
                {isEng ? type.label_en : type.label} · Scheduled
              </span>
            </div>

            <h2 className="text-[20px] font-extrabold text-[#1a2a5e] leading-tight mb-0.5">
              {isEng ? event.title_en : event.title}
            </h2>
            <p className="text-[13px] text-gray-400 mb-5">
              {isEng ? event.description_en : event.description}
            </p>

            <div className="border-t border-gray-200 mb-4" />

            <div className="flex flex-col gap-3 mb-6">
              {infoItems.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-[#8a94a6]">{label}</p>
                  <p className="text-[13px] font-bold text-[#1a2a5e]">{value}</p>
                </div>
              ))}
              {event.songs && event.songs.length > 0 && (
                <div className="flex items-start justify-between">
                  <p className="text-[12px] font-semibold text-[#8a94a6] shrink-0">{isEng ? "Songs" : "노래"}</p>
                  <div className="flex flex-col items-end gap-0.5">
                    {event.songs.map((song, i) => (
                      <p key={i} className="text-[13px] font-bold text-[#1a2a5e]">{song}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white active:scale-[0.98] transition-all"
              style={{ background: "#2B3A5C" }}
            >
              {isEng ? "Close" : "닫기"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default TimetableModal;