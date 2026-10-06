import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/home_hero.png';
import cheongunLogo from '@/assets/cheongun_logo.svg';
import reelIcon from '@/assets/cassette_reel.svg';
import kakaoIcon from '@/assets/kakao_icon.svg';
import youtubeIcon from '@/assets/footer_youtube.svg';
import instagramIcon from '@/assets/footer_instagram.svg';
import { useTranslation } from 'react-i18next';
import { markOnboardingSeenInCurrentTab } from '../lib/onboardingSession';
import { track } from '@/lib/mixpanel';

const STRIPE =
  'bg-[linear-gradient(90deg,var(--color-rust)_0%,var(--color-rust)_33.3%,var(--color-mustard)_33.3%,var(--color-mustard)_66.6%,var(--color-sky-light)_66.6%,var(--color-sky-light)_100%)]';

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
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (!apiBase) {
      console.error('VITE_API_BASE_URL is not configured.');
      return;
    }
    track('onboarding_kakao_login_clicked');
    markOnboardingSeenInCurrentTab();
    const trimmed = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
    window.location.href = `${trimmed}/oauth2/authorization/kakao`;
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
    <section className="relative flex h-[100dvh] flex-col overflow-hidden bg-ink text-ink" aria-label="로그인 화면">
      <div className="relative flex flex-1 flex-col overflow-clip">
        <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/0 to-ink/80" />

        <div className="relative flex items-center justify-between px-5 pt-5">
          <span className="font-typewriter text-[12px] leading-4 tracking-[3.6px] text-paper">SIDE A</span>
          <img src={cheongunLogo} alt="청운" width={51} height={36} />
        </div>

        <div className="relative flex flex-1 items-center justify-center px-5">
          <div className="w-full max-w-[363px] -rotate-1">
            <div className="rounded-[26px] border-2 border-ink bg-rust p-3 drop-shadow-[8px_8px_0px_var(--color-ink)]">
              <div className="rounded-[12px] border-2 border-ink bg-cream p-4">
                <p className="font-typewriter text-[11px] font-bold leading-[16.5px] tracking-[3.3px] text-rust">
                  KOREA AEROSPACE UNIVERSITY
                </p>
                <h1 className="pt-1 font-condensed text-[64px] font-black leading-[61px]">활주로</h1>
                <div className={`mt-3 h-[10px] w-full rounded-full ${STRIPE}`} />
                <p className="pt-3 font-display text-[20px] leading-7">가을에 재생 버튼을 누르다</p>
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
                className="flex items-center justify-center gap-3 rounded-[16px] border-2 border-ink bg-[#fee500] px-6 py-[14px] font-body-kr text-[16px] font-bold leading-6 drop-shadow-[4px_4px_0px_var(--color-ink)]"
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
                className="rounded-[16px] border-2 border-ink bg-[#2750b9] px-6 py-[14px] font-body-kr text-[16px] font-bold leading-6 text-paper drop-shadow-[4px_4px_0px_var(--color-ink)]"
              >
                비회원으로 접속하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`h-2 w-full shrink-0 ${STRIPE}`} />
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
            className="relative w-full max-w-[340px] rounded-[20px] border-2 border-ink bg-paper px-5 pb-5 pt-6 drop-shadow-[6px_6px_0px_var(--color-ink)] onboarding-modal-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-notice-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p id="guest-notice-title" className="text-center font-display text-[28px] leading-none">
              주의
            </p>

            {guestNoticeStep === 1 ? (
              <>
                <p className="mt-4 text-center font-body-kr text-[15px] leading-[1.45]">
                  한국항공대학교 재학생들을 위한 서비스입니다.
                  <br />
                  졸업생 및 외부인은 비회원으로 접속해주세요.
                </p>

                <div className="mt-5 flex items-center justify-between gap-[10px]">
                  <button
                    type="button"
                    onClick={() => setGuestNoticeStep(2)}
                    className="h-[46px] flex-1 rounded-[14px] border-2 border-ink bg-cream font-body-kr text-[15px] font-semibold"
                  >
                    비회원으로 계속
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsGuestNoticeOpen(false);
                      handleKakaoLogin();
                    }}
                    className="h-[46px] flex-1 rounded-[14px] border-2 border-ink bg-[#fee500] font-body-kr text-[15px] font-semibold"
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
                  <span className="font-bold">팔찌예약</span>은 사용할 수 없어요.
                </p>

                <button
                  type="button"
                  onClick={completeOnboarding}
                  className="mt-5 h-[46px] w-full rounded-[14px] border-2 border-ink bg-ink font-body-kr text-[15px] font-semibold text-paper"
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
