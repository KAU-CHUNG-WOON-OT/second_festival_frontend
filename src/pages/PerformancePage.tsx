import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import CategoryList from '../components/common/CategoryList';
import StickyBar from '../components/common/StickyBar';
import EmptyState from '../components/common/EmptyState';
import NowPlaying from '../components/timetable/NowPlaying';
import TrackCard from '../components/timetable/TrackCard';
import TimetableModal from '../components/timetable/TimetableModal';
import { PERFORMANCE_DATE_TABS, performanceEvents } from '../data/performanceData';
import type { TimetableEvent } from '../data/timetableData';
import { useLanguage } from '../contexts/LanguageContext';
import { useUrlFilters } from '../hooks/useUrlFilters';

const FILTER_DEFAULTS = { date: PERFORMANCE_DATE_TABS[0] };

// 시안이 없어 타임테이블 시안과 같은 구성으로 맞춤
const PerformancePage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { filters, setFilter } = useUrlFilters(FILTER_DEFAULTS);
  const selectedDate = filters.date;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const events = (performanceEvents[selectedDate] ?? []) as TimetableEvent[];
  const selectedEvent = selectedIndex === null ? null : events[selectedIndex];

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader showMenu />

      <RetroPageTitle title={t('nav.performance')} caption="SIDE B · LIVE STAGE" />

      <div className="pt-6">
        <NowPlaying />
      </div>

      {/* 스크롤해도 날짜 탭은 상단바 아래에 붙어 있다 */}
      <StickyBar>
        <CategoryList
          categories={PERFORMANCE_DATE_TABS}
          selectedCategory={selectedDate}
          onSelect={(date) => {
            setFilter('date', date);
            setSelectedIndex(null);
          }}
        />
      </StickyBar>

      {events.length === 0 ? (
        <div className="pt-6">
          <EmptyState message={language === 'ENG' ? 'No performances on this day' : '이 날은 공연 정보가 없어요'} />
        </div>
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
