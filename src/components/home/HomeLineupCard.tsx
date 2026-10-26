import { useEffect, useState } from 'react';
import minKyunghoonImage from '../../assets/lineup/min_kyunghoon.jpg';
import permmImage from '../../assets/lineup/permm.jpg';
import reelIcon from '../../assets/home_reel.svg';
import { useLanguage } from '../../contexts/LanguageContext';

// 공연 순서대로 넘어간다
const ARTISTS = [
  { name: '민경훈', name_en: 'Min Kyung Hoon', image: minKyunghoonImage },
  { name: 'PERMM', name_en: 'PERMM', image: permmImage },
];
const SLIDE_INTERVAL_MS = 4000;

const HomeLineupCard = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % ARTISTS.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const reel = (
    <img src={reelIcon} alt="" width={48} height={48} className="shrink-0 rotate-[-44.54deg]" />
  );

  return (
    <section className="rounded-[16px] border border-ink bg-mustard p-4 text-ink shadow-[6px_6px_0px_0px_var(--color-ink)]">
      <div className="flex justify-between font-typewriter text-[11px] font-bold leading-[16.5px]">
        <span>Artist Line-up</span>
        <span>C-90 · HI-FI</span>
      </div>

      {/* 사진을 겹쳐 두고 보이는 한 장만 바꿔 서서히 넘어가게 한다 */}
      <div className="relative mt-3 aspect-[4/3] overflow-clip rounded-[8px] border border-ink bg-ink">
        {ARTISTS.map((artist, index) => {
          const name = isEng ? artist.name_en : artist.name;
          return (
            <div
              key={artist.name}
              aria-hidden={index !== current}
              className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
                index === current ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* 사진은 얼굴이 가운데 오게 4:3으로 미리 잘라 둠 */}
              <img src={artist.image} alt={name} className="size-full object-cover" />
              <span className="absolute bottom-3 right-4 break-keep text-right font-display text-[32px] leading-10 text-paper">
                {name}
              </span>
            </div>
          );
        })}
        <span className="absolute left-4 top-3 font-typewriter text-[14px] leading-5 text-paper">
          ● REC {String(current + 1).padStart(2, '0')}/{String(ARTISTS.length).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-full border border-ink bg-cream px-4 py-2">
        {reel}
        <span className="flex gap-2" aria-hidden>
          {ARTISTS.map((artist, index) => (
            <span
              key={artist.name}
              className={`size-2 rounded-full border border-ink ${index === current ? 'bg-ink' : 'bg-cream'}`}
            />
          ))}
        </span>
        {reel}
      </div>
    </section>
  );
};

export default HomeLineupCard;
