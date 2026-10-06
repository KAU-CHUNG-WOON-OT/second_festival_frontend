import { useRef, useState } from 'react';
import logoImg from '../../assets/cheongun_logo.svg';
import RetroDialog from './RetroDialog';

export interface PosterProps {
  images: string[];
  name: string;
  // 확대 모달 제목 (예: '부스 포스터')
  zoomTitle?: string;
}

interface PosterImageProps {
  src: string;
  alt: string;
}

const PosterImage = ({ src, alt }: PosterImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  return (
    <div
      className="relative w-full overflow-hidden bg-ink"
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
        onError={() => setFailed(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {(!loaded || failed) && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-paper ${failed ? '' : 'animate-pulse'}`}
        >
          <img src={logoImg} alt="" width={68} height={48} className="opacity-25" />
        </div>
      )}
    </div>
  );
};

const FRAME_CLASS =
  'w-full overflow-clip rounded-[16px] border-2 border-ink shadow-[6px_6px_0px_0px_var(--color-ink)]';

const Poster = ({ images, name, zoomTitle = '포스터' }: PosterProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 빈 배열 — 로고 placeholder
  if (!images || images.length === 0) {
    return (
      <div className={`${FRAME_CLASS} flex h-48 items-center justify-center bg-paper`}>
        <img src={logoImg} alt="기본 로고" width={68} height={48} className="opacity-25" />
      </div>
    );
  }

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const newIndex = Math.round(scrollLeft / clientWidth);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  return (
    <>
      <div className={`${FRAME_CLASS} relative`}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setZoomSrc(src)}
              aria-label={`${zoomTitle} 크게 보기`}
              className="w-full flex-shrink-0 snap-start"
            >
              <PosterImage
                src={src}
                alt={`${name} 포스터${images.length > 1 ? ` ${idx + 1}` : ''}`}
              />
            </button>
          ))}
        </div>

        {/* 인디케이터 점 */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full border border-ink bg-paper px-2 py-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-5 bg-ink' : 'w-1.5 bg-ink/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {zoomSrc && (
        <RetroDialog title={zoomTitle} onClose={() => setZoomSrc(null)}>
          <img src={zoomSrc} alt={`${name} 포스터`} className="w-full rounded-[8px]" />
        </RetroDialog>
      )}
    </>
  );
};

export default Poster;
