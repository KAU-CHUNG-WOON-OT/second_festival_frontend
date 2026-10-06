import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface RetroDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

// 시안의 확대 보기 모달(부스 지도·포스터·QR 입금) 공통 틀
const RetroDialog = ({ title, onClose, children }: RetroDialogProps) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-[8px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-[371px] flex-col rounded-[16px] border-2 border-ink bg-paper p-3 text-ink drop-shadow-[6px_6px_0px_var(--color-mustard)]"
      >
        <div className="flex items-center justify-between pb-2">
          <p className="pl-1 font-typewriter text-[14px] font-bold leading-5">{title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-9 items-center justify-center rounded-full border border-ink font-body-kr text-[16px] leading-6"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default RetroDialog;
