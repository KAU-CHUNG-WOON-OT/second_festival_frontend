// 시안의 캠퍼스 부스 배치도. 좌표는 확대 보기 기준(342×219) 값을 비율로 사용
const MAP_W = 342;
const MAP_H = 219;

type Tone = 'mustard' | 'sage' | 'maroon' | 'stone' | 'coral' | 'ink';

interface MapSpot {
  label: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  tone: Tone;
}

const TONE_CLASS: Record<Tone, string> = {
  mustard: 'border border-ink bg-mustard text-ink',
  sage: 'border border-ink bg-[#b4c47a] text-ink',
  maroon: 'border border-ink bg-maroon text-paper',
  stone: 'border border-ink bg-[#c9bfa7] text-ink',
  coral: 'border border-ink bg-[#e9775a] text-ink',
  ink: 'bg-ink text-paper',
};

// TODO: 실제 부스 배치 확정 시 교체 (현재 시안 기준)
const SPOTS: MapSpot[] = [
  { label: '재징유', x: 40.35, y: 6.78, tone: 'mustard' },
  { label: '우리부모', x: 77.47, y: 6.78, tone: 'mustard' },
  { label: '광대와끼', x: 114.61, y: 6.78, tone: 'mustard' },
  { label: '울뮤', x: 151.75, y: 6.78, tone: 'mustard' },
  { label: 'ESC', x: 188.88, y: 6.78, tone: 'sage' },
  { label: '픽쳐', x: 226.02, y: 6.78, tone: 'sage' },
  { label: '라튜타', x: 40.35, y: 46.99, tone: 'maroon' },
  { label: 'SRS', x: 40.35, y: 73.79, tone: 'maroon' },
  { label: 'MAC', x: 40.35, y: 100.6, tone: 'maroon' },
  { label: '학생활동회', x: 40.35, y: 127.4, tone: 'maroon' },
  { label: '항체연', x: 40.35, y: 154.21, tone: 'maroon' },
  { label: '도스', x: 128.11, y: 114, tone: 'mustard' },
  { label: '랩플레인', x: 128.11, y: 140.81, tone: 'mustard' },
  { label: '에어락', x: 128.11, y: 167.61, tone: 'mustard' },
  { label: '학군단', x: 175.38, y: 114, tone: 'stone' },
  { label: '방송국', x: 175.38, y: 140.81, tone: 'stone' },
  { label: '날틀', x: 175.38, y: 167.61, tone: 'stone' },
  { label: 'AVIATORS', x: 276.54, y: 33.59, w: 41, tone: 'coral' },
  { label: '보잉', x: 276.54, y: 60.39, w: 41, tone: 'coral' },
  { label: '태권도부', x: 276.54, y: 87.2, w: 41, tone: 'coral' },
  { label: '에어윙즈', x: 276.54, y: 114, w: 41, tone: 'coral' },
  { label: '줄울림', x: 40.35, y: 184.36, tone: 'mustard' },
  { label: '알피네', x: 77.47, y: 184.36, tone: 'mustard' },
  { label: 'SEED', x: 175.38, y: 190.9, h: 17, tone: 'stone' },
  { label: 'IKAU', x: 215.89, y: 190.9, h: 17, tone: 'sage' },
  { label: 'PTPI', x: 256.4, y: 190.9, h: 17, tone: 'sage' },
  { label: '무대', x: 6.83, y: 42.81, w: 20, h: 86, tone: 'ink' },
  { label: '입구', x: 323.79, y: 128.49, w: 14, h: 39, tone: 'ink' },
  { label: '출구', x: 121.25, y: 193.18, w: 41, h: 19, tone: 'ink' },
];

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

interface BoothMapProps {
  // 목록 화면의 작은 지도는 글자를 줄임
  compact?: boolean;
}

const BoothMap = ({ compact = false }: BoothMapProps) => {
  return (
    <div
      className="relative w-full rounded-[8px] border-2 border-ink bg-paper"
      style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
    >
      {SPOTS.map((spot) => (
        <span
          key={spot.label}
          className={`absolute flex items-center justify-center overflow-hidden rounded-[3px] px-px text-center font-display break-all ${TONE_CLASS[spot.tone]}`}
          style={{
            left: pct(spot.x, MAP_W),
            top: pct(spot.y, MAP_H),
            width: pct(spot.w ?? 34, MAP_W),
            height: pct(spot.h ?? 20, MAP_H),
            fontSize: spot.tone === 'ink' ? 8 : compact ? 7 : 11,
            lineHeight: 1,
          }}
        >
          {spot.label}
        </span>
      ))}
    </div>
  );
};

export default BoothMap;
