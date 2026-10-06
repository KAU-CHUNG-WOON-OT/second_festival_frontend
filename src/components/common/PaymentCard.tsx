import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

interface PaymentCardProps {
  account: string;
  qrCode?: string; // ✅ 추가
}

const PaymentCard = ({ account, qrCode }: PaymentCardProps) => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);
  const [hiding, setHiding] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account);
    } catch {
      const el = document.createElement("textarea");
      el.value = account;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setShowToast(true);
    setHiding(false);
    setTimeout(() => setHiding(true), 1500);
    setTimeout(() => { setShowToast(false); setHiding(false); }, 1800);
  };

  return (
    <>
      <style>{`
        @keyframes slideUp   { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes slideDown { from { opacity: 1; transform: translate(-50%, 0); } to { opacity: 0; transform: translate(-50%, 12px); } }
        .toast-in  { animation: slideUp   0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .toast-out { animation: slideDown 0.2s ease-in forwards; }
      `}</style>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
        <h3 className="text-[14px] font-bold text-[#2B3A5C] mb-4">{t('payment.title')}</h3>

        {/* ✅ qrCode가 있을 때만 표시 */}
        {qrCode && qrCode.trim() !== '' && (
          <div className="flex justify-center mb-5">
            <img src={qrCode} alt="QR코드" className="w-40 h-40 rounded-xl" />
          </div>
        )}

        <div className="flex items-center gap-2">
          <p className="text-[13px] text-[#4a5568] flex-1 break-all">{account}</p>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-[12px] font-semibold bg-[#2B3A5C] text-white active:scale-95 transition-all duration-200"
          >
            {t('payment.copy')}
          </button>
        </div>
      </div>

      {showToast && createPortal(
        <div
          className={`fixed bottom-24 left-1/2 z-[9999] ${hiding ? "toast-out" : "toast-in"}`}
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-800/90 backdrop-blur-sm shadow-lg">
            <span className="text-green-400 text-[16px]">✓</span>
            <p className="text-[13px] font-semibold text-white whitespace-nowrap">{t('payment.copied')}</p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PaymentCard;