// 부스 배치도. 운영진이 준 배치도 그림의 칸 위치를 비율 그대로 옮겼다 (좌표 단위는 그림 기준 1460×915)
const MAP_W = 1460;
const MAP_H = 915;

interface MapSpot {
  // 줄바꿈(\n)은 그대로 보인다 (긴 이름은 그림처럼 두 줄)
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const ROW_W = 265;
const ROW_H = 142;
const COL_W = 166;
const COL_H = 242;

const SPOTS: MapSpot[] = [
  // 위쪽 줄 (왼쪽부터)
  { label: '육군모집홍보', x: 368, y: 28, w: ROW_W, h: ROW_H },
  { label: '경기북부병무청', x: 633, y: 28, w: ROW_W, h: ROW_H },
  { label: '대학일자리\n플러스센터', x: 898, y: 28, w: ROW_W, h: ROW_H },
  { label: '재학생맞춤형\n고용서비스', x: 1163, y: 28, w: ROW_W, h: ROW_H },
  // 왼쪽 줄 (위부터)
  { label: '밀리패스', x: 24, y: 160, w: COL_W, h: COL_H },
  { label: '총학', x: 24, y: 402, w: COL_W, h: COL_H },
  { label: '학복', x: 24, y: 644, w: COL_W, h: COL_H },
  // 오른쪽 줄 (위부터)
  { label: '카운셀러', x: 1262, y: 198, w: COL_W, h: COL_H },
  // 아래쪽 줄 (왼쪽부터)
  { label: '세인영', x: 368, y: 730, w: ROW_W, h: ROW_H },
  { label: '우리부모', x: 633, y: 730, w: ROW_W, h: ROW_H },
  { label: '이웃사촌부', x: 898, y: 730, w: ROW_W, h: ROW_H },
  { label: '스키&클라이밍', x: 1163, y: 730, w: ROW_W, h: ROW_H },
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
          key={spot.label}
          className="absolute flex items-center justify-center overflow-hidden whitespace-pre-line break-keep border border-ink bg-[#2f5f7f] text-center font-display text-paper"
          style={{
            left: pct(spot.x, MAP_W),
            top: pct(spot.y, MAP_H),
            width: pct(spot.w, MAP_W),
            height: pct(spot.h, MAP_H),
            fontSize: '2.3cqw',
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
