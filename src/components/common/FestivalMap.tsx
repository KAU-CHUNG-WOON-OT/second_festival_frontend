import { useState, useRef } from "react";

interface MapImage {
  src: string;
  label: string;
}

interface FestivalMapProps {
  images: MapImage[];
  onClick: (imageSrc: string) => void;
}

const FestivalMap = ({ images, onClick }: FestivalMapProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // 특정 인덱스로 부드럽게 이동
  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: width * index, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  const goPrev = () => { if (currentIndex > 0) scrollTo(currentIndex - 1); };
  const goNext = () => { if (currentIndex < images.length - 1) scrollTo(currentIndex + 1); };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent, imageSrc: string) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > 50 && absDx > absDy) {
      // 스와이프 감지 시 페이지 이동
      if (dx < 0) goNext();
      else goPrev();
    } else if (absDx < 10 && absDy < 10) {
      // 단순 탭일 경우에만 상세 보기(모달) 오픈
      onClick(imageSrc);
    }
  };

  // 직접 스크롤했을 때도 인덱스 동기화 (선택 사항)
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== currentIndex) setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="bg-white/35 backdrop-blur-2xl rounded-[24px] p-4 shadow-[0_2px_20px_rgba(0,0,0,0.04)] mb-5 border border-white/40 group">
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl"
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="flex-none w-full snap-center cursor-pointer active:opacity-95 transition-opacity select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, img.src)}
              onClick={() => onClick(img.src)}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-auto object-contain rounded-2xl pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* 이전 버튼 */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-10 rounded-xl bg-white/70 backdrop-blur-md shadow-sm flex items-center justify-center text-gray-600 active:scale-90 transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* 다음 버튼 */}
        {currentIndex < images.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-10 rounded-xl bg-white/70 backdrop-blur-md shadow-sm flex items-center justify-center text-gray-600 active:scale-90 transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* 개선된 인디케이터 */}
      {images.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-4">
          {images.map((_, idx) => (
            <div
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? "w-6 bg-gray-600" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FestivalMap;