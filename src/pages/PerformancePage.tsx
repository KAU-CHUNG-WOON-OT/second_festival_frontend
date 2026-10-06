import { useState } from 'react';
import DayHeader from '../components/common/DayHeader';
import NowPlaying from '../components/timetable/NowPlaying';
import TimetableBoard from '../components/timetable/TimetableBoard';
import TimetableItem from '../components/timetable/TimetableItem';
import TimetableModal from '../components/timetable/TimetableModal';
import Footer from '../layout/Footer';
import { PERFORMANCE_DATE_TABS, performanceEvents } from '../data/performanceData';
import type { TimetableEvent } from '../data/timetableData';

// ✅ 공연은 5/19, 5/20만 있으므로 DayHeader index에 맞게 수정
const DAY_TO_DATE: Record<number, string> = {
  1: '5월 19일',
  2: '5월 20일',
};

const DATE_TO_DAY: Record<string, number> = {
  '5월 19일': 1,
  '5월 20일': 2,
};

const PerformancePage = () => {
  const [selectedDay, setSelectedDay] = useState(-1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(null);

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setSelectedDate(DAY_TO_DATE[day] ?? null);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedDay(DATE_TO_DAY[date] ?? -1);
  };

  const events = selectedDate
    ? ((performanceEvents[selectedDate] ?? []) as TimetableEvent[])
    : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6">
        <DayHeader selectedDay={selectedDay} onSelectDay={handleSelectDay} showDayTabs={false} />
      </div>

      <div className="flex-1 overflow-y-auto pt-3">
        <TimetableBoard
          selectedDate={selectedDate}
          dates={PERFORMANCE_DATE_TABS}
          onSelectDate={handleSelectDate}
        />

        <NowPlaying />

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-[16px] font-bold text-white/80">
              {selectedDate ? '공연 정보가 없어요' : '날짜를 선택해주세요'}
            </p>
            <p className="text-[13px] text-white/40 whitespace-pre-line text-center">
              {selectedDate
                ? '다른 날짜를 선택해보세요'
                : '상단에서 날짜를 선택하면\n공연 목록이 표시돼요'}
            </p>
          </div>
        ) : (
          <div className="pb-4">
            {events.map((event) => (
              <TimetableItem key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
            ))}
          </div>
        )}

        <Footer />
      </div>

      <TimetableModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default PerformancePage;