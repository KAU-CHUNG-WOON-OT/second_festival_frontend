import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

const MapModal = ({ isOpen, onClose, imageSrc }: MapModalProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [lastTapTime, setLastTapTime] = useState(0);
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

  const handleDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      if (scale > 1) handleReset();
      else setScale(2.5);
    }
    setLastTapTime(currentTime);
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
        className="absolute right-6 top-6 z-[10000] flex size-9 items-center justify-center rounded-full border border-ink bg-paper font-body-kr text-[16px] text-ink"
        onClick={onClose}
      >
        ✕
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
          onTouchEnd={(e) => { onEnd(); handleDoubleTap(e); }}
          onClick={handleDoubleTap}
        >
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