import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { TYPE_ICON, formatTrackNo, type TimetableEvent } from "../../data/timetableData";

interface TimetableModalProps {
  event: TimetableEvent | null;
  onClose: () => void;
  // 타임테이블에서 열 때만 전달 (공연 정보 화면은 없음)
  trackNo?: number;
  done?: boolean;
}

const STRIPE =
  "bg-[linear-gradient(90deg,var(--color-rust)_0%,var(--color-rust)_33.3%,var(--color-mustard)_33.3%,var(--color-mustard)_66.6%,var(--color-sky-light)_66.6%,var(--color-sky-light)_100%)]";

const TimetableModal = ({ event, onClose, trackNo, done = false }: TimetableModalProps) => {
  const { language } = useLanguage();
  const isEng = language === "ENG";
  const [closing, setClosing] = useState(false);
  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  if (!event) return null;

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
    { icon: "◔", label: isEng ? "Time" : "공연 시간", value: event.time },
    { icon: "⚑", label: isEng ? "Stage" : "공연 장소", value: isEng ? event.stage_en : event.stage },
    { icon: "▦", label: isEng ? "Date" : "날짜", value: isEng ? event.date_en : event.date },
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
        className={`fixed inset-0 z-[9999] flex items-end justify-center bg-ink/70 backdrop-blur-[8px] ${closing ? "overlay-out" : "overlay-in"}`}
        onClick={handleClose}
      >
        <div
          ref={sheetRef}
          className={`max-h-[94dvh] w-full max-w-[430px] overflow-y-auto overflow-x-clip rounded-t-[32px] border-2 border-ink bg-cream text-ink ${closing ? "modal-slide-down" : "modal-slide-up"}`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* LP 재킷 + 레코드 */}
          <div className="relative overflow-clip bg-maroon p-6">
            <button
              type="button"
              onClick={handleClose}
              aria-label={isEng ? "Close" : "닫기"}
              className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full border border-ink bg-cream font-body-kr text-[16px]"
            >
              ✕
            </button>
            <div className="relative mx-auto h-[273px] w-[288px]">
              <div className="absolute left-[87px] top-0 size-[273px] rounded-full border border-cream/30 bg-ink drop-shadow-[0px_10px_15px_rgba(0,0,0,0.5)]">
                <div className="absolute left-[84px] top-[84px] flex size-[103px] flex-col items-center justify-center rounded-full border border-ink bg-mustard">
                  {trackNo && (
                    <span className="font-typewriter text-[9px] font-bold leading-[13.5px] tracking-[0.9px]">
                      {formatTrackNo(trackNo)}
                    </span>
                  )}
                  <span className="font-condensed text-[24px] font-black leading-6">{event.time.split("~")[0]}</span>
                  <span className="font-body-kr text-[16px] leading-4 text-rust">{TYPE_ICON[event.type] ?? "✈"}</span>
                </div>
              </div>
              <div className="absolute left-0 top-0 h-[273px] w-[104px] rounded-l-[6px] border-2 border-ink bg-rust drop-shadow-[4px_0px_6px_rgba(0,0,0,0.35)]">
                <div className={`absolute left-0 top-8 h-3 w-full ${STRIPE}`} />
                <p className="absolute bottom-4 left-2 font-typewriter text-[10px] font-bold leading-[12.5px] text-paper">
                  KAU
                  <br />
                  활주로
                  <br />
                  10.28
                </p>
              </div>
            </div>
            <p className="pt-4 text-center font-typewriter text-[10px] leading-[15px] tracking-[3px] text-cream/70">
              33⅓ RPM · SIDE A
            </p>
          </div>

          <div className={`h-2 w-full ${STRIPE}`} />

          <div className="p-6">
            <span
              className={`inline-block rounded-full border border-ink px-3 py-1 font-typewriter text-[12px] font-bold leading-4 ${
                done ? "bg-ink/15 text-ink/60" : "bg-tape-blue text-paper"
              }`}
            >
              {done ? "Finished" : "Scheduled"}
            </span>
            <h2 className="pt-3 font-display text-[30px] leading-9 text-rust">
              {isEng ? event.title_en : event.title}
            </h2>
            <p className="font-body-kr text-[18px] leading-7 opacity-75">
              {isEng ? event.description_en : event.description}
            </p>

            <div className="flex flex-col gap-4 pt-5">
              {infoItems.map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[12px] border border-ink bg-mustard font-body-kr text-[20px] leading-7">
                    {icon}
                  </span>
                  <div>
                    <p className="font-typewriter text-[12px] leading-4 text-ink/60">{label}</p>
                    <p className="font-display text-[20px] leading-7">{value}</p>
                  </div>
                </div>
              ))}
              {event.songs && event.songs.length > 0 && (
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[12px] border border-ink bg-mustard font-body-kr text-[20px] leading-7">
                    ♪
                  </span>
                  <div>
                    <p className="font-typewriter text-[12px] leading-4 text-ink/60">{isEng ? "Songs" : "노래"}</p>
                    {event.songs.map((song, i) => (
                      <p key={i} className="font-display text-[18px] leading-7">{song}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 h-14 w-full rounded-[16px] border-2 border-ink bg-ink font-body-kr text-[16px] font-bold leading-6 text-paper"
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
