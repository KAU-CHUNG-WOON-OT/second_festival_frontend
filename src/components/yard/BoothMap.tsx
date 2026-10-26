// 부스 배치도. 운영진이 준 배치도 그림의 칸 위치를 비율 그대로 옮겼다 (좌표 단위는 그림 기준 646×452)
const MAP_W = 646;
const MAP_H = 452;

interface MapSpot {
  // 줄바꿈(\n)은 그대로 보인다 (긴 이름은 두 줄, 세로 칸은 한 글자씩)
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  // 부스가 아닌 건물 (흰 바탕 둥근 칸)
  building?: boolean;
}

const ROW_W = 114;
const ROW_H = 58;
const COL_W = 51;

const SPOTS: MapSpot[] = [
  { label: '학생회관', x: 43, y: 13, w: 561, h: 42, building: true },
  // 위쪽 줄 (왼쪽부터)
  { label: '육군모집홍보', x: 155, y: 75, w: ROW_W, h: ROW_H },
  { label: '경기북부병무청', x: 276, y: 75, w: ROW_W, h: ROW_H },
  { label: '대학일자리\n플러스센터', x: 397, y: 75, w: ROW_W, h: ROW_H },
  { label: '재학생맞춤형\n고용서비스', x: 518, y: 75, w: ROW_W, h: ROW_H },
  // 왼쪽 줄 (위부터)
  { label: '총\n학\n생\n회', x: 17, y: 111, w: COL_W, h: 100 },
  { label: '총\n학\n생\n회', x: 17, y: 217, w: COL_W, h: 108 },
  { label: '학\n복\n위', x: 17, y: 334, w: COL_W, h: 100 },
  // 오른쪽 줄 (위부터)
  { label: '카\n운\n셀\n러', x: 582, y: 146, w: COL_W, h: 107 },
  { label: '밀\n리\n패\n스', x: 582, y: 262, w: COL_W, h: 108 },
  // 아래쪽 줄 (왼쪽부터)
  { label: '세인영', x: 155, y: 379, w: ROW_W, h: ROW_H },
  { label: '우리부모', x: 276, y: 379, w: ROW_W, h: ROW_H },
  { label: '이웃사촌부', x: 397, y: 379, w: ROW_W, h: ROW_H },
  { label: '스키&클라이밍', x: 518, y: 379, w: ROW_W, h: ROW_H },
];

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

// 글자 크기를 지도 폭에 비례(cqw)시켜 사진처럼 어떤 크기에서도 같은 모양으로 보이게 함
const BoothMap = () => {
  return (
    <div
      className="@container relative w-full rounded-[8px] border-2 border-ink bg-paper"
      style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}
    >
      {SPOTS.map((spot) => (
        <span
          key={`${spot.x}-${spot.y}`}
          className={`absolute flex items-center justify-center overflow-hidden whitespace-pre-line break-keep border border-ink text-center font-display ${
            spot.building ? 'rounded-[8px] bg-paper text-ink' : 'bg-[#2f5f7f] text-paper'
          }`}
          style={{
            left: pct(spot.x, MAP_W),
            top: pct(spot.y, MAP_H),
            width: pct(spot.w, MAP_W),
            height: pct(spot.h, MAP_H),
            fontSize: spot.building ? '3cqw' : '2.3cqw',
            lineHeight: 1.15,
          }}
        >
          {spot.label}
        </span>
      ))}
    </div>
  );
};

export default BoothMap;
