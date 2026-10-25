import { useLanguage } from '@/contexts/LanguageContext';
import { getKakaoLoginUrl } from '@/lib/kakaoLogin';
import { track } from '@/lib/mixpanel';
import kakaoIcon from '@/assets/kakao_icon.svg';
import { GAME_CARD } from '../gameStyles';
import { HANGMENTLE_RANKING_SIZE } from '@/data/hangmentleEvent';

interface KakaoLoginButtonProps {
  // 어디서 눌렀는지 (mixpanel)
  source: 'hub' | 'round';
  round?: number;
}

export const KakaoLoginButton = ({ source, round }: KakaoLoginButtonProps) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  const handleLogin = () => {
    const loginUrl = getKakaoLoginUrl();
    if (!loginUrl) return;
    track('hangmentle_kakao_login_clicked', { source, round });
    window.location.href = loginUrl;
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-[#fee500] font-body-kr text-[15px] font-bold text-ink drop-shadow-[3px_3px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
    >
      <img src={kakaoIcon} alt="" width={18} height={17} />
      {isEng ? 'Log in with Kakao' : '카카오로 로그인하기'}
    </button>
  );
};

// 비회원이 회차 화면에서 보는 로그인 안내
export const LoginCard = ({ round }: { round: number }) => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';

  return (
    <section className={`${GAME_CARD} text-center`}>
      <p className="font-display text-[20px] leading-7">
        {isEng ? 'Log in to join the event' : '로그인하면 참여할 수 있어요'}
      </p>
      <p className="pb-4 pt-2 font-body-kr text-[14px] leading-5 opacity-70">
        {isEng
          ? `Guests can only see the hints and the ranking. The first ${HANGMENTLE_RANKING_SIZE} to solve it make the ranking.`
          : `비회원은 힌트와 랭킹만 볼 수 있어요. 먼저 맞힌 ${HANGMENTLE_RANKING_SIZE}명이 랭킹에 올라요.`}
      </p>
      <KakaoLoginButton source="round" round={round} />
    </section>
  );
};
