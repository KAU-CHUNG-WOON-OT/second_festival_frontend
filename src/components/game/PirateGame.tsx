import { useEffect, useMemo, useReducer, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { LatheGeometry, MathUtils, Vector2, type Group } from 'three';
import { useLanguage } from '@/contexts/LanguageContext';
import { createTrapRound, trapReducer } from '@/data/trapGameData';
import TrapStatus from './TrapStatus';
import { Part, ToyStage } from './toy3d';
import { DRAG_THRESHOLD_PX, useDragSpin } from './useDragSpin';

const BARREL_HEIGHT = 2.2;
const HOLE_ROWS = [0.65, 1.1, 1.55];
const HOLES_PER_ROW = 8;
// 통을 빙 둘러 뚫고, 줄마다 반 칸씩 엇갈리게 놓는다
const HOLES = HOLE_ROWS.flatMap((y, row) =>
  Array.from({ length: HOLES_PER_ROW }, (_, i) => ({
    y,
    angle: ((i + (row % 2) * 0.5) * Math.PI * 2) / HOLES_PER_ROW,
  })),
);
const SWORD_COLORS = ['rust', 'tape-blue', 'olive', 'maroon'] as const;
const PIRATE_REST_Y = BARREL_HEIGHT + 0.38;
const PIRATE_POP_HEIGHT = 0.95;

// 가운데가 불룩한 통
const barrelRadius = (y: number) => 1.05 + 0.18 * Math.sin((Math.PI * y) / BARREL_HEIGHT);

interface SlotProps {
  index: number;
  order: number;
  disabled: boolean;
  onPress: (index: number) => void;
}

const Slot = ({ index, order, disabled, onPress }: SlotProps) => {
  const sword = useRef<Group>(null);
  const { y, angle } = HOLES[index];
  const inserted = order >= 0;
  const grip = SWORD_COLORS[order % SWORD_COLORS.length];

  // 칼은 밖에서 구멍 쪽으로 미끄러져 들어간다
  useFrame((_, delta) => {
    if (sword.current)
      sword.current.position.z = MathUtils.lerp(
        sword.current.position.z,
        0,
        1 - Math.exp(-delta * 14),
      );
  });

  return (
    <group rotation={[0, angle, 0]}>
      <group position={[0, y, barrelRadius(y) - 0.01]}>
        <Part color="ink" outline={false} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 24]} />
        </Part>
        <Part color="maroon" outline={false} position={[0, 0, 0.01]}>
          <torusGeometry args={[0.12, 0.035, 10, 24]} />
        </Part>
        {inserted && (
          <group ref={sword} position={[0, 0, 0.6]}>
            <Part color="paper" position={[0, 0, 0.1]}>
              <boxGeometry args={[0.4, 0.08, 0.08]} />
            </Part>
            <Part color={grip} position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.3, 16]} />
            </Part>
            <Part color={grip} position={[0, 0, 0.46]}>
              <sphereGeometry args={[0.08, 16, 16]} />
            </Part>
          </group>
        )}
        {/* 손가락으로 누르기 쉽도록 구멍보다 넓은 투명 판정 영역 */}
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            if (event.delta > DRAG_THRESHOLD_PX) return;
            if (!disabled && !inserted) onPress(index);
          }}
          onPointerOver={() => {
            if (!disabled && !inserted) document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = '';
          }}
        >
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
};

const Pirate = ({ popped }: { popped: boolean }) => {
  const ref = useRef<Group>(null);
  const poppedAt = useRef<number | null>(null);

  useFrame(({ clock }) => {
    const pirate = ref.current;
    if (!pirate) return;
    const t = clock.elapsedTime;
    if (popped && poppedAt.current === null) poppedAt.current = t;
    if (!popped) poppedAt.current = null;

    if (poppedAt.current === null) {
      // 통 안에서 빼꼼
      pirate.position.y = PIRATE_REST_Y + Math.sin(t * 2.2) * 0.05;
      pirate.rotation.set(0, Math.sin(t * 0.8) * 0.3, 0);
      return;
    }
    // 튀어 올라 흔들리다 멈춘다
    const s = t - poppedAt.current;
    const spring = 1 - Math.exp(-6 * s) * Math.cos(14 * s);
    pirate.position.y = PIRATE_REST_Y + PIRATE_POP_HEIGHT * spring;
    pirate.rotation.set(
      0,
      Math.min(s * 14, Math.PI * 4),
      Math.exp(-3 * s) * Math.sin(18 * s) * 0.4,
    );
  });

  return (
    <group ref={ref} position={[0, PIRATE_REST_Y, 0]}>
      {/* 줄무늬 셔츠와 팔: 평소엔 통 안에 숨어 있다 */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Part key={i} color={i % 2 ? 'paper' : 'tape-blue'} position={[0, -0.5 - i * 0.2, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.2, 24]} />
        </Part>
      ))}
      {[-1, 1].map((side) => (
        <Part
          key={side}
          color="tape-blue"
          position={[side * 0.48, -0.55, 0]}
          rotation={[0, 0, side * -0.9]}
        >
          <capsuleGeometry args={[0.09, 0.4, 6, 12]} />
        </Part>
      ))}

      <Part color="cream">
        <sphereGeometry args={[0.42, 32, 32]} />
      </Part>
      {/* 두건과 매듭 */}
      <Part color="rust" position={[0, 0.03, 0]}>
        <sphereGeometry args={[0.44, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.1]} />
      </Part>
      {[
        [0.12, 0.3, 0.27],
        [-0.18, 0.25, 0.3],
        [0.3, 0.18, 0.23],
        [-0.05, 0.42, 0.06],
      ].map(([x, y, z]) => (
        <Part key={`${x}${y}`} color="paper" outline={false} position={[x, y, z]}>
          <sphereGeometry args={[0.04, 10, 10]} />
        </Part>
      ))}
      {[0.1, -0.1].map((y) => (
        <Part key={y} color="rust" position={[-0.42, 0.12 + y, -0.12]}>
          <sphereGeometry args={[0.09, 16, 16]} />
        </Part>
      ))}
      {/* 얼굴: 안대, 눈, 코, 콧수염 */}
      <Part
        color="ink"
        outline={false}
        position={[-0.15, 0.05, 0.37]}
        rotation={[Math.PI / 2 - 0.2, 0, 0]}
      >
        <cylinderGeometry args={[0.11, 0.11, 0.04, 20]} />
      </Part>
      <Part color="ink" outline={false} rotation={[0.1, 0, 0.5]}>
        <torusGeometry args={[0.425, 0.015, 8, 48]} />
      </Part>
      <Part color="ink" outline={false} position={[0.15, 0.06, 0.38]}>
        <sphereGeometry args={[0.055, 12, 12]} />
      </Part>
      <Part color="cream" position={[0, -0.05, 0.42]}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </Part>
      {[-1, 1].map((side) => (
        <Part
          key={side}
          color="ink"
          outline={false}
          position={[side * 0.12, -0.15, 0.37]}
          rotation={[0, 0, Math.PI / 2 + side * 0.35]}
        >
          <capsuleGeometry args={[0.035, 0.14, 4, 8]} />
        </Part>
      ))}
    </group>
  );
};

