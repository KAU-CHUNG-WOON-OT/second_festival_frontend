import { useLayoutEffect, useMemo, type ReactNode } from 'react';
import { Canvas, useThree, type ThreeElements } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { BackSide, MeshBasicMaterial, type BufferGeometry } from 'three';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

type ColorToken =
  | 'ink'
  | 'paper'
  | 'cream'
  | 'mustard'
  | 'rust'
  | 'tape-blue'
  | 'sky-light'
  | 'olive'
  | 'maroon';

let colorCache: Record<ColorToken, string> | null = null;

// 3D 재질도 index.css의 색 토큰을 그대로 쓴다
const toyColor = (token: ColorToken) => {
  if (!colorCache) {
    const style = getComputedStyle(document.documentElement);
    const read = (name: ColorToken) => style.getPropertyValue(`--color-${name}`).trim();
    colorCache = {
      ink: read('ink'),
      paper: read('paper'),
      cream: read('cream'),
      mustard: read('mustard'),
      rust: read('rust'),
      'tape-blue': read('tape-blue'),
      'sky-light': read('sky-light'),
      olive: read('olive'),
      maroon: read('maroon'),
    };
  }
  return colorCache[token];
};

const OUTLINE_THICKNESS = 0.035;
let outlineMaterial: MeshBasicMaterial | null = null;

// 뒷면만 그리는 껍데기를 법선 방향으로 부풀려 레트로 카드 같은 진갈색 외곽선을 만든다
const getOutlineMaterial = () => {
  if (!outlineMaterial) {
    outlineMaterial = new MeshBasicMaterial({ color: toyColor('ink'), side: BackSide });
    outlineMaterial.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `vec3 transformed = position + normal * ${OUTLINE_THICKNESS.toFixed(3)};`,
      );
    };
  }
  return outlineMaterial;
};

type PartProps = ThreeElements['group'] & {
  color: ColorToken;
  outline?: boolean;
  geometry?: BufferGeometry;
};

// 광택 있는 플라스틱 장난감 부품. children에는 geometry 요소를 넣는다.
export const Part = ({ color, outline = true, geometry, children, ...props }: PartProps) => {
  // 각진 도형은 모서리에서 법선이 갈라져 외곽선이 끊기므로 법선을 합친 사본을 쓴다
  const outlineGeometry = useMemo(
    () => geometry && toCreasedNormals(geometry, Math.PI),
    [geometry],
  );
  return (
    <group {...props}>
      <mesh geometry={geometry}>
        {children}
        <meshPhysicalMaterial
          color={toyColor(color)}
          roughness={0.42}
          clearcoat={0.7}
          clearcoatRoughness={0.25}
        />
      </mesh>
      {outline && (
        <mesh geometry={outlineGeometry} material={getOutlineMaterial()}>
          {children}
        </mesh>
      )}
    </group>
  );
};

const LookAt = ({ target }: { target: [number, number, number] }) => {
  const camera = useThree((state) => state.camera);
  useLayoutEffect(() => {
    camera.lookAt(...target);
  }, [camera, target]);
  return null;
};

interface ToyStageProps {
  camera: [number, number, number];
  target: [number, number, number];
  children: ReactNode;
}

export const ToyStage = ({ camera, target, children }: ToyStageProps) => (
  <div className="aspect-square w-full overflow-hidden rounded-[24px] border-2 border-ink bg-sky-light drop-shadow-[5px_5px_0px_var(--color-ink)]">
    {/* 세로 스크롤은 브라우저에 맡기고 가로로 끄는 건 장난감 돌리기에 쓴다 */}
    <Canvas
      flat
      dpr={[1, 2]}
      camera={{ position: camera, fov: 35 }}
      style={{ touchAction: 'pan-y' }}
    >
      <LookAt target={target} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 6, 4]} intensity={1.8} />
      <directionalLight position={[-2, 3, 6]} intensity={0.8} />
      {/* 내려받는 HDR 없이 판 조명만으로 만든 스튜디오 반사광 */}
      <Environment resolution={256}>
        <Lightformer
          intensity={2.2}
          position={[0, 5, 2]}
          scale={[8, 3, 1]}
          rotation-x={Math.PI / 2}
        />
        <Lightformer
          intensity={1.2}
          position={[-5, 2, 2]}
          scale={[3, 6, 1]}
          rotation-y={Math.PI / 2}
        />
        <Lightformer
          intensity={1.2}
          position={[5, 2, 2]}
          scale={[3, 6, 1]}
          rotation-y={-Math.PI / 2}
        />
        <Lightformer intensity={0.6} position={[0, 1, -6]} scale={[8, 4, 1]} />
      </Environment>
      {children}
      <ContactShadows
        position={[0, -0.01, 0]}
        scale={8}
        blur={2.4}
        opacity={0.35}
        color={toyColor('ink')}
      />
    </Canvas>
  </div>
);
