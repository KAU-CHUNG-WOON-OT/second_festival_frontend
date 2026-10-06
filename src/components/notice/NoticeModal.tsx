import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import type { NoticeData } from "../../data/noticeData";
import calendarIcon from "../../assets/notice_calendar.svg";
import closeIcon from "../../assets/close_light.svg";
import { track } from "@/lib/mixpanel";

interface NoticeModalProps {
  notice: NoticeData | null;
  onClose: () => void;
}

const NoticeModal = ({ notice, onClose }: NoticeModalProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [closing, setClosing] = useState(false);
  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notice) {
      track('notice_modal_opened', {
        notice_id: notice.id,
        notice_title: notice.title,
      });
    }
  }, [notice]);

  if (!notice) return null;

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
    if (touchDeltaY.current > 80) {
      handleClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = "translateY(0)";
      sheetRef.current.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
    }
  };

  const isEng = language === "ENG";
  const title = isEng ? notice.title_en : notice.title;
  const content = isEng ? notice.content_en : notice.content;

  return createPortal(
    <>
      <style>{`
        @keyframes slideUp   { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideDown { from { transform: translateY(0); }    to { transform: translateY(100%); } }
        @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut   { from { opacity: 1; } to { opacity: 0; } }
        .notice-slide-up   { animation: slideUp   0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .notice-slide-down { animation: slideDown 0.28s cubic-bezier(0.4,0,1,1)     forwards; }
        .notice-overlay-in  { animation: fadeIn  0.28s ease forwards; }
        .notice-overlay-out { animation: fadeOut 0.28s ease forwards; }
      `}</style>

      <div
        className={`fixed inset-0 z-[9999] flex items-end justify-center bg-ink/40 ${closing ? "notice-overlay-out" : "notice-overlay-in"}`}
        onClick={handleClose}
      >
        <div
          ref={sheetRef}
          className={`relative w-full max-w-[430px] rounded-t-[32px] border-2 border-ink bg-paper px-6 pb-5 pt-6 text-ink drop-shadow-[0px_-6px_0px_var(--color-mustard)] ${closing ? "notice-slide-down" : "notice-slide-up"}`}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label={isEng ? "Close" : "닫기"}
            className="absolute right-6 top-5 flex size-11 items-center justify-center rounded-full border border-ink bg-ink"
          >
            <img src={closeIcon} alt="" width={12} height={12} />
          </button>

          <p className="font-body-kr text-[60px] leading-[60px]">⚠️</p>
          <div className="flex gap-2 pt-4">
            {notice.isNew && (
              <span className="rounded-full border border-ink bg-rust px-3 py-[2px] font-typewriter text-[12px] font-bold leading-4 text-paper">
                {t('notice.new')}
              </span>
            )}
            {notice.isImportant && (
              <span className="rounded-full border border-ink bg-mustard px-3 py-[2px] font-body-kr text-[12px] font-bold leading-4">
                {t('notice.important')}
              </span>
            )}
          </div>

          <h2 className="pt-3 font-display text-[20px] leading-[27.5px]">{title}</h2>
          <p className="max-h-[40vh] overflow-y-auto whitespace-pre-line pt-3 font-body-kr text-[15px] leading-7 opacity-80">
            {content}
          </p>

          <div className="mt-5 flex items-center gap-4 rounded-[16px] border border-dashed border-ink/50 bg-cream p-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-ink bg-paper">
              <img src={calendarIcon} alt="" width={17} height={18} />
            </span>
            <div>
              <p className="font-body-kr text-[12px] leading-4 opacity-60">{isEng ? "Posted" : "게시일"}</p>
              <p className="font-typewriter text-[18px] font-bold leading-7">{notice.date}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="mt-5 h-14 w-full rounded-full border-2 border-ink bg-rust font-display text-[18px] leading-7 text-paper drop-shadow-[4px_4px_0px_var(--color-ink)]"
          >
            {isEng ? "Close" : "닫기"}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default NoticeModal;