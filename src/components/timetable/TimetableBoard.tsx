import { useLanguage } from '../../contexts/LanguageContext';
import { DATE_TABS_EN } from '../../data/timetableData';

interface TimetableBoardProps {
  selectedDate: string | null;
  dates: string[];
  onSelectDate: (date: string) => void;
}

const TimetableBoard = ({ selectedDate, dates, onSelectDate }: TimetableBoardProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <div className="mx-5 mb-3">
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: 'rgba(241, 245, 249, 0.55)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full"
                style={{ background: 'rgba(100, 116, 139, 0.4)' }} 
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{
                  background: '#64748b',
                  boxShadow: '0 0 6px rgba(100, 116, 139, 0.5)',
                }}
              />
            </span>
            <span
              className="rounded-md px-2 py-0.5 text-[12px] font-bold leading-none"
              style={{ background: 'rgba(100, 116, 139, 0.12)', color: '#475569' }}
            >
              {isEng ? 'SCHEDULE' : '공연 일정'}
            </span>
          </div>
          <p className="text-[11px] font-medium text-[#5f6b7c]">
            {isEng ? 'Select date' : '날짜를 선택하세요'}
          </p>
        </div>

        {/* 날짜 탭 */}
        <div className="flex gap-2 px-3 pb-3">
          {dates.map((date, idx) => {
            const isSelected = selectedDate === date;
            const displayDate = isEng ? DATE_TABS_EN[idx] : date;
            return (
              <button
                key={date}
                onClick={() => onSelectDate(date)}
                className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2.5 transition-all duration-200 active:scale-[0.97]"
                style={
                  isSelected
                    ? {
                        background:
                          'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
                        boxShadow: '0 4px 12px rgba(30, 41, 59, 0.2)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.4)',
                      }
                }
              >
                <span
                  className="text-[13px] font-bold"
                  style={{ color: isSelected ? '#ffffff' : '#475569' }}
                >
                  {displayDate}
                </span>
                <span
                  className="text-[9px] font-bold tracking-wide"
                  style={{
                    color: isSelected ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                  }}
                >
                  {isSelected ? '● ON TIME' : 'SCHED'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimetableBoard;