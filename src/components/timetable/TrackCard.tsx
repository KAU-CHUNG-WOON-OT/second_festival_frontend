import { useLanguage } from '../../contexts/LanguageContext';
import { TYPE_ICON, formatTrackNo, type TimetableEvent } from '../../data/timetableData';

interface TrackCardProps {
  event: TimetableEvent;
  trackNo: number;
  done: boolean;
  onClick: () => void;
}

const TrackCard = ({ event, trackNo, done, onClick }: TrackCardProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full flex-col overflow-clip rounded-[16px] border-2 border-ink bg-paper text-left text-ink shadow-[5px_5px_0px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] ${
        done ? 'opacity-70' : ''
      }`}
    >
      {/* 상단: 시간 · 트랙 번호 · 상태 */}
      <div className="flex items-center gap-4 px-4 py-3">
        <span className="font-condensed text-[36px] font-black leading-[40px]">{event.time}</span>
        <span className="h-9 border-l border-ink/40" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-typewriter text-[12px] leading-4 opacity-60">TRACK</span>
          <span className="font-typewriter text-[14px] font-bold leading-5 text-tape-blue">
            {formatTrackNo(trackNo)}
          </span>
        </div>
        <span
          className={`rounded-[4px] px-2 py-1 font-typewriter text-[11px] font-bold leading-[16.5px] ${
            done ? 'bg-ink/15 text-ink/60' : 'bg-tape-blue text-paper'
          }`}
        >
          {done ? 'DONE' : 'SCHEDULED'}
        </span>
      </div>

      {/* 하단: 제목 · 설명 · 타입 · 무대 */}
      <div className="border-t border-dashed border-ink/50 px-4 py-3">
        <h3 className="font-display text-[20px] leading-7">{isEng ? event.title_en : event.title}</h3>
        <p className="font-body-kr text-[14px] leading-5 opacity-70">
          {isEng ? event.description_en : event.description}
        </p>
        <div className="flex items-end justify-between pt-3">
          <span className="flex items-center gap-[6px] rounded-full bg-ink px-3 py-1 font-typewriter text-[12px] font-bold leading-4">
            <span className="text-mustard">{TYPE_ICON[event.type]}</span>
            <span className="text-paper">{event.type}</span>
          </span>
          <div className="flex flex-col items-end opacity-70">
            <span className="font-typewriter text-[10px] leading-[15px]">STAGE</span>
            <span className="font-display text-[14px] leading-5">
              {isEng ? event.stage_en : event.stage}
            </span>
          </div>
        </div>
      </div>

      {/* 티켓 펀치 홈 */}
      <span className="absolute -left-[10px] top-[54px] size-5 rounded-full border border-ink bg-cream" />
      <span className="absolute -right-[10px] top-[54px] size-5 rounded-full border border-ink bg-cream" />
    </button>
  );
};

export default TrackCard;
