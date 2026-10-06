import kakaoIcon from '../../assets/kakao_icon.svg';

interface LoginRequiredPopupProps {
  onCancel: () => void;
  onLogin: () => void;
}

const LoginRequiredPopup = ({ onCancel, onLogin }: LoginRequiredPopupProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 pb-8" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[280px] rounded-[20px] border-2 border-ink bg-paper px-5 pb-4 pt-5 text-ink drop-shadow-[4px_4px_0px_var(--color-ink)]"
      >
        <p className="mb-3 text-center font-display text-[16px] leading-6">로그인이 필요한 서비스예요</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-[38px] flex-1 rounded-[12px] border border-ink bg-cream font-body-kr text-[13px] font-bold"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-[12px] border border-ink bg-[#fee500] font-body-kr text-[13px] font-bold"
          >
            <img src={kakaoIcon} alt="" width={16} height={15} />
            카카오 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredPopup;
