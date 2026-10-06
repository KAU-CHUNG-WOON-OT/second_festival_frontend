import { useState } from 'react';
import DayHeader from '../components/common/DayHeader';
import TimetableBoard from '../components/timetable/TimetableBoard';
import TimetableItem from '../components/timetable/TimetableItem';
import TimetableModal from '../components/timetable/TimetableModal';
import Footer from '../layout/Footer';
import { DATE_TABS, timetableEvents } from '../data/timetableData';
import type { TimetableEvent } from '../data/timetableData';
import { track } from '@/lib/mixpanel';

const DAY_TO_DATE: Record<number, string> = {
  0: '5월 15일',
  1: '5월 16일',
  2: '5월 17일',
};

const TimetablePage = () => {
  const [selectedDay, setSelectedDay] = useState(-1);
  const [selectedDate, setSelectedDate] = useState(DATE_TABS[0]);
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(null);

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setSelectedDate(DAY_TO_DATE[day]);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    const dayIndex = DATE_TABS.indexOf(date);
    if (dayIndex !== -1) setSelectedDay(dayIndex);
  };

  const events = timetableEvents[selectedDate] ?? [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6">
        <DayHeader selectedDay={selectedDay} onSelectDay={handleSelectDay} showDayTabs={false} />
      </div>

      <div className="flex-1 overflow-y-auto pt-3">
        <TimetableBoard
          selectedDate={selectedDate}
          dates={DATE_TABS}
          onSelectDate={handleSelectDate}
        />

        <div className="pb-4">
          {events.map((event) => (
            <TimetableItem
              key={event.id}
              event={event}
              onClick={() => {
                track('timetable_performance_clicked', {
                  event_id: event.id,
                  event_title: event.title,
                  event_type: event.type,
                  event_date: selectedDate,
                });
                setSelectedEvent(event);
              }}
            />
          ))}
        </div>

        <Footer />
      </div>

      <TimetableModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default TimetablePage;