import { Link } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import { GAMES } from '../components/game/gameList';
import { useLanguage } from '../contexts/LanguageContext';

// 번호는 특별 게임을 뺀 순서 (각 게임 부제의 TRACK B-0n과 맞춤)
const REGULAR_GAMES = GAMES.filter((game) => !game.special);

const GamePage = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader showMenu />
      <RetroPageTitle title={isEng ? 'Games' : '게임'} caption="PARTY GAMES" />
      <p className="pt-3 font-body-kr text-[14px] leading-5 text-paper/80">
        {isEng ? 'All games are played by passing one phone around.' : '모든 게임은 폰 하나로 돌려 가며 해요.'}
      </p>

      <div className="flex flex-col gap-4 pt-6">
        {GAMES.map((game) => (
          <Link
            key={game.id}
            to={`/game/${game.id}`}
            className={`flex items-center gap-4 rounded-[16px] border-2 border-ink p-5 shadow-[5px_5px_0px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] ${game.colorClass}`}
          >
            <span className="rounded-[4px] border border-current px-[6px] font-typewriter text-[12px] leading-4">
              {game.special ? 'SPECIAL' : String(REGULAR_GAMES.indexOf(game) + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[24px] leading-[30px]">{isEng ? game.title_en : game.title}</p>
              <p className="pt-1 font-body-kr text-[14px] leading-5 opacity-80">{isEng ? game.sub_en : game.sub}</p>
            </div>
            <FiPlay size={12} fill="currentColor" aria-hidden className="shrink-0 opacity-70" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
