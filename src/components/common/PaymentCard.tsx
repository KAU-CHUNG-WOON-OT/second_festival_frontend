import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import RetroDialog from "./RetroDialog";

interface PaymentCardProps {
  account: string;
  qrCode?: string; // ✅ 추가
}

const PaymentCard = ({ account, qrCode }: PaymentCardProps) => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [isQrZoomOpen, setIsQrZoomOpen] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const hasQr = !!qrCode && qrCode.trim() !== '' && !qrFailed;

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

      <section className="rounded-[16px] border-2 border-ink bg-paper p-5 text-ink drop-shadow-[5px_5px_0px_var(--color-ink)]">
        <h2 className="font-typewriter text-[12px] font-bold leading-4 tracking-[1.2px]">{t('payment.title')}</h2>

        {hasQr && (
          <button
            type="button"
            onClick={() => setIsQrZoomOpen(true)}
            aria-label="QR 크게 보기"
            className="mx-auto mt-2 block"
          >
            <img src={qrCode} alt="QR코드" className="size-48" onError={() => setQrFailed(true)} />
          </button>
        )}

        <button
          type="button"
          onClick={handleCopy}
          aria-label="계좌번호 복사"
          className="block w-full break-all pt-2 text-center font-body-kr text-[16px] font-bold leading-6"
        >
          {account}
        </button>
      </section>

      {isQrZoomOpen && (
        <RetroDialog title={t('payment.title')} onClose={() => setIsQrZoomOpen(false)}>
          <img src={qrCode} alt="QR코드" className="w-full rounded-[8px] bg-white" />
        </RetroDialog>
      )}

      {showToast && createPortal(
        <div
          className={`fixed bottom-24 left-1/2 z-[9999] ${hiding ? "toast-out" : "toast-in"}`}
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-ink bg-ink">
            <span className="text-[16px] text-mustard">✓</span>
            <p className="whitespace-nowrap font-body-kr text-[13px] font-semibold text-paper">{t('payment.copied')}</p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PaymentCard;