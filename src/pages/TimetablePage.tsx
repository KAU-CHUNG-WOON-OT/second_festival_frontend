import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RetroPageHeader from '../components/common/RetroPageHeader';
import TrackCard from '../components/timetable/TrackCard';
import TimetableModal from '../components/timetable/TimetableModal';
import { FESTIVAL_DATE_LABEL, isEventDone, timetableEvents } from '../data/timetableData';
import type { TimetableEvent } from '../data/timetableData';
import { track } from '@/lib/mixpanel';

const TimetablePage = () => {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(null);

  return (
    <div className="flex flex-col px-5 pb-[102px] pt-5 text-ink">
      <RetroPageHeader />

      <div className="pt-8">
        <span className="inline-flex h-[38px] items-center rounded-full border border-ink bg-mustard px-4 font-display text-[18px] leading-7">
          활주로
        </span>
      </div>

      <h1 className="pt-2 font-display text-[60px] leading-[60px]">{t('nav.timetable')}</h1>
      <p className="pt-2 font-typewriter text-[12px] leading-4 tracking-[3.6px]">SIDE A · TRACK LIST</p>

      <div className="mt-6 flex items-center justify-between rounded-[8px] border border-ink bg-ink px-4 py-[10px] text-paper">
        <span className="font-typewriter text-[14px] font-bold leading-5">{FESTIVAL_DATE_LABEL}</span>
        <span className="font-typewriter text-[12px] leading-4 tracking-[1.2px] opacity-70">ONE DAY ONLY</span>
      </div>

      <div className="flex flex-col gap-4 pt-6">
        {timetableEvents.map((event, index) => (
          <TrackCard
            key={event.id}
            event={event}
            trackNo={index + 1}
            done={isEventDone(index)}
            onClick={() => {
              track('timetable_performance_clicked', {
                event_id: event.id,
                event_title: event.title,
                event_type: event.type,
                event_date: event.date,
              });
              setSelectedEvent(event);
            }}
          />
        ))}
      </div>

      <TimetableModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default TimetablePage;
