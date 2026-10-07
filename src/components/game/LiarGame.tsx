import { useState } from 'react';
import CategoryList from '@/components/common/CategoryList';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  LIAR_CATEGORIES,
  LIAR_MAX_PLAYERS,
  LIAR_MIN_PLAYERS,
  createLiarRound,
  type LiarRound,
} from '@/data/liarGameData';
import PlayerCountStepper from './PlayerCountStepper';
import { GAME_CARD as CARD, PRIMARY_BUTTON, SECONDARY_BUTTON } from './gameStyles';

type Phase = 'setup' | 'reveal' | 'discuss' | 'result';

const playerLabel = (index: number) => `PLAYER ${String(index + 1).padStart(2, '0')}`;

const LiarGame = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const [playerCount, setPlayerCount] = useState(4);
  const [categoryId, setCategoryId] = useState(LIAR_CATEGORIES[0].id);
  const [phase, setPhase] = useState<Phase>('setup');
  const [round, setRound] = useState<LiarRound | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const categoryName = (id: string) => {
    const category = LIAR_CATEGORIES.find((c) => c.id === id)!;
    return isEng ? category.name_en : category.name;
  };

  const startRound = () => {
    const category = LIAR_CATEGORIES.find((c) => c.id === categoryId)!;
    setRound(createLiarRound(category, playerCount));
    setCurrentPlayer(0);
    setIsRevealed(false);
    setPhase('reveal');
  };

  const handleNextPlayer = () => {
    setIsRevealed(false);
    if (currentPlayer + 1 < playerCount) {
      setCurrentPlayer(currentPlayer + 1);
    } else {
      setPhase('discuss');
    }
  };

  if (phase === 'setup' || !round) {
    return (
      <div className="flex flex-col gap-6">
        <section className={CARD}>
          <p className="font-typewriter text-[12px] leading-4 opacity-60">HOW TO PLAY</p>
          <ol className="list-decimal pt-3 pl-5 font-body-kr text-[14px] leading-6 opacity-80">
            {isEng ? (
              <>
                <li>Pass one phone around and check your word in turn.</li>
                <li>Only the liar doesn't know the word — they just see the category.</li>
                <li>Take turns describing the word in one sentence.</li>
                <li>Vote for the liar. If caught, the liar can still win by guessing the word.</li>
              </>
            ) : (
              <>
                <li>폰 하나를 돌려가며 차례로 제시어를 확인해요.</li>
                <li>라이어 한 명만 제시어를 모르고 주제만 알아요.</li>
                <li>돌아가며 제시어를 한 문장으로 설명해요.</li>
                <li>라이어를 지목해요. 걸려도 제시어를 맞히면 라이어 승리!</li>
              </>
            )}
          </ol>
        </section>

        <PlayerCountStepper
          value={playerCount}
          min={LIAR_MIN_PLAYERS}
          max={LIAR_MAX_PLAYERS}
          onChange={setPlayerCount}
        />

        <section className="flex flex-col gap-3">
          <p className="font-typewriter text-[12px] leading-4 opacity-60">CATEGORY</p>
          <CategoryList
            categories={LIAR_CATEGORIES.map((c) => categoryName(c.id))}
            selectedCategory={categoryName(categoryId)}
            onSelect={(label) => setCategoryId(LIAR_CATEGORIES.find((c) => categoryName(c.id) === label)!.id)}
          />
        </section>

        <button type="button" onClick={startRound} className={PRIMARY_BUTTON}>
          {isEng ? 'Start Game' : '게임 시작'}
        </button>
      </div>
    );
  }

  const roundCategoryName = isEng ? round.category.name_en : round.category.name;
  const roundWord = isEng ? round.word.en : round.word.ko;

  if (phase === 'reveal') {
    const isLiar = currentPlayer === round.liarIndex;

    return (
      <div className="flex flex-col gap-6">
        <p className="font-typewriter text-[12px] leading-4 tracking-[3.6px]">
          {`${currentPlayer + 1} / ${playerCount}`}
        </p>

        {isRevealed ? (
          <section
            className={`flex min-h-72 flex-col items-center justify-center rounded-[16px] border-2 border-ink p-5 text-center ${
              isLiar
                ? 'bg-ink text-paper drop-shadow-[5px_5px_0px_var(--color-mustard)]'
                : 'bg-paper drop-shadow-[5px_5px_0px_var(--color-ink)]'
            }`}
          >
            <p className="font-typewriter text-[12px] leading-4 opacity-60">{playerLabel(currentPlayer)}</p>
            <p className="pt-2 font-body-kr text-[14px] leading-5 opacity-70">
              {isEng ? `Category · ${roundCategoryName}` : `주제 · ${roundCategoryName}`}
            </p>
            <p className={`pt-4 font-display text-[44px] leading-[52px] ${isLiar ? 'text-mustard' : 'text-rust'}`}>
              {isLiar ? (isEng ? 'You are the LIAR' : '당신은 라이어!') : roundWord}
            </p>
            {isLiar && (
              <p className="pt-3 font-body-kr text-[14px] leading-5 opacity-80">
                {isEng ? "Blend in and don't get caught." : '들키지 않게 자연스럽게 섞여 보세요.'}
              </p>
            )}
          </section>
        ) : (
          <button
            type="button"
            onClick={() => setIsRevealed(true)}
            className="flex min-h-72 flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-ink bg-mustard p-5 text-center drop-shadow-[5px_5px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
          >
            <p className="font-typewriter text-[12px] leading-4 opacity-60">{playerLabel(currentPlayer)}</p>
            <p className="pt-3 font-display text-[32px] leading-10">
              {isEng ? `Player ${currentPlayer + 1}` : `${currentPlayer + 1}번 플레이어`}
            </p>
            <p className="pt-3 font-body-kr text-[14px] leading-5 opacity-80">
              {isEng ? 'Make sure no one is looking, then tap.' : '다른 사람이 안 보게 하고 탭하세요.'}
            </p>
          </button>
        )}

        <button type="button" disabled={!isRevealed} onClick={handleNextPlayer} className={PRIMARY_BUTTON}>
          {currentPlayer + 1 < playerCount
            ? isEng
              ? 'Hide & Pass'
              : '가리고 다음 사람에게'
            : isEng
              ? 'Start Discussion'
              : '토론 시작'}
        </button>
      </div>
    );
  }

  if (phase === 'discuss') {
    return (
      <div className="flex flex-col gap-6">
        <section className={`${CARD} text-center`}>
          <p className="font-typewriter text-[12px] leading-4 opacity-60">CATEGORY</p>
          <p className="pt-2 font-display text-[36px] leading-[44px]">{roundCategoryName}</p>
          <div className="mt-5 border-t border-dashed border-ink/50 pt-5">
            <p className="font-typewriter text-[12px] leading-4 opacity-60">FIRST SPEAKER</p>
            <p className="pt-2 font-display text-[24px] leading-8 text-tape-blue">
              {isEng ? `Player ${round.firstSpeakerIndex + 1}` : `${round.firstSpeakerIndex + 1}번 플레이어`}
            </p>
          </div>
        </section>
        <p className="font-body-kr text-[14px] leading-5 opacity-70">
          {isEng
            ? 'Describe the word in one sentence each, then point at the liar together.'
            : '한 명씩 제시어를 한 문장으로 설명한 뒤, 다 함께 라이어를 지목하세요.'}
        </p>
        <button type="button" onClick={() => setPhase('result')} className={PRIMARY_BUTTON}>
          {isEng ? 'Reveal the Liar' : '라이어 공개'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[16px] border-2 border-ink bg-ink p-5 text-center text-paper drop-shadow-[5px_5px_0px_var(--color-mustard)]">
        <p className="font-typewriter text-[12px] leading-4 opacity-60">THE LIAR WAS</p>
        <p className="pt-2 font-display text-[40px] leading-[48px] text-mustard">
          {isEng ? `Player ${round.liarIndex + 1}` : `${round.liarIndex + 1}번 플레이어`}
        </p>
        <div className="mt-5 border-t border-dashed border-paper/50 pt-5">
          <p className="font-typewriter text-[12px] leading-4 opacity-60">THE WORD WAS</p>
          <p className="pt-2 font-display text-[28px] leading-9">{roundWord}</p>
        </div>
      </section>
      <button type="button" onClick={startRound} className={PRIMARY_BUTTON}>
        {isEng ? 'Play Again' : '한 판 더'}
      </button>
      <button type="button" onClick={() => setPhase('setup')} className={SECONDARY_BUTTON}>
        {isEng ? 'Change Settings' : '설정 바꾸기'}
      </button>
    </div>
  );
};

export default LiarGame;
