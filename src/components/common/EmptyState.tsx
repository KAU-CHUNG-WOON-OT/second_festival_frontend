import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  message: string;
  // 예: 검색 초기화, 돌아가기
  action?: { label: string; onClick: () => void };
}

// 결과 없음·찾을 수 없음 안내. 노을 배경 어디에 놓여도 읽히도록 paper 카드에 담는다
const EmptyState = ({ icon, message, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center rounded-[16px] bg-paper/90 px-5 py-10 text-center text-ink">
    {icon && <span className="pb-3 text-ink/40">{icon}</span>}
    <p className="font-body-kr text-[15px] font-semibold leading-6 text-ink/70">{message}</p>
    {action && (
      <button
        type="button"
        onClick={action.onClick}
        className="mt-4 h-10 rounded-full bg-ink px-5 font-body-kr text-[14px] font-semibold text-paper active:opacity-80"
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
