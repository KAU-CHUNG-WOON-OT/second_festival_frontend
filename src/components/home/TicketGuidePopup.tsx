import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import bibiImage from '@/assets/bibi.jpg';

const DISMISSED_KEY = 'cwf_ticket_guide_dismissed_v1';

interface TicketGuidePopupProps {
  onClose: () => void;
}

// 실제 HomeBoardingPassCard 치수를 0.50x 스케일로 축소
const SCALE = 0.5;
const CARD_W = Math.round(351 * SCALE);        // 176px
const CARD_H = Math.round(453 * SCALE);        // 227px
const PHOTO_TOP = Math.round(18 * SCALE);      // 9px
const PHOTO_H = Math.round(250 * SCALE);       // 125px
const PERF_CENTER = Math.round(309.5 * SCALE); // 155px
const NOTCH_R = Math.round(27 * SCALE);        // 14px
const STRIP_LEFT = Math.round(32 * SCALE);     // 16px
const STRIP_RIGHT = Math.round(30 * SCALE);    // 15px
const STRIP_TOP = Math.round(363 * SCALE);     // 182px
const STRIP_H = Math.round(57 * SCALE);        // 29px

const NOTCH_MASK = `
  radial-gradient(circle ${NOTCH_R}px at 0 ${PERF_CENTER}px, transparent ${NOTCH_R - 0.5}px, black ${NOTCH_R}px),
  radial-gradient(circle ${NOTCH_R}px at 100% ${PERF_CENTER}px, transparent ${NOTCH_R - 0.5}px, black ${NOTCH_R}px)
`;

// 레이아웃 상수
const PHONE_BORDER = 7;
const NOTCH_AREA_H = 15;   // mt-[10px] + h-[5px]
const SKELETON_GAP = 6;    // 노치 아래 여백
const SKELETON_H = 68;     // 스켈레톤 영역 전체 높이
const CARD_GAP = 8;        // 스켈레톤 ~ 카드 사이 여백

// "여기예요!" 툴팁 top (phone frame 외곽 기준)
const TOOLTIP_TOP =
  PHONE_BORDER + NOTCH_AREA_H + SKELETON_GAP + SKELETON_H + CARD_GAP +
  STRIP_TOP + Math.round(STRIP_H / 2) - 12;

