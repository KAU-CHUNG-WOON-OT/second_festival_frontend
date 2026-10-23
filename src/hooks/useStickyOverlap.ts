import { useEffect, useState, type RefObject } from 'react';
import { STICKY_BAND_TOP } from '../components/common/retroLayout';

// 상단바 아래에 붙는 띠가 아래 내용 위에 겹쳐 있는지 (붙어 있거나, 붙을 수 있는 범위 끝에서 내용과 함께 올라가는 중).
// 스크롤할 때마다 띠의 화면 위치를 CSS 변수 --band-top으로 넘겨, 뒤에 까는 하늘·별을 어느 위치에서든 뒤 하늘과 맞춘다.
// 매 프레임 다시 그리지 않도록 상태는 겹침 여부만 둔다. active: 띠가 화면에 그려져 있을 때 true
export const useStickyOverlap = (ref: RefObject<HTMLElement | null>, active = true) => {
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const band = ref.current;
    const container = band?.closest('.overflow-y-auto');
    if (!active || !band || !container) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = band.getBoundingClientRect().top;
      band.style.setProperty('--band-top', `${top}px`);
      setIsOver(container.scrollTop > 0 && top < STICKY_BAND_TOP + 0.5);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, active]);

  return isOver;
};