interface BarrelProps {
  pressed: number[];
  popped: boolean;
  onPress: (index: number) => void;
}

const Barrel = ({ pressed, popped, onPress }: BarrelProps) => {
  const ref = useRef<Group>(null);
  const spin = useRef<Group>(null);
  useDragSpin(spin);
  const poppedAt = useRef<number | null>(null);
  const body = useMemo(() => {
    const points = Array.from({ length: 17 }, (_, i) => {
      const y = (BARREL_HEIGHT * i) / 16;
      return new Vector2(barrelRadius(y), y);
    });
    // 인덱스를 풀고 법선을 다시 계산하면 면마다 각진 널빤지처럼 보인다
    const geometry = new LatheGeometry(points, 20).toNonIndexed();
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useFrame(({ clock }) => {
    const barrel = ref.current;
    if (!barrel) return;
    const t = clock.elapsedTime;
    if (popped && poppedAt.current === null) poppedAt.current = t;
    if (!popped) poppedAt.current = null;
    // 튀어나오는 순간 통이 덜컹한다
    const shaking = poppedAt.current !== null && t - poppedAt.current < 0.4;
    barrel.rotation.z = shaking ? Math.sin(t * 70) * 0.03 : 0;
  });

  return (
    <group ref={ref}>
      {/* 손가락으로 돌리는 부분. 통과 통아저씨가 함께 돈다 */}
      <group ref={spin}>
        {/* 통 몸통이 뒤쪽 구멍을 가리도록 클릭을 여기서 멈춘다 */}
        <Part geometry={body} color="mustard" onClick={(event) => event.stopPropagation()} />
        {/* 통 입구를 막는 어두운 안쪽 */}
        <Part
          color="ink"
          outline={false}
          position={[0, BARREL_HEIGHT - 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[barrelRadius(BARREL_HEIGHT), 48]} />
        </Part>
        {[0.22, BARREL_HEIGHT - 0.25].map((y) => (
          <Part key={y} color="maroon" position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[barrelRadius(y) + 0.02, 0.07, 12, 64]} />
          </Part>
        ))}
        <Part color="maroon" position={[0, BARREL_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[barrelRadius(BARREL_HEIGHT), 0.07, 12, 64]} />
        </Part>
        {HOLES.map((_, i) => (
          <Slot key={i} index={i} order={pressed.indexOf(i)} disabled={popped} onPress={onPress} />
        ))}
        <Pirate popped={popped} />
      </group>
    </group>
  );
};

const PirateGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const [{ pressed, sprung }, dispatch] = useReducer(trapReducer, HOLES.length, createTrapRound);

  useEffect(() => {
    if (sprung) navigator.vibrate?.([300, 100, 300]);
  }, [sprung]);

  return (
    <div className="flex flex-col gap-6">
      <p className="font-body-kr text-[14px] leading-5 opacity-70">
        {isEng
          ? 'Spin the barrel with your finger and take turns sticking in a sword. Whoever makes the pirate pop out gets the penalty!'
          : '손가락으로 통을 돌려 가며 구멍에 칼을 하나씩 꽂아요. 통아저씨를 튀어나오게 한 사람이 벌칙!'}
      </p>
      <ToyStage camera={[0, 3.5, 7.0]} target={[0, 1.95, 0]}>
        <Barrel
          pressed={pressed}
          popped={sprung}
          onPress={(slot) => dispatch({ type: 'press', slot })}
        />
      </ToyStage>
      <TrapStatus
        sprung={sprung}
        left={HOLES.length - pressed.length}
        sprungTitle={isEng ? 'POP!' : '펑!'}
        sprungMessage={isEng ? 'The pirate popped — penalty!' : '통아저씨 탈출! 벌칙 당첨!'}
        leftLabel={isEng ? 'HOLES LEFT' : '남은 구멍'}
        onReset={() => dispatch({ type: 'reset', random: Math.random() })}
      />
    </div>
  );
};

export default PirateGame;
