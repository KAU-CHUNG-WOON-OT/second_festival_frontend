interface SkyDot {
  left: number;
  top: number;
  size: number;
}

const DEFAULT_DOTS: readonly SkyDot[] = [
  { left: 357, top: 38, size: 4 },
  { left: 328, top: 13, size: 2 },
  { left: 338, top: -8, size: 3 },
  { left: 103, top: 62, size: 4 },
  { left: 34, top: 147, size: 3 },
  { left: 19, top: 88, size: 2 },
  { left: 161, top: 169, size: 2 },
  { left: 309, top: 77, size: 3 },
  { left: 362, top: 65, size: 3 },
];

// 노을 배경 페이지용: 헤더·알약·제목·부제(왼쪽 위 글자 자리)를 피해 오른쪽과 틈에만 뿌림
const NIGHT_DOTS: readonly SkyDot[] = [
  { left: 318, top: 8, size: 2 },
  { left: 96, top: 74, size: 2 },
  { left: 246, top: 70, size: 3 },
  { left: 352, top: 140, size: 3 },
  { left: 316, top: 182, size: 2 },
  { left: 372, top: 222, size: 2 },
  { left: 196, top: 234, size: 2 },
  { left: 8, top: 268, size: 2 },
  { left: 6, top: 384, size: 3 },
];

interface SkyDotsProps {
  dots?: readonly SkyDot[];
  // 노을 배경 페이지: 기본 별 대신 NIGHT_DOTS
  night?: boolean;
  className?: string;
}

const SkyDots = ({ dots, night = false, className = '' }: SkyDotsProps) => (
  <div
    className={`pointer-events-none absolute inset-x-0 top-0 z-0 h-[320px] ${className}`}
    aria-hidden="true"
  >
    {(dots ?? (night ? NIGHT_DOTS : DEFAULT_DOTS)).map((dot, index) => (
      <span
        key={`${dot.left}-${dot.top}-${index}`}
        className="absolute rounded-full bg-white"
        style={{ left: dot.left, top: dot.top, width: dot.size, height: dot.size }}
      />
    ))}
  </div>
);

export default SkyDots;
