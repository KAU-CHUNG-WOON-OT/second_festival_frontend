import { Link } from 'react-router-dom';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import { GAMES } from '../components/game/gameList';
import { useLanguage } from '../contexts/LanguageContext';

const GamePage = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader />
      <RetroPageTitle title={isEng ? 'Games' : '게임'} caption="SIDE B · PARTY GAMES" />
      <p className="pt-3 font-body-kr text-[14px] leading-5 opacity-70">
        {isEng ? 'All games are played by passing one phone around.' : '모든 게임은 폰 하나로 돌려가며 해요.'}
      </p>

      <div className="flex flex-col gap-4 pt-6">
        {GAMES.map((game, index) => (
          <Link
            key={game.id}
            to={`/game/${game.id}`}
            className={`flex items-center gap-4 rounded-[16px] border-2 border-ink p-5 drop-shadow-[5px_5px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] ${game.colorClass}`}
          >
            <span className="rounded-[4px] border border-current px-[6px] font-typewriter text-[12px] leading-4">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[24px] leading-[30px]">{isEng ? game.title_en : game.title}</p>
              <p className="pt-1 font-body-kr text-[14px] leading-5 opacity-80">{isEng ? game.sub_en : game.sub}</p>
            </div>
            <span className="font-typewriter text-[12px] leading-4 opacity-70">▶</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
