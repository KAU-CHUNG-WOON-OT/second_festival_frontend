import { useEffect, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, type Group } from 'three';

// 이만큼(px) 넘게 끌면 탭이 아니라 돌리기로 본다
export const DRAG_THRESHOLD_PX = 8;
const RADIANS_PER_PX = 0.012;

// 캔버스를 좌우로 끌어 group을 y축으로 돌린다. 손을 떼면 관성으로 조금 더 돈다.
export const useDragSpin = (ref: RefObject<Group | null>, limit = Infinity) => {
  const gl = useThree((state) => state.gl);
  const spin = useRef({ angle: 0, velocity: 0, dragging: false, lastX: 0, lastTime: 0 });

  useEffect(() => {
    const s = spin.current;
    const canvas = gl.domElement;
    const handleDown = (event: PointerEvent) => {
      s.dragging = true;
      s.lastX = event.clientX;
      s.lastTime = event.timeStamp;
      s.velocity = 0;
    };
    const handleMove = (event: PointerEvent) => {
      if (!s.dragging) return;
      const delta = (event.clientX - s.lastX) * RADIANS_PER_PX;
      const dt = Math.max((event.timeStamp - s.lastTime) / 1000, 1 / 120);
      s.angle = MathUtils.clamp(s.angle + delta, -limit, limit);
      s.velocity = delta / dt;
      s.lastX = event.clientX;
      s.lastTime = event.timeStamp;
    };
    const handleUp = () => {
      s.dragging = false;
    };
    canvas.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      canvas.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [gl, limit]);

  useFrame((_, delta) => {
    const s = spin.current;
    if (!s.dragging) {
      const next = MathUtils.clamp(s.angle + s.velocity * delta, -limit, limit);
      if (next !== s.angle + s.velocity * delta) s.velocity = 0;
      s.angle = next;
      s.velocity *= Math.exp(-delta * 4);
    }
    if (ref.current) ref.current.rotation.y = s.angle;
  });
};
