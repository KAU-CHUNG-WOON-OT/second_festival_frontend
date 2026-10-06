import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { FiChevronUp } from 'react-icons/fi';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import festivalLogo from '@/assets/festival_logo.svg';
import onboardingBackground from '@/assets/onboarding_bg.png';
import onboardingPlane from '@/assets/airplain.png';
import { markOnboardingSeenInCurrentTab } from '../lib/onboardingSession';
import { track } from '@/lib/mixpanel';

type OnboardingStage = 'intro' | 'auth';
const PLANE_TAKEOFF_DURATION_MS = 600;
const PLANE_TAKEOFF_REDUCED_MOTION_MS = 200;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const [stage, setStage] = useState<OnboardingStage>('intro');
  const [isPlaneTakingOff, setIsPlaneTakingOff] = useState(false);
  const [isGuestNoticeOpen, setIsGuestNoticeOpen] = useState(false);
  const [guestNoticeStep, setGuestNoticeStep] = useState<1 | 2>(1);
  const isAuthStage = stage === 'auth';

  const moveToAuthStage = useCallback(() => {
    if (stage !== 'intro' || isPlaneTakingOff) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion
      ? PLANE_TAKEOFF_REDUCED_MOTION_MS
      : PLANE_TAKEOFF_DURATION_MS;

    setIsPlaneTakingOff(true);
    window.setTimeout(() => {
      setStage('auth');
      setIsPlaneTakingOff(false);
    }, duration);
  }, [isPlaneTakingOff, stage]);

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

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (stage !== 'intro') {
      return;
    }

    pointerStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (stage !== 'intro') {
      return;
    }

    if (!pointerStartRef.current) {
      return;
    }

    const deltaX = Math.abs(event.clientX - pointerStartRef.current.x);
    const deltaY = pointerStartRef.current.y - event.clientY;
    pointerStartRef.current = null;

    if (deltaY >= 28 && deltaX <= 70) {
      moveToAuthStage();
    }
  };

  const handlePointerCancel = () => {
    pointerStartRef.current = null;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (stage !== 'intro') {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      moveToAuthStage();
    }
  };

  useEffect(() => {
    if (!isGuestNoticeOpen) return;

    const handler = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setIsGuestNoticeOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isGuestNoticeOpen]);

  return (
    <section
      className="relative h-[100dvh] overflow-hidden overscroll-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleKeyDown}
      aria-label={stage === 'intro' ? '온보딩 화면' : '로그인 화면'}
    >
      <img
        src={onboardingBackground}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${stage === 'intro' ? 'onboarding-bg-zoom' : ''}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(128,183,221,0.32)_24%,rgba(255,121,70,0.92)_100%)]" />

      <div
        className={`absolute bottom-[0px] left-1/2 ${
          isPlaneTakingOff ? 'onboarding-plane-takeoff' : 'opacity-0'
        }`}
        style={{ translate: '-50% 0', bottom: 'max(0px, env(safe-area-inset-bottom))' }}
        aria-hidden
      >
        <div className="h-[84px] w-[138px] overflow-hidden">
          <img
            src={onboardingPlane}
            alt=""
            className="h-full w-full scale-[1.18] object-cover object-center drop-shadow-[0_12px_18px_rgba(38,65,102,0.25)]"
          />
        </div>
      </div>

      <p
        className={`absolute left-1/2 top-[151px] -translate-x-1/2 text-center text-[11px] font-semibold leading-4 tracking-[0.09em] text-white/95 whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-opacity duration-300 ${
          isPlaneTakingOff ? 'opacity-0' : stage === 'intro' ? 'onboarding-fade-up' : ''
        }`}
      >
        KOREA AEROSPACE UNIVERSITY
      </p>

      <p
        className={`absolute left-1/2 top-[260px] -translate-x-1/2 text-center text-[36px] font-medium leading-[1.05] tracking-[-0.035em] text-white whitespace-nowrap drop-shadow-[0_2px_12px_rgba(0,0,0,0.18)] transition-opacity duration-300 ${
          isPlaneTakingOff ? 'opacity-0' : stage === 'intro' ? 'onboarding-fade-up-delay-1' : ''
        }`}
      >
        2026 FESTIVAL
      </p>

      <img
        src={festivalLogo}
        alt="RUNWAY"
        className={`absolute left-1/2 top-[306px] h-[55px] w-[349px] -translate-x-1/2 drop-shadow-[0_18px_32px_rgba(0,0,0,0.16)] transition-opacity duration-300 ${
          isPlaneTakingOff ? 'opacity-0' : stage === 'intro' ? 'onboarding-fade-up-delay-2' : ''
        }`}
      />

      <button
        type="button"
        onClick={moveToAuthStage}
        aria-label="시작하기"
        className={`absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-[4px] transition-opacity duration-300 ${
          stage === 'intro' && !isPlaneTakingOff ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 40px)' }}
      >
        <FiChevronUp className="size-[22px] text-white onboarding-chevron-bounce" aria-hidden />
        <span className="text-[12px] font-medium tracking-wide text-white onboarding-soft-pulse">
          위로 스와이프하거나 탭하여 시작
        </span>
      </button>

      <div
        className={`absolute left-1/2 top-[514px] flex w-[332px] -translate-x-1/2 flex-col gap-[19px] transition-all duration-500 items-center ${
          stage === 'auth'
            ? 'translate-y-0 opacity-100 onboarding-auth-rise'
            : 'pointer-events-none translate-y-[56px] opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setGuestNoticeStep(1);
            setIsGuestNoticeOpen(true);
          }}
          className="flex h-[52px] w-50 items-center justify-center gap-[8px] rounded-[12px] bg-[#fae300] text-[16px] font-bold text-[#111111] shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-transform active:scale-[0.98]"
        >
          <RiKakaoTalkFill className="size-[18px]" />
          카카오톡 로그인
        </button>
        <button
          type="button"
          onClick={() => {
            setGuestNoticeStep(2);
            setIsGuestNoticeOpen(true);
          }}
          className="h-[52px] w-50 rounded-[12px] bg-[#2750b9] text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-transform active:scale-[0.98]"
        >
          비회원으로 접속하기
        </button>
      </div>

      {isAuthStage && isGuestNoticeOpen && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-[16px] backdrop-blur-sm onboarding-backdrop-in"
          role="presentation"
          onClick={() => setIsGuestNoticeOpen(false)}
        >
          <div
            className="relative w-full max-w-[340px] rounded-[20px] bg-white px-[20px] pb-[18px] pt-[22px] shadow-[0_24px_60px_rgba(15,23,42,0.28)] onboarding-modal-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guest-notice-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              id="guest-notice-title"
              className="text-center text-[28px] font-bold leading-none text-[#111111]"
            >
              주의
            </p>

            {guestNoticeStep === 1 ? (
              <>
                <p className="mt-[14px] text-center text-[15px] font-medium leading-[1.45] text-[#374151]">
                  한국항공대학교 재학생들을 위한 서비스입니다.
                  <br />
                  졸업생 및 외부인은 비회원으로 접속해주세요.
                </p>

                <div className="mt-[20px] flex items-center justify-between gap-[10px]">
                  <button
                    type="button"
                    onClick={() => setGuestNoticeStep(2)}
                    className="h-[46px] flex-1 rounded-[14px] bg-[#eef2f7] text-[15px] font-semibold leading-none text-[#374151] transition-colors active:scale-[0.98] hover:bg-[#e2e8f0]"
                  >
                    비회원으로 계속
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsGuestNoticeOpen(false);
                      handleKakaoLogin();
                    }}
                    className="h-[46px] flex-1 rounded-[14px] bg-[#fae300] text-[15px] font-semibold leading-none text-[#111111] transition-all active:scale-[0.98]"
                  >
                    카카오로 가입
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-[14px] text-center text-[15px] font-medium leading-[1.45] text-[#374151]">
                  비회원으로 접속하면
                  <br />
                  <span className="font-bold">팔찌예약</span>,{' '}
                  <span className="font-bold">행사투표</span>는 사용할 수 없어요.
                </p>

                <button
                  type="button"
                  onClick={completeOnboarding}
                  className="mt-[20px] h-[46px] w-full rounded-[14px] bg-[#eef2f7] text-[15px] font-semibold leading-none text-[#374151] transition-colors active:scale-[0.98] hover:bg-[#e2e8f0]"
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
