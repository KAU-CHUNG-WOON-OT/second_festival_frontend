import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import TrackCard from '../components/timetable/TrackCard';
import TimetableModal from '../components/timetable/TimetableModal';
import { performanceEvents } from '../data/performanceData';
import type { TimetableEvent } from '../data/timetableData';

const events = performanceEvents as TimetableEvent[];

// 시안이 없어 타임테이블 시안과 같은 구성으로 맞춤
const PerformancePage = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedEvent = selectedIndex === null ? null : events[selectedIndex];

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader showMenu />

      <RetroPageTitle title={t('nav.performance')} caption="SIDE B · LIVE STAGE" />

      <div className="flex flex-col gap-4 pt-6">
        {events.map((event, index) => (
          <TrackCard
            key={event.id}
            event={event}
            trackNo={index + 1}
            done={false}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      <TimetableModal
        event={selectedEvent}
        onClose={() => setSelectedIndex(null)}
        trackNo={selectedIndex === null ? undefined : selectedIndex + 1}
      />
    </div>
  );
};

export default PerformancePage;
