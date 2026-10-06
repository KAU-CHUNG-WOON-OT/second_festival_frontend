import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apinkImage from '@/assets/apink.jpg';
import bandNahImage from '@/assets/band_nah.jpg';
import bibiImage from '@/assets/bibi.jpg';
import carthegardenImage from '@/assets/carthegarden.jpg';
import changmoImage from '@/assets/changmo.jpg';

interface HomeBoardingPassCardProps {
  bottomTo: string;
  topTo: string;
}

const HomeTicketPerforation = () => (
  <div className="absolute inset-x-0 top-[283px] h-[53px]">
    <span className="absolute left-[30px] right-[30px] top-1/2 -translate-y-1/2 border-t-[4px] border-dashed border-white/30" />
  </div>
);

const HomeTicketBottomStrip = ({ to }: { to: string }) => (
  <Link
    to={to}
    aria-label="티켓 예약 화면으로 이동"
    className="absolute left-[32px] right-[30px] top-[363px] flex h-[57px] items-center gap-[12px] border-t border-white/10 pt-px"
  >
    <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-white/85 text-[20px]">
      ✈️
    </div>

    <div className="min-w-0 flex-1">
      <p className="whitespace-nowrap text-[14px] font-bold leading-[20px] tracking-[-0.1504px] text-white">
        팔찌 예약 바로가기
      </p>
      <p className="truncate text-[11px] leading-[16px] text-white/60">
        공연 티켓팅 안내 및 관람 가이드 안내
      </p>
    </div>

    <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#58b5ef]">
      <span className="text-[26px] font-medium leading-none text-white">›</span>
    </div>
  </Link>
);

const HOME_TICKET_NOTCH_MASK = `
  radial-gradient(circle 27px at 0 309.5px, transparent 26.5px, black 27px),
  radial-gradient(circle 27px at 100% 309.5px, transparent 26.5px, black 27px)
`;

const homeTicketShellMaskStyle = {
  WebkitMaskImage: HOME_TICKET_NOTCH_MASK,
  maskImage: HOME_TICKET_NOTCH_MASK,
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
} as const;

const HOME_TICKET_ARTISTS = [
  { image: changmoImage, name: '창모', day: 'Day 2' },
  { image: bibiImage, name: '비비', objectPosition: 'center top', day: 'Day 2' },
  { image: bandNahImage, name: '나상현씨밴드', day: 'Day 2' },
  { image: carthegardenImage, name: '카더가든', day: 'Day 3' },
  { image: apinkImage, name: '에이핑크', day: 'Day 3' },
];

const HomeBoardingPassCard = ({ topTo, bottomTo }: HomeBoardingPassCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const imageChangeInterval = window.setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HOME_TICKET_ARTISTS.length);
    }, 5000);

    return () => window.clearInterval(imageChangeInterval);
  }, []);

  return (
    <section
      aria-label="티켓 미리보기"
      className="relative h-[453px] w-full max-w-[351px]"
      style={{ filter: 'drop-shadow(0 22px 40px rgba(47,79,112,0.26))' }}
    >
      <div
        className="relative size-full overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#67b5e8_0%,#4ea9e6_100%)]"
        style={homeTicketShellMaskStyle}
      >
        <Link
          to={topTo}
          aria-label="타임테이블 화면으로 이동"
          className="absolute inset-x-[10px] top-[18px] h-[250px] overflow-hidden rounded-[20px] bg-black"
        >
          {HOME_TICKET_ARTISTS.map((artist, index) => (
            <img
              key={artist.name}
              src={artist.image}
              alt=""
              className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{ objectPosition: artist.objectPosition ?? 'center' }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/40" />

          {HOME_TICKET_ARTISTS.map((artist, index) => (
            <p
              key={artist.name}
              className={`absolute left-[18px] top-[16px] text-[24px] font-medium leading-[1] text-white/95 transition-opacity duration-700 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              {artist.name}
            </p>
          ))}

          {HOME_TICKET_ARTISTS.map((artist, index) => (
            <p
              key={`day-${artist.name}`}
              className={`absolute bottom-[20px] right-[18px] text-[18px] font-bold leading-[1] text-white/90 transition-opacity duration-700 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              {artist.day}
            </p>
          ))}

          <div className="absolute bottom-[15px] left-1/2 flex -translate-x-1/2 items-center gap-[6px]">
            {HOME_TICKET_ARTISTS.map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`rounded-full transition-all duration-300 ${dotIndex === currentImageIndex ? 'size-[6px] bg-white' : 'size-[5px] bg-white/55'}`}
              />
            ))}
          </div>
        </Link>

        <HomeTicketPerforation />
        <HomeTicketBottomStrip to={bottomTo} />
      </div>
    </section>
  );
};

export default HomeBoardingPassCard;
