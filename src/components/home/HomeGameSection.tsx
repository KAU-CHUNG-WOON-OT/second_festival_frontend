import { Link } from 'react-router-dom';
import arrowIcon from '@/assets/home_arrow.svg';
import { useLanguage } from '@/contexts/LanguageContext';

interface HomeGameSectionProps {
  to: string;
}

// 홈 맨 위의 얇은 티켓: 게임 탭으로
const HomeGameSection = ({ to }: HomeGameSectionProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <Link
      to={to}
      className="relative flex w-full items-center gap-3 rounded-[16px] border-2 border-ink bg-rust px-5 py-3 text-paper drop-shadow-[5px_5px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-paper font-body-kr text-[20px] leading-7">
        🎲
      </span>
      <div className="min-w-0 flex-1 border-l border-dashed border-paper/70 pl-3">
        <p className="font-display text-[18px] leading-6">{isEng ? 'Party Games' : '술자리 게임 하러 가기'}</p>
        <p className="font-body-kr text-[12px] leading-4 opacity-80">
          {isEng ? 'Liar, bomb, roulette and more on one phone' : '라이어·폭탄 돌리기·복불복까지 폰 하나로'}
        </p>
      </div>
      <img src={arrowIcon} alt="" width={15} height={13} className="shrink-0" />

      {/* 티켓 펀치 홈 */}
      <span className="absolute -left-[11px] top-1/2 size-5 -translate-y-1/2 rounded-full border border-ink bg-cream" />
      <span className="absolute -right-[11px] top-1/2 size-5 -translate-y-1/2 rounded-full border border-ink bg-cream" />
    </Link>
  );
};

export default HomeGameSection;
