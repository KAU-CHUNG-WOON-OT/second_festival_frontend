import { useEffect, useMemo, useReducer, useRef, type Ref } from 'react';
import { useFrame } from '@react-three/fiber';
import { ExtrudeGeometry, LatheGeometry, MathUtils, Shape, Vector2, type Group } from 'three';
import { useLanguage } from '@/contexts/LanguageContext';
import { createTrapRound, trapReducer } from '@/data/trapGameData';
import TrapStatus from './TrapStatus';
import { Part, ToyStage } from './toy3d';
import { DRAG_THRESHOLD_PX, useDragSpin } from './useDragSpin';

// 위턱·아래턱에 같은 수만큼. 0~7은 아래턱, 8~15는 위턱
const TEETH_PER_JAW = 8;
const TEETH = TEETH_PER_JAW * 2;
// 턱은 위에서 본 U자. 2D 도형의 y는 월드의 -z(앞쪽이 +z)가 된다.
const JAW_BACK = 1.3;
const JAW_ROUND_CENTER = -0.4;
const LIP_RADIUS = 1.2;
const GUM_RADIUS = 1.02;
const TOOTH_RADIUS = 0.86;
const TOOTH_BACK = 0.2;
const JAW_HEIGHT = 0.3;
const GUM_TOP = JAW_HEIGHT + 0.12;
const OPEN_ANGLE = -0.8;
// 위턱 아랫면(입천장) 높이
const PALATE = -0.08;

const uShape = (radius: number, back: number) => {
  const shape = new Shape();
  shape.moveTo(-radius, back);
  shape.lineTo(-radius, JAW_ROUND_CENTER);
  shape.absellipse(0, JAW_ROUND_CENTER, radius, radius, Math.PI, Math.PI * 2, false);
  shape.lineTo(radius, back);
  shape.lineTo(-radius, back);
  return shape;
};

const jawGeometry = (radius: number, back: number, depth: number, bevel: number) => {
  const geometry = new ExtrudeGeometry(uShape(radius, back), {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 40,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
};

// U자 잇몸 가장자리를 따라 t(0~1) 위치의 [x, z]
const rimPoint = (t: number): [number, number] => {
  const side = TOOTH_BACK - JAW_ROUND_CENTER;
  const arc = Math.PI * TOOTH_RADIUS;
  const d = t * (side * 2 + arc);
  if (d < side) return [-TOOTH_RADIUS, -(TOOTH_BACK - d)];
  if (d < side + arc) {
    const angle = Math.PI + (d - side) / TOOTH_RADIUS;
    return [TOOTH_RADIUS * Math.cos(angle), -(JAW_ROUND_CENTER + TOOTH_RADIUS * Math.sin(angle))];
  }
  return [TOOTH_RADIUS, -(JAW_ROUND_CENTER + (d - side - arc))];
};

const TOOTH_HEIGHT = 0.36;

// 끝이 둥근 장난감 이빨. 뿌리는 살짝 넓고 위는 반구로 마무리한다.
const createToothGeometry = () => {
  const neck = TOOTH_HEIGHT / 2;
  const tip = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 8) * (Math.PI / 2);
    return new Vector2(0.14 * Math.cos(a), neck + neck * Math.sin(a));
  });
  const geometry = new LatheGeometry(
    [new Vector2(0, 0), new Vector2(0.16, 0), new Vector2(0.155, neck * 0.5), ...tip],
    24,
  );
  geometry.translate(0, -neck, 0);
  return geometry;
};
// 이빨 16개가 같은 모양을 나눠 쓴다
const TOOTH_GEOMETRY = createToothGeometry();

interface ToothProps {
  index: number;
  // 잇몸 위 이빨 뿌리 높이와 이빨이 향하는 방향(1: 위, -1: 아래)
  base: number;
  dir: 1 | -1;
  pressed: boolean;
  disabled: boolean;
  onPress: (index: number) => void;
}