const PhoneMockup = () => (
  <div className="relative mx-auto" style={{ width: '220px' }}>
    {/* 폰 프레임 */}
    <div
      className="relative overflow-hidden rounded-[32px]"
      style={{
        border: `${PHONE_BORDER}px solid #1e2235`,
        height: '360px',
        background: 'linear-gradient(170deg, #c8def0 0%, #b5d2ec 100%)',
      }}
    >
      {/* 노치 */}
      <div className="mx-auto mt-[10px] h-[5px] w-[48px] rounded-full bg-[#1e2235]/40" />

      {/* 스켈레톤 바 */}
      <div className="mt-[6px] flex flex-col gap-[5px] px-[10px]">
        {/* 얇은 바 (DayHeader) */}
        <div className="h-[10px] w-full rounded-[4px] bg-[#d8e2ed]" />
        {/* 넓은 블록 (공지 배너) */}
        <div className="h-[28px] w-full rounded-[6px] bg-[#d8e2ed]" />
        {/* 짧은 바 */}
        <div className="h-[8px] w-[65%] rounded-[4px] bg-[#d8e2ed]" />
        {/* 중간 바 */}
        <div className="h-[8px] w-[78%] rounded-[4px] bg-[#d8e2ed]" />
      </div>

      {/* 보딩패스 카드 */}
      <div
        className="relative mx-auto mt-[8px]"
        style={{
          width: `${CARD_W}px`,
          filter: 'drop-shadow(0 11px 20px rgba(47,79,112,0.26))',
        }}
      >
        <div
          className="relative overflow-hidden rounded-[10px] bg-[linear-gradient(180deg,#67b5e8_0%,#4ea9e6_100%)]"
          style={{
            height: `${CARD_H}px`,
            WebkitMaskImage: NOTCH_MASK,
            maskImage: NOTCH_MASK,
            WebkitMaskComposite: 'source-in',
            maskComposite: 'intersect',
          }}
        >
          {/* 아티스트 사진 */}
          <div
            className="absolute overflow-hidden rounded-[8px] bg-black"
            style={{
              left: '5px',
              right: '5px',
              top: `${PHOTO_TOP}px`,
              height: `${PHOTO_H}px`,
            }}
          >
            <img
              src={bibiImage}
              alt=""
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: 'center top' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/40" />

            <p className="absolute left-[8px] top-[8px] text-[10px] font-medium text-white/95">
              비비
            </p>
            <p className="absolute right-[8px] bottom-[8px] text-[10px] font-bold text-white/90">
              Day 2
            </p>

            <div className="absolute bottom-[10px] left-1/2 flex -translate-x-1/2 items-center gap-[3px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`block rounded-full ${
                    i === 1 ? 'size-[4px] bg-white' : 'size-[3px] bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 점선 구분선 */}
          <div
            className="absolute border-t-[1.5px] border-dashed border-white/30"
            style={{ left: '5px', right: '5px', top: `${PERF_CENTER}px` }}
          />

          {/* 하단 스트립 */}
          <div
            className="absolute flex items-center gap-[6px] border-t border-white/10"
            style={{
              left: `${STRIP_LEFT}px`,
              right: `${STRIP_RIGHT}px`,
              top: `${STRIP_TOP}px`,
              height: `${STRIP_H}px`,
            }}
          >
            <div className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-white/85 text-[11px]">
              ✈️
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-bold leading-tight text-white">
                팔찌 예약 바로가기
              </p>
              <p className="truncate text-[6px] leading-tight text-white/60">
                공연 티켓팅 안내 및 관람 가이드 안내
              </p>
            </div>
            <div className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-[#58b5ef]">
              <span className="text-[10px] font-medium leading-none text-white">›</span>
            </div>
          </div>
        </div>

        {/* 황색 점선 하이라이트 */}
        <div
          className="pointer-events-none absolute rounded-[5px]"
          style={{
            left: `${STRIP_LEFT - 3}px`,
            right: `${STRIP_RIGHT - 3}px`,
            top: `${STRIP_TOP - 3}px`,
            height: `${STRIP_H + 6}px`,
            border: '2px dashed #f5a623',
            boxShadow: '0 0 0 2px rgba(245,166,35,0.18)',
          }}
        />
      </div>
    </div>

    {/* "여기예요!" 말풍선 */}
    <div
      className="absolute rounded-full bg-[#1e2235] px-[10px] py-[5px] shadow-lg"
      style={{ right: '-8px', top: `${TOOLTIP_TOP}px`, whiteSpace: 'nowrap' }}
    >
      <span className="text-[10px] font-bold text-white">여기예요!</span>
    </div>
  </div>
);

const TicketGuidePopupContent = ({ onClose }: TicketGuidePopupProps) => {
  const navigate = useNavigate();

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    onClose();
  };

  const handleGoReserve = () => {
    onClose();
    navigate('/ticket');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <div className="px-6 pt-5 pb-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[12px] font-semibold text-amber-600">
              <span className="size-[6px] rounded-full bg-amber-500" />
              안내
            </span>
            <button
              onClick={onClose}
              className="flex size-[32px] items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
              aria-label="닫기"
            >
              <FiX size={18} />
            </button>
          </div>

          <h2 className="mb-2 text-[24px] font-bold leading-tight text-[#1e2235]">
            팔찌 예약 버튼,
            <br />
            <span className="text-[#4ea9e6]">화면 하단에 있어요</span>
          </h2>
          <p className="text-[13px] leading-relaxed text-gray-500">
            아래로 스크롤하면 파란색 카드 안에서 찾을 수 있어요
          </p>
        </div>

        {/* 폰 목업 */}
        <div className="py-5">
          <PhoneMockup />
        </div>

        <div className="px-6 pb-7 pt-2">
          <button
            onClick={handleGoReserve}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#4362d0] py-[16px] text-[16px] font-bold text-white active:opacity-80"
          >
            예약하러 가기
          </button>
          <button
            onClick={handleDismiss}
            className="mt-4 w-full text-[13px] text-gray-400 active:opacity-60"
          >
            다시 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
};

const TicketGuidePopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISSED_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return createPortal(
    <TicketGuidePopupContent onClose={() => setVisible(false)} />,
    document.body,
  );
};

export default TicketGuidePopup;
