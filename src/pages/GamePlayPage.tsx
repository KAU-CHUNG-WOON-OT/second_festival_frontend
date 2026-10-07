import { Navigate, useParams } from 'react-router-dom';
import RetroPageHeader from '../components/common/RetroPageHeader';
import RetroPageTitle from '../components/common/RetroPageTitle';
import { GAMES } from '../components/game/gameList';
import { useLanguage } from '../contexts/LanguageContext';

const GamePlayPage = () => {
  const { gameId } = useParams();
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const game = GAMES.find((g) => g.id === gameId);

  if (!game) return <Navigate to="/game" replace />;

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader />
      <RetroPageTitle title={isEng ? game.title_en : game.title} caption={game.caption} />
      <div className="pt-6">
        <game.Component />
      </div>
    </div>
  );
};

export default GamePlayPage;
