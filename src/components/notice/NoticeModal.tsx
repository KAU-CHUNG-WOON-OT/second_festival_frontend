import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import type { NoticeData } from "../../data/noticeData";
import calenderIcon from "../../assets/calender.svg";
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
        className={`fixed inset-0 z-[9999] flex items-end justify-center ${closing ? "notice-overlay-out" : "notice-overlay-in"}`}
        style={{ background: "rgba(0,0,0,0.35)" }}
        onClick={handleClose}
      >
        <div
          ref={sheetRef}
          className={`w-[90%] max-w-[400px] rounded-t-3xl overflow-hidden ${closing ? "notice-slide-down" : "notice-slide-up"}`}
          style={{ background: "#F0F2F5", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)" }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-8 h-1 rounded-full bg-gray-300" />
          </div>

          <div className="px-6 pt-3 pb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center text-xl">⚠️</div>
                <div className="flex gap-1.5">
                  {notice.isNew && (
                    <span className="rounded-lg bg-gradient-to-r from-[#ff2056] to-[#f6339a] px-2.5 py-1 text-[10px] font-bold text-white">
                      {t('notice.new')}
                    </span>
                  )}
                  {notice.isImportant && (
                    <span className="rounded-lg bg-[#FF6B35]/15 px-2.5 py-1 text-[10px] font-bold text-[#FF6B35]">
                      {t('notice.important')}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center active:scale-90 transition-all">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h2 className="text-[18px] font-extrabold text-[#1a2a5e] leading-snug mb-3">{title}</h2>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-5 whitespace-pre-line">{content}</p>
            <div className="border-t border-gray-200 mb-4" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                <img src={calenderIcon} alt="날짜" className="w-5 h-5 object-contain brightness-0 opacity-50" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-semibold">{isEng ? "Posted" : "게시일"}</p>
                <p className="text-[14px] font-bold text-[#1a2a5e]">{notice.date}</p>
              </div>
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

export default NoticeModal;