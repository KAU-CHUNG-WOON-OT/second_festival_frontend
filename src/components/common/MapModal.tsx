import { useState, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiX } from 'react-icons/fi';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
  // 이미지 대신 코드로 그린 지도(부스 배치도 등)를 띄울 때
  children?: ReactNode;
}

const MapModal = ({ isOpen, onClose, imageSrc, children }: MapModalProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const lastTapTime = useRef(0);
  const tapStart = useRef({ x: 0, y: 0, time: 0, moved: false });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      // 모달 오픈 시 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // 탭은 포인터 이벤트 한 곳에서만 센다 (터치 뒤에 따라오는 click까지 세면 한 번 탭이 두 번 탭이 된다).
  // 누른 채 10px 넘게 움직였으면 끌기라서 탭으로 세지 않는다. 마우스는 왼쪽 버튼만 센다
  const handleTapStart = (e: React.PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return;
    tapStart.current = { x: e.clientX, y: e.clientY, time: Date.now(), moved: false };
  };

  const handleTapMove = (e: React.PointerEvent) => {
    if (!e.isPrimary || tapStart.current.moved) return;
    if (Math.hypot(e.clientX - tapStart.current.x, e.clientY - tapStart.current.y) > 10) {
      tapStart.current.moved = true;
    }
  };

  // 두 번 탭 간격은 첫 탭을 뗀 때부터 두 번째 탭을 누른 때까지로 잰다 (누르고 있던 시간은 빼고)
  const handleDoubleTap = (e: React.PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return;
    if (tapStart.current.moved) {
      lastTapTime.current = 0;
      return;
    }
    if (tapStart.current.time - lastTapTime.current < 300) {
      lastTapTime.current = 0;
      if (scale > 1) handleReset();
      else setScale(2.5);
    } else {
      lastTapTime.current = Date.now();
    }
  };

  const onStart = (e: any) => {
    if (scale === 1) return;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setStartPos({ x: clientX - position.x, y: clientY - position.y });
  };

  const onMove = (e: any) => {
    if (!isDragging || scale === 1) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPosition({ x: clientX - startPos.x, y: clientY - startPos.y });
  };

  const onEnd = () => setIsDragging(false);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/70 backdrop-blur-[8px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button
        type="button"
        aria-label="닫기"
        className="absolute right-6 top-6 z-[10000] flex size-9 items-center justify-center rounded-full border border-ink bg-paper text-ink"
        onClick={onClose}
      >
        <FiX size={18} />
      </button>

      <div
        className="relative w-full max-w-4xl h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden touch-none w-full h-full flex items-center justify-center"
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
          onPointerDown={handleTapStart}
          onPointerMove={handleTapMove}
          onPointerUp={handleDoubleTap}
        >
          {children ? (
            <div
              className={`w-full max-w-[720px] transition-transform ${isDragging ? '' : 'duration-300'} ease-out will-change-transform`}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
            >
              {children}
            </div>
          ) : (
            <img
              ref={imageRef}
              src={imageSrc}
              alt="지도 상세"
              className={`max-w-full max-h-full object-contain transition-transform ${isDragging ? '' : 'duration-300'} ease-out will-change-transform rounded-[8px] border-2 border-ink`}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* 안내 텍스트 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none font-typewriter text-[12px] text-paper/70">
        {scale > 1 ? "더블 탭하여 축소" : "더블 탭하여 확대"}
      </div>
    </div>,
    document.body
  );
};

export default MapModal;