import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RetroPageHeader from '../components/common/RetroPageHeader';
import CategoryList from '../components/common/CategoryList';
import NowPlaying from '../components/timetable/NowPlaying';
import TrackCard from '../components/timetable/TrackCard';
import TimetableModal from '../components/timetable/TimetableModal';
import { PERFORMANCE_DATE_TABS, performanceEvents } from '../data/performanceData';
import type { TimetableEvent } from '../data/timetableData';

// 시안이 없어 타임테이블 시안과 같은 구성으로 맞춤
const PerformancePage = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(PERFORMANCE_DATE_TABS[0]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const events = (performanceEvents[selectedDate] ?? []) as TimetableEvent[];
  const selectedEvent = selectedIndex === null ? null : events[selectedIndex];

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader />

      <div className="pt-8">
        <span className="inline-flex h-[38px] items-center rounded-full border border-ink bg-mustard px-4 font-display text-[18px] leading-7">
          활주로
        </span>
      </div>
      <h1 className="pt-2 font-display text-[60px] leading-[60px]">{t('nav.performance')}</h1>
      <p className="pt-2 font-typewriter text-[12px] leading-4 tracking-[3.6px]">SIDE B · LIVE STAGE</p>

      <div className="pt-6">
        <NowPlaying />
      </div>

      <div className="pt-6">
        <CategoryList
          categories={PERFORMANCE_DATE_TABS}
          selectedCategory={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setSelectedIndex(null);
          }}
        />
      </div>

      {events.length === 0 ? (
        <p className="py-16 text-center font-body-kr text-[15px] font-bold opacity-60">공연 정보가 없어요</p>
      ) : (
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
      )}

      <TimetableModal
        event={selectedEvent}
        onClose={() => setSelectedIndex(null)}
        trackNo={selectedIndex === null ? undefined : selectedIndex + 1}
      />
    </div>
  );
};

export default PerformancePage;
