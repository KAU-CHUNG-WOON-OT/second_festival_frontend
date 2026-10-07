import { useLanguage } from '@/contexts/LanguageContext';
import { GAME_CARD } from './gameStyles';

interface PlayerCountStepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

const STEPPER_BUTTON =
  'flex size-11 items-center justify-center rounded-full border border-ink bg-cream font-typewriter text-[20px] leading-7 drop-shadow-[3px_3px_0px_var(--color-ink)] disabled:opacity-40';

const PlayerCountStepper = ({ value, min, max, onChange }: PlayerCountStepperProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <section className={GAME_CARD}>
      <p className="font-typewriter text-[12px] leading-4 opacity-60">PLAYERS</p>
      <div className="flex items-center justify-between pt-3">
        <button
          type="button"
          aria-label={isEng ? 'Fewer players' : '인원 줄이기'}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className={STEPPER_BUTTON}
        >
          −
        </button>
        <p className="font-condensed text-[56px] font-bold leading-[60px]">
          {value}
          <span className="pl-1 font-display text-[20px] leading-7">{isEng ? 'players' : '명'}</span>
        </p>
        <button
          type="button"
          aria-label={isEng ? 'More players' : '인원 늘리기'}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className={STEPPER_BUTTON}
        >
          +
        </button>
      </div>
    </section>
  );
};

export default PlayerCountStepper;
