import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cheongunLogo from '@/assets/cheongun_logo.svg';
import reelIcon from '@/assets/cassette_reel.svg';
import kakaoIcon from '@/assets/kakao_icon.svg';
import youtubeIcon from '@/assets/footer_youtube.svg';
import instagramIcon from '@/assets/footer_instagram.svg';
import { useTranslation } from 'react-i18next';
import { markOnboardingSeenInCurrentTab } from '../lib/onboardingSession';
import { track } from '@/lib/mixpanel';
import { getKakaoLoginUrl } from '@/lib/kakaoLogin';
import { saveLoginReturnPath } from '@/lib/loginReturn';
import SkyDots from '@/components/common/SkyDots';
import { FestivalPill } from '@/components/common/RetroPageTitle';

// 로그인 버튼: 다른 화면의 큰 버튼(gameStyles)과 같은 알약 모양
const LOGIN_BUTTON =
  'flex h-14 w-full items-center justify-center gap-3 rounded-full border-2 border-ink font-body-kr text-[16px] font-bold leading-6 shadow-[4px_4px_0px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]';
// 안내 창 안의 작은 버튼
const NOTICE_BUTTON =
  'h-12 flex-1 rounded-full border-2 border-ink font-body-kr text-[15px] font-bold shadow-[3px_3px_0px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isGuestNoticeOpen, setIsGuestNoticeOpen] = useState(false);
  const [guestNoticeStep, setGuestNoticeStep] = useState<1 | 2>(1);

  const completeOnboarding = useCallback(() => {
    track('onboarding_guest_login_clicked');
    markOnboardingSeenInCurrentTab();
    navigate('/home', { replace: true });
  }, [navigate]);

  const handleKakaoLogin = useCallback(() => {
    const loginUrl = getKakaoLoginUrl();
    if (!loginUrl) return;
    track('onboarding_kakao_login_clicked');
    markOnboardingSeenInCurrentTab();
    // 온보딩 화면 자체로는 돌아오지 않으므로 예전에 넣어 둔 주소만 지워진다 (로그인하면 지금처럼 홈으로)
    saveLoginReturnPath();
    window.location.href = loginUrl;
  }, []);

  useEffect(() => {
    if (!isGuestNoticeOpen) return;

    const handler = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setIsGuestNoticeOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isGuestNoticeOpen]);

  const reel = <img src={reelIcon} alt="" width={44} height={44} className="shrink-0 rotate-[7.27deg]" />;

  return (
    // 다른 화면과 같은 노을 하늘(Layout이 깔아 줌) + 별 위에 카세트와 로그인 버튼
    <section className="relative flex h-[100dvh] flex-col overflow-hidden text-ink" aria-label="로그인 화면">
      <div className="relative flex flex-1 flex-col overflow-clip">
        <SkyDots night />

        <div className="relative flex items-center justify-between px-5 pt-5">
          <FestivalPill />
          <img src={cheongunLogo} alt="청운" width={46} height={32} className="brightness-0 invert" />
        </div>

        <div className="relative flex flex-1 items-center justify-center px-5">
          <div className="w-full max-w-[363px] -rotate-1">
            <div className="rounded-[26px] border-2 border-ink bg-rust p-3 shadow-[8px_8px_0px_0px_var(--color-ink)]">
              <div className="rounded-[12px] border-2 border-ink bg-cream p-4">
                {/* 좁은 폰(390px 미만)에서는 글자 간격을 줄여 두 줄로 나뉘지 않게 */}
                <p className="font-typewriter text-[11px] font-bold leading-[16.5px] tracking-[2.2px] text-rust min-[390px]:tracking-[3.3px]">
                  KOREA AEROSPACE UNIVERSITY
                </p>
                <h1 className="pt-1 font-condensed text-[64px] font-black leading-[61px]">활주로</h1>
                <div className="mt-3 h-[10px] w-full rounded-full bg-retro-stripe" />
              </div>
              <div className="mt-3 flex items-center justify-between rounded-full border-2 border-ink bg-ink px-4 py-2">
                {reel}
                {reel}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-8">
              <button
                type="button"
                onClick={() => {
                  setGuestNoticeStep(1);
                  setIsGuestNoticeOpen(true);
                }}
                className={`${LOGIN_BUTTON} bg-[#fee500] text-ink`}
              >
                <img src={kakaoIcon} alt="" width={20} height={19} />
                카카오톡 로그인
              </button>
              <button
                type="button"
                onClick={() => {
                  setGuestNoticeStep(2);
                  setIsGuestNoticeOpen(true);
                }}
                className={`${LOGIN_BUTTON} bg-paper text-ink`}
              >
                비회원으로 접속하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-2 w-full shrink-0 bg-retro-stripe" />
      <footer className="flex shrink-0 flex-col items-center gap-4 bg-paper px-5 py-8 text-center">
        <p className="font-body-kr text-[14px] font-semibold leading-5">{t('footer.organization')}</p>
        <div className="flex gap-3">
          <a
            href="https://www.youtube.com/@kau_students"
            target="_blank"
            rel="noreferrer"
            aria-label="유튜브"
            className="flex size-11 items-center justify-center rounded-[12px] border border-ink bg-cream"
          >
            <img src={youtubeIcon} alt="" width={18} height={13} />
          </a>
          <a
            href="https://www.instagram.com/kau_students?igsh=MXRpNmF0MzA3MHZudA=="
            target="_blank"
            rel="noreferrer"
            aria-label="인스타그램"
            className="flex size-11 items-center justify-center rounded-[12px] border border-ink bg-cream"
          >
            <img src={instagramIcon} alt="" width={18} height={18} />
          </a>
        </div>
        <p className="font-typewriter text-[12px] leading-4 opacity-60">{t('footer.copyright')}</p>
      </footer>

      {isGuestNoticeOpen && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-ink/50 px-4 onboarding-backdrop-in"
          role="presentation"
          onClick={() => setIsGuestNoticeOpen(false)}
        >
          <div
            className="relative w-full max-w-[340px] rounded-[24px] border-2 border-ink bg-paper px-5 pb-5 pt-5 shadow-[6px_6px_0px_0px_var(--color-mustard)] onboarding-modal-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-notice-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-center font-typewriter text-[12px] leading-4 tracking-[3.6px] text-rust">NOTICE</p>
            <p id="guest-notice-title" className="pt-2 text-center font-display text-[28px] leading-none">
              주의
            </p>

            {guestNoticeStep === 1 ? (
              <>
                <p className="mt-4 text-center font-body-kr text-[15px] leading-[1.45]">
                  한국항공대학교 재학생들을 위한 서비스입니다.
                  <br />
                  졸업생 및 외부인은 비회원으로 접속해 주세요.
                </p>

                <div className="mt-5 flex items-center justify-between gap-[10px]">
                  <button
                    type="button"
                    onClick={() => setGuestNoticeStep(2)}
                    className={`${NOTICE_BUTTON} bg-cream`}
                  >
                    비회원으로 계속
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsGuestNoticeOpen(false);
                      handleKakaoLogin();
                    }}
                    className={`${NOTICE_BUTTON} bg-[#fee500]`}
                  >
                    카카오로 가입
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-4 text-center font-body-kr text-[15px] leading-[1.45]">
                  비회원으로 접속하면
                  <br />
                  <span className="font-bold">게임 행사</span>에 참여할 수 없습니다.
                </p>

                <button
                  type="button"
                  onClick={completeOnboarding}
                  className={`${NOTICE_BUTTON} mt-5 w-full bg-ink text-paper`}
                >
                  접속하기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default OnboardingPage;
