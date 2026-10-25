import { useServerNowEvery } from '../../hooks/useServerNow';
import { useStoreCongestion } from '../../hooks/useStoreCongestion';
import { parseServerTime } from '../../data/hangmentleClock';
import {
  CONGESTION_INFO,
  CONGESTION_LEVELS,
  congestionDescription,
  congestionLabel,
  congestionOf,
  congestionStep,
  formatUpdatedAgo,
  type CongestionLevel,
} from '../../data/storeCongestion';
import CongestionBadge from './CongestionBadge';

const CARD =
  'rounded-[16px] border-2 border-ink bg-paper p-5 text-ink shadow-[5px_5px_0px_0px_var(--color-ink)]';
// '3분 전'은 분 단위라 15초마다 다시 계산하면 충분하다
const AGO_REFRESH_MS = 15_000;

// 여유 → 만석 4칸 눈금. 지금 단계까지 그 단계 색으로 채운다
const CongestionMeter = ({ level, isEng }: { level: CongestionLevel; isEng: boolean }) => {
  const step = congestionStep(level);
  return (
    <ol className="grid grid-cols-4 gap-1 pt-4" aria-hidden>
      {CONGESTION_LEVELS.map((item, i) => (
        <li
          key={item}
          className={`flex h-8 items-center justify-center rounded-[8px] border border-ink text-[12px] leading-4 ${
            isEng ? 'font-typewriter uppercase' : 'font-body-kr'
          } ${i < step ? CONGESTION_INFO[level].colorClass : 'bg-cream text-ink/40'} ${
            item === level ? 'font-bold' : ''
          }`}
        >
          {congestionLabel(item, isEng)}
        </li>
      ))}
    </ol>
  );
};

// 가게 화면의 실시간 현황 카드: 지금 단계, 짧은 설명, 'N분 전 업데이트'(서버 시계 기준).
// 화면이 떠 있는 동안 30초마다 새로 받는다
const StoreLiveStatus = ({ storeId, isEng }: { storeId: number; isEng: boolean }) => {
  const { data, isPending, isError } = useStoreCongestion();
  const now = useServerNowEvery(AGO_REFRESH_MS);
  const entry = congestionOf(data, storeId);
  const level = entry?.level ?? null;
  const updatedMs = parseServerTime(entry?.updatedAt);

  let body;
  if (isPending) {
    body = (
      <p className="pt-2 font-body-kr text-[14px] leading-[22px] text-ink/60">
        {isEng ? 'Loading…' : '불러오는 중이에요…'}
      </p>
    );
  } else if (!data && isError) {
    body = (
      <p className="pt-2 font-body-kr text-[14px] leading-[22px] text-ink/70">
        {isEng
          ? "Couldn't load the live status. We'll try again shortly."
          : '현황을 불러오지 못했어요. 잠시 후 다시 불러올게요.'}
      </p>
    );
  } else if (!level) {
    body = (
      <p className="pt-2 font-body-kr text-[14px] leading-[22px] text-ink/70">
        {isEng ? 'No live status has been posted yet.' : '아직 현황이 등록되지 않았어요'}
      </p>
    );
  } else {
    body = (
      <>
        <div className="pt-4">
          <CongestionBadge level={level} isEng={isEng} large />
        </div>
        <CongestionMeter level={level} isEng={isEng} />
        <p className="pt-3 font-body-kr text-[14px] leading-[22px] text-ink/80">
          {congestionDescription(level, isEng)}
        </p>
        {updatedMs !== null && (
          <p className="pt-3 font-typewriter text-[12px] leading-4 opacity-60">
            {formatUpdatedAgo(updatedMs, now, isEng)}
          </p>
        )}
      </>
    );
  }

  return (
    <section className={CARD} aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <p className="font-typewriter text-[12px] leading-4 opacity-60">LIVE STATUS</p>
        {level && (
          <span className="flex items-center gap-[6px] font-typewriter text-[12px] font-bold leading-4 tracking-[1.2px] text-rust">
            <span className="size-2 animate-pulse rounded-full bg-rust motion-reduce:animate-none" />
            LIVE
          </span>
        )}
      </div>
      <h2 className="pt-2 font-display text-[22px] leading-7">
        {isEng ? 'Live status' : '실시간 현황'}
      </h2>
      {body}
    </section>
  );
};

export default StoreLiveStatus;
