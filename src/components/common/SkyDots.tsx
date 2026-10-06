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

interface SkyDotsProps {
  dots?: readonly SkyDot[];
  className?: string;
}

const SkyDots = ({ dots = DEFAULT_DOTS, className = '' }: SkyDotsProps) => (
  <div
    className={`pointer-events-none absolute inset-x-0 top-0 z-0 h-[320px] ${className}`}
    aria-hidden="true"
  >
    {dots.map((dot, index) => (
      <span
        key={`${dot.left}-${dot.top}-${index}`}
        className="absolute rounded-full bg-white"
        style={{ left: dot.left, top: dot.top, width: dot.size, height: dot.size }}
      />
    ))}
  </div>
);

export default SkyDots;
