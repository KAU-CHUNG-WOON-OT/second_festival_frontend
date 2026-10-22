import { useRef, type ReactNode } from 'react';
import SkyDots from './SkyDots';
import { STICKY_BAND_TOP, skyBackground } from './retroLayout';
import { useStickyOverlap } from '../../hooks/useStickyOverlap';

// 띠 뒤 하늘의 별. 띠 안에서만 보이게 자르고, 뒤 하늘의 별과 같은 자리에 오도록 띠의 화면 위치만큼 끌어올린다
export const BandStars = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-x-0" style={{ top: 'calc(-1 * var(--band-top))' }}>
      <SkyDots night />
    </div>
  </div>
);

const FADE_MASK = 'linear-gradient(to bottom, black calc(100% - 12px), transparent)';

interface StickyBarProps {
  children: ReactNode;
}

// 목록 필터·검색창처럼 스크롤해도 상단바 바로 아래에 붙어 있는 띠.
// 붙어서 내용 위에 겹치면 뒤 하늘·별을 똑같이 깔고 아래 12px을 흐리게 해 카드가 자연스럽게 밑으로 들어간다.
// 위·아래 12px 여백은 같은 크기의 음수 여백으로 상쇄해 배치는 그대로 둔다. 띠 전체가 탭을 받아 밑에 가려진 카드가 눌리지 않는다.
// 페이지 루트(긴 세로 흐름)의 바로 아래 자식이어야 붙어 있을 수 있다
const StickyBar = ({ children }: StickyBarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOver = useStickyOverlap(ref);

  return (
    <div
      ref={ref}
      className="sticky z-20 -mx-5 -mb-3 mt-3 px-5 py-3"
      style={{
        top: STICKY_BAND_TOP,
        background: isOver ? skyBackground('var(--band-top)') : undefined,
        maskImage: isOver ? FADE_MASK : undefined,
        WebkitMaskImage: isOver ? FADE_MASK : undefined,
      }}
    >
      {isOver && <BandStars />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default StickyBar;
