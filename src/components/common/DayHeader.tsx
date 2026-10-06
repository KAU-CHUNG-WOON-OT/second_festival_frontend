import { useId, useMemo, type CSSProperties, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface DayHeaderProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  showDayTabs?: boolean;
  title?: ReactNode;
  hiddenDays?: number[];
}

const FESTIVAL_START = new Date(2026, 4, 18);
const WEEKDAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const DAY_INFO: Record<number, { date: string; weekday: string; tabLabel: string }> = {
  0: { date: '05.18', weekday: 'MON', tabLabel: '5/18' },
  1: { date: '05.19', weekday: 'TUE', tabLabel: '5/19' },
  2: { date: '05.20', weekday: 'WED', tabLabel: '5/20' },
};

export const getFestivalDayIndex = (): number => {
  const today = new Date();
  if (today.getMonth() === 4) {
    if (today.getDate() === 18) return 0;
    if (today.getDate() === 19) return 1;
    if (today.getDate() === 20) return 2;
  }
  return -1;
};

const DayHeader = ({ selectedDay, onSelectDay, showDayTabs = true, title, hiddenDays = [] }: DayHeaderProps) => {
  const { t } = useTranslation();
  const rawId = useId();
  const liquidGlassFilterId = `day-header-glass-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const liquidBackdropValue = `url(#${liquidGlassFilterId}) blur(14px) saturate(185%)`;
  const liquidBackdropStyle: CSSProperties = {
    backdropFilter: liquidBackdropValue,
    WebkitBackdropFilter: liquidBackdropValue,
  };

  const { displayDate, displayWeekday, dday } = useMemo(() => {
    const now = new Date();
    const todayFormatted = `${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    const todayWeekday = WEEKDAY_SHORT[now.getDay()];

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const diffMs = FESTIVAL_START.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const ddayLabel =
      diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? 'D-Day' : `D+${Math.abs(diffDays)}`;

    const info = DAY_INFO[selectedDay];
    return {
      displayDate: info ? info.date : todayFormatted,
      displayWeekday: info ? info.weekday : todayWeekday,
      dday: ddayLabel,
    };
  }, [selectedDay]);

  return (
    <div className={`flex-shrink-0 flex flex-col pt-4 ${showDayTabs ? 'pb-6' : 'pb-3'}`}>
      <svg aria-hidden="true" className="pointer-events-none absolute size-0">
        <defs>
          <filter
            id={liquidGlassFilterId}
            x="-35%"
            y="-35%"
            width="170%"
            height="170%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.03"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="0.7" result="noiseSoft" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noiseSoft"
              scale="44"
              xChannelSelector="R"
              yChannelSelector="G"
              result="refracted"
            />
            <feGaussianBlur in="refracted" stdDeviation="0.2" result="refractedSoft" />
            <feBlend in="refracted" in2="refractedSoft" mode="screen" />
          </filter>
        </defs>
      </svg>

      <span
        className="relative mb-3 inline-flex self-start overflow-hidden rounded-full border border-white/18 bg-transparent px-4 py-1.5 text-[12px] font-medium tracking-wide text-white/90 backdrop-blur-[14px] backdrop-saturate-185 shadow-[inset_0_1px_0_rgba(255,255,255,0.23),inset_0_-1px_0_rgba(255,255,255,0.02)]"
        style={liquidBackdropStyle}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(162deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_44%,rgba(255,255,255,0)_100%)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-[8px] left-[12%] h-[56%] w-[76%] rounded-full bg-white/16 blur-[8px] opacity-40"
        />
        <span className="relative z-10 whitespace-nowrap">
          {t('day.festival')} {dday}
        </span>
      </span>

      <h1 className={`text-[42px] font-extrabold text-white tracking-tight leading-none ${showDayTabs ? 'mb-6' : 'mb-0'}`}>
        {title ?? (
          <>
            {displayDate}
            <span className="ml-2 font-bold">{displayWeekday}</span>
          </>
        )}
      </h1>

      {showDayTabs && (
        <div className="flex gap-2">
          {Object.entries(DAY_INFO)
            .filter(([idxStr]) => !hiddenDays.includes(Number(idxStr)))
            .map(([idxStr, day]) => {
              const idx = Number(idxStr);
              return (
                <button
                  key={idx}
                  onClick={() => onSelectDay(idx)}
                  className={`px-4 py-1 rounded-full text-[13px] font-semibold transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none ${
                    selectedDay === idx
                      ? 'bg-white text-[#3B6FB5] shadow-[0_2px_16px_rgba(255,255,255,0.4)]'
                      : 'bg-white/15 text-white/85 hover:bg-white/25'
                  }`}
                >
                  {day.tabLabel}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default DayHeader;