const Tooth = ({ index, base, dir, pressed, disabled, onPress }: ToothProps) => {
  const ref = useRef<Group>(null);
  // 닫혔을 때 위아래 이빨이 엇갈리도록 위턱은 반 칸 밀어서 놓는다
  const slot = index % TEETH_PER_JAW;
  const [x, z] = rimPoint((slot + (dir === 1 ? 0.3 : 0.7)) / TEETH_PER_JAW);

  useFrame((_, delta) => {
    const tooth = ref.current;
    if (!tooth) return;
    const k = 1 - Math.exp(-delta * 18);
    tooth.position.y = MathUtils.lerp(tooth.position.y, base + dir * (pressed ? 0.02 : 0.17), k);
    tooth.scale.y = MathUtils.lerp(tooth.scale.y, pressed ? 0.25 : 1, k);
  });

  return (
    <group position={[x, 0, z]}>
      <Part
        ref={ref}
        position={[0, base + dir * 0.17, 0]}
        rotation={[dir === 1 ? 0 : Math.PI, 0, 0]}
        color={pressed ? 'cream' : 'paper'}
        geometry={TOOTH_GEOMETRY}
      />
      {/* 손가락으로 누르기 쉽도록 이빨보다 넓은 투명 판정 영역 */}
      <mesh
        position={[0, base + dir * 0.2, 0]}
        onClick={(event) => {
          event.stopPropagation();
          if (event.delta > DRAG_THRESHOLD_PX) return;
          if (!disabled && !pressed) onPress(index);
        }}
        onPointerOver={() => {
          if (!disabled && !pressed) document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
        }}
      >
        <cylinderGeometry args={[0.24, 0.24, 0.45, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
};

// 정면에서 열린 위턱에 가리지 않도록 눈은 위턱 양옆으로 튀어나오게 붙인다.
// 위턱이 들린 만큼 매 프레임 되돌려 언제나 앞을 보게 한다 (Crocodile의 useFrame)
const Eye = ({ side, ref }: { side: 1 | -1; ref: Ref<Group> }) => (
  <group ref={ref} position={[side * 1.55, 0.6, -0.6]} rotation={[-OPEN_ANGLE, 0, 0]}>
    <Part color="olive">
      <sphereGeometry args={[0.48, 32, 32]} />
    </Part>
    <Part position={[side * 0.06, 0.06, 0.22]} color="paper">
      <sphereGeometry args={[0.34, 32, 32]} />
    </Part>
    <Part position={[side * 0.06, 0.08, 0.55]} scale={[0.55, 1.3, 0.4]} color="ink" outline={false}>
      <sphereGeometry args={[0.12, 16, 16]} />
    </Part>
  </group>
);

interface CrocodileProps {
  pressed: number[];
  bitten: boolean;
  onPress: (index: number) => void;
}

const Crocodile = ({ pressed, bitten, onPress }: CrocodileProps) => {
  const spin = useRef<Group>(null);
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const leftEye = useRef<Group>(null);
  const rightEye = useRef<Group>(null);
  // 옆에서도 볼 수 있게 좌우로 돌려 보기 (뒤로 넘어가진 않게 제한)
  useDragSpin(spin, 0.9);
  const bittenAt = useRef<number | null>(null);
  const lowerJaw = useMemo(() => jawGeometry(LIP_RADIUS, JAW_BACK, JAW_HEIGHT, 0.08), []);
  const upperJaw = useMemo(() => jawGeometry(LIP_RADIUS, JAW_BACK, 0.34, 0.08), []);
  const gum = useMemo(() => jawGeometry(GUM_RADIUS, JAW_BACK - 0.1, 0.04, 0), []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (bitten && bittenAt.current === null) bittenAt.current = t;
    if (!bitten) bittenAt.current = null;

    if (head.current) {
      const target = bitten ? 0 : OPEN_ANGLE + Math.sin(t * 2) * 0.03;
      head.current.rotation.x = MathUtils.lerp(
        head.current.rotation.x,
        target,
        1 - Math.exp(-delta * (bitten ? 30 : 6)),
      );
      for (const eye of [leftEye.current, rightEye.current]) {
        if (eye) eye.rotation.x = -head.current.rotation.x;
      }
    }
    if (body.current) {
      // 물면 잠깐 덜덜 떨린다
      const shaking = bittenAt.current !== null && t - bittenAt.current < 0.5;
      body.current.rotation.y = shaking ? Math.sin(t * 70) * 0.06 : 0;
      body.current.position.y = shaking ? Math.abs(Math.sin(t * 40)) * 0.08 : 0;
    }
  });

  return (
    <group ref={spin}>
      <group ref={body}>
        {/* 몸통과 등 돌기 */}
        <Part
          position={[0, 0.42, -2.3]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1, 1, 0.7]}
          color="olive"
        >
          <capsuleGeometry args={[0.85, 1.2, 8, 24]} />
        </Part>
        {[-1.7, -2.15, -2.6, -3.05].map((z) => (
          <Part key={z} position={[0, 1.0, z]} color="olive">
            <coneGeometry args={[0.16, 0.3, 12]} />
          </Part>
        ))}
        {[
          [-0.85, -1.7],
          [0.85, -1.7],
          [-0.85, -2.9],
          [0.85, -2.9],
        ].map(([x, z]) => (
          <Part key={`${x}${z}`} position={[x, 0.15, z]} scale={[1, 0.6, 1.2]} color="olive">
            <sphereGeometry args={[0.3, 24, 24]} />
          </Part>
        ))}

        {/* 아래턱: 입안, 혀, 아랫니 */}
        <Part geometry={lowerJaw} color="olive" />
        <Part geometry={gum} position={[0, JAW_HEIGHT + 0.08, 0]} color="rust" outline={false} />
        <Part position={[0, GUM_TOP, 0.05]} scale={[0.5, 0.1, 0.85]} color="maroon" outline={false}>
          <sphereGeometry args={[1, 32, 32]} />
        </Part>
        {Array.from({ length: TEETH_PER_JAW }, (_, i) => (
          <Tooth
            key={i}
            index={i}
            base={GUM_TOP}
            dir={1}
            pressed={pressed.includes(i)}
            disabled={bitten}
            onPress={onPress}
          />
        ))}

        {/* 윗턱: 뒤쪽 경첩을 축으로 열리고 닫힌다. 입천장에 윗니 */}
        <group ref={head} position={[0, GUM_TOP + 0.02, -JAW_BACK]} rotation={[OPEN_ANGLE, 0, 0]}>
          <group position={[0, 0, JAW_BACK]}>
            <Part geometry={upperJaw} color="olive" />
            {Array.from({ length: TEETH_PER_JAW }, (_, i) => (
              <Tooth
                key={i}
                index={TEETH_PER_JAW + i}
                base={PALATE}
                dir={-1}
                pressed={pressed.includes(TEETH_PER_JAW + i)}
                disabled={bitten}
                onPress={onPress}
              />
            ))}
            {[-0.24, 0.24].map((x) => (
              <group key={x} position={[x, 0.34, 1.32]}>
                <Part scale={[1, 0.7, 1]} color="olive">
                  <sphereGeometry args={[0.17, 20, 20]} />
                </Part>
                <Part position={[0, 0.06, 0.1]} scale={[1, 0.6, 1]} color="ink" outline={false}>
                  <sphereGeometry args={[0.06, 12, 12]} />
                </Part>
              </group>
            ))}
            {[
              [-0.4, 0.2],
              [0.35, -0.1],
              [0, 0.6],
              [-0.15, -0.3],
              [0.45, 0.75],
            ].map(([x, z]) => (
              <Part
                key={`${x}${z}`}
                position={[x, 0.42, z]}
                scale={[1, 0.45, 1]}
                color="olive"
                outline={false}
              >
                <sphereGeometry args={[0.09, 12, 12]} />
              </Part>
            ))}
            <Eye side={-1} ref={leftEye} />
            <Eye side={1} ref={rightEye} />
          </group>
        </group>
      </group>
    </group>
  );
};

const CrocodileGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const [{ pressed, sprung }, dispatch] = useReducer(trapReducer, TEETH, createTrapRound);

  useEffect(() => {
    if (sprung) navigator.vibrate?.([300, 100, 300]);
  }, [sprung]);

  return (
    <div className="flex flex-col gap-6">
      <p className="font-body-kr text-[14px] leading-5 text-paper/80">
        {isEng
          ? 'Take turns pressing one tooth, top or bottom. One of them makes the crocodile bite!'
          : '돌아가며 윗니든 아랫니든 하나씩 눌러요. 그중 하나를 누르면 악어가 콱 물어요!'}
      </p>
      <ToyStage camera={[0, 4.4, 6.0]} target={[0, 0.9, -0.5]}>
        <Crocodile
          pressed={pressed}
          bitten={sprung}
          onPress={(slot) => dispatch({ type: 'press', slot })}
        />
      </ToyStage>
      <TrapStatus
        sprung={sprung}
        left={TEETH - pressed.length}
        sprungTitle={isEng ? 'CHOMP!' : '콱!'}
        sprungMessage={isEng ? 'You got bitten — penalty!' : '물렸다! 벌칙 당첨!'}
        leftLabel={isEng ? 'TEETH LEFT' : '남은 이빨'}
        onReset={() => dispatch({ type: 'reset', random: Math.random() })}
      />
    </div>
  );
};

export default CrocodileGame;
