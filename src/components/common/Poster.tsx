import { useRef, useState } from "react";
import logoImg from "../../assets/logo.svg";

export interface PosterProps {
  images: string[];
  name: string;
}

interface PosterImageProps {
  src: string;
  alt: string;
}

const PosterImage = ({ src, alt }: PosterImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        aspectRatio: aspectRatio ?? 3 / 4,
        transition: 'aspect-ratio 0.3s ease',
      }}
    >
      <img
        src={src}
        alt={alt}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
          }
          setLoaded(true);
        }}
        onError={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 100%)',
            border: '1px solid rgba(255,255,255,0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <img src={logoImg} alt="" className="w-16 h-16 opacity-25" />
          </div>
        </div>
      )}
    </div>
  );
};

const Poster = ({ images, name }: PosterProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 빈 배열 — 로고 placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 rounded-2xl bg-white/20 flex items-center justify-center">
        <img src={logoImg} alt="기본 로고" className="w-20 h-20 opacity-20" />
      </div>
    );
  }

  // 한 장 — 슬라이더 없이 단일 이미지
  if (images.length === 1) {
    return <PosterImage src={images[0]} alt={`${name} 포스터`} />;
  }

  // 여러 장 — 슬라이더
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const newIndex = Math.round(scrollLeft / clientWidth);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl"
      >
        {images.map((src, idx) => (
          <div key={idx} className="flex-shrink-0 w-full snap-start">
            <PosterImage src={src} alt={`${name} 포스터 ${idx + 1}`} />
          </div>
        ))}
      </div>

      {/* 인디케이터 점 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Poster;
