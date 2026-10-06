import type { ReactNode } from 'react';
import checkIcon from '@/assets/ticket_check.svg';

interface TicketStatusCardProps {
  // pending: 발급 처리 중·불러오는 중
  variant: 'success' | 'error' | 'pending';
  title: string;
  description?: string;
  children?: ReactNode;
  actionLabel?: string;
  actionDisabled?: boolean;
  onAction?: () => void;
}

// 팔찌 안내 시안의 '웨이팅 등록 완료' / '웨이팅 등록 실패' 카드 틀
const TicketStatusCard = ({
  variant,
  title,
  description,
  children,
  actionLabel,
  actionDisabled = false,
  onAction,
}: TicketStatusCardProps) => {
  const isSuccess = variant === 'success';
  const isError = variant === 'error';

  return (
    <section className="w-full overflow-clip rounded-[24px] border-2 border-ink bg-paper p-6 text-center text-ink shadow-[6px_6px_0px_0px_var(--color-ink)]">
      <div
        className={`mx-auto flex size-16 items-center justify-center rounded-full border-2 border-ink ${
          isError ? 'bg-rust' : 'bg-mustard'
        }`}
      >
        {isSuccess && <img src={checkIcon} alt="" width={36} height={36} />}
        {isError && <span className="font-body-kr text-[30px] font-black leading-9 text-paper">!</span>}
        {variant === 'pending' && <span className="font-typewriter text-[28px] leading-9">◷</span>}
      </div>
      <h2
        className={`whitespace-pre-line pt-4 font-display ${
          isSuccess ? 'text-[30px] leading-9' : 'text-[24px] leading-8'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className="whitespace-pre-line pt-1 font-body-kr text-[16px] leading-6 opacity-70">{description}</p>
      )}
      {children && <div className="flex flex-col gap-4 pt-5">{children}</div>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          disabled={actionDisabled}
          className="mt-5 h-16 w-full rounded-[16px] border-2 border-ink bg-ink font-display text-[20px] leading-7 text-paper drop-shadow-[4px_4px_0px_var(--color-ink)] disabled:opacity-60"
        >
          {actionLabel}
        </button>
      )}
    </section>
  );
};

export default TicketStatusCard;
