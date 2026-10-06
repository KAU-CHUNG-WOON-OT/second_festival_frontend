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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button 
        className="absolute top-6 right-6 text-white/80 z-[10000] p-2"
        onClick={onClose}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
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
            className={`max-w-full max-h-full object-contain transition-transform ${isDragging ? '' : 'duration-300'} ease-out will-change-transform shadow-2xl rounded-lg`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* 안내 텍스트 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium pointer-events-none">
        {scale > 1 ? "더블 탭하여 축소" : "더블 탭하여 확대"}
      </div>
    </div>,
    document.body
  );
};

export default MapModal;