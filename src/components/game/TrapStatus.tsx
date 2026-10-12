import { useLanguage } from '@/contexts/LanguageContext';
import { PRIMARY_BUTTON } from './gameStyles';

interface TrapStatusProps {
  sprung: boolean;
  left: number;
  sprungTitle: string;
  sprungMessage: string;
  leftLabel: string;
  onReset: () => void;
}

// 악어 게임·통아저씨 아래쪽: 남은 칸 수, 또는 벌칙 결과와 다시 하기
const TrapStatus = ({
  sprung,
  left,
  sprungTitle,
  sprungMessage,
  leftLabel,
  onReset,
}: TrapStatusProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  if (!sprung) {
    return (
      <p className="text-center font-typewriter text-[14px] leading-5 opacity-70">
        {leftLabel} <span className="font-condensed text-[24px] font-bold">{left}</span>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-center">
      <div>
        <p className="font-condensed text-[56px] font-bold leading-[56px] text-rust">
          {sprungTitle}
        </p>
        <p className="pt-2 font-display text-[24px] leading-8">{sprungMessage}</p>
      </div>
      <button type="button" onClick={onReset} className={PRIMARY_BUTTON}>
        {isEng ? 'Play Again' : '한 판 더'}
      </button>
    </div>
  );
};

export default TrapStatus;
