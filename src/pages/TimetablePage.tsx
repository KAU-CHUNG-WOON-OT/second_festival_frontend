import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import NowPlaying from '../components/timetable/NowPlaying';
import TrackCard from '../components/timetable/TrackCard';
import TimetableModal from '../components/timetable/TimetableModal';
import { FESTIVAL_DATE_LABEL, isEventDone, timetableEvents } from '../data/timetableData';
import { track } from '@/lib/mixpanel';

const TimetablePage = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedEvent = selectedIndex === null ? null : timetableEvents[selectedIndex];

  return (
    <div className="flex flex-col px-5 pb-[102px] pt-5 text-ink">
      <RetroPageHeader />

      <RetroPageTitle title={t('nav.timetable')} caption="SIDE A · TRACK LIST" />

      <div className="mt-6 flex items-center justify-between rounded-[8px] border border-ink bg-ink px-4 py-[10px] text-paper">
        <span className="font-typewriter text-[14px] font-bold leading-5">{FESTIVAL_DATE_LABEL}</span>
        <span className="font-typewriter text-[12px] leading-4 tracking-[1.2px] opacity-70">ONE DAY ONLY</span>
      </div>

      <div className="pt-6">
        <NowPlaying />
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
              setSelectedIndex(index);
            }}
          />
        ))}
      </div>

      <TimetableModal
        event={selectedEvent}
        onClose={() => setSelectedIndex(null)}
        trackNo={selectedIndex === null ? undefined : selectedIndex + 1}
        done={selectedIndex !== null && isEventDone(selectedIndex)}
      />
    </div>
  );
};

export default TimetablePage;
