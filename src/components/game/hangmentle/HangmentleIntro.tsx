import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsLogin } from '@/hooks/useIsLogin';
import { GAME_CARD } from '../gameStyles';
import { KakaoLoginButton } from './HangmentleLogin';
import { HANGMENTLE_EVENT_ROUNDS, formatKstTime } from '@/data/hangmentleEvent';

// 이만큼 움직여야 가로·세로 중 어느 쪽으로 끄는지 정한다
const AXIS_LOCK_PX = 8;
// 이만큼(또는 카드 폭의 20%) 넘게 끌면 다음·이전 장으로 넘긴다
const SWIPE_MIN_PX = 56;
// 짧게 끌어도 이 속도(px/ms)보다 빠르게 튕기면 넘긴다
const FLICK_PX_PER_MS = 0.35;
// 손을 멈추고 이만큼 지나서 놓으면 튕긴 것으로 보지 않는다
const FLICK_IDLE_MS = 100;
// 이 시간 안에 이만큼 넘게 밀고 놓아도 튕긴 것으로 본다
const QUICK_SWIPE_MS = 250;
const QUICK_SWIPE_PX = 24;

interface Slide {
  title: string;
  body: string;
  visual: ReactNode;
}

interface Gesture {
  id: number;
  x: number;
  y: number;
  width: number;
  axis: 'x' | 'y' | null;
  // 튕긴 속도를 재기 위한 시작 시각, 마지막 위치·시각과 속도(px/ms, 최근 움직임에 무게)
  startT: number;
  lastX: number;
  lastT: number;
  vx: number;
}

const MOCK_BOX = 'rounded-[12px] border border-ink bg-cream';

// 이벤트 안내 첫 화면의 설명 카드. 옆으로 밀거나 아래 버튼·점으로 넘기고, 키보드 좌우 화살표도 된다
const HangmentleIntro = () => {
  const { language } = useLanguage();
  const isEng = language === 'ENG';
  const isLogin = useIsLogin();

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const gesture = useRef<Gesture | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  // 넘기기 직전에 포커스가 카드 안에 있었는지 (넘긴 뒤 포커스를 잃으면 카드 화면으로 옮긴다)
  const keepFocus = useRef(false);

  const slides: Slide[] = [
    {
      title: isEng ? 'Find the secret word' : '정답 단어를 찾는 게임이에요',
      body: isEng
        ? 'Type a word and we tell you how close its meaning is to the answer, as a similarity score (%).'
        : // \u2060(단어 잇기): '유사도(%)로'가 중간에서 줄이 바뀌지 않게
          '단어를 입력하면 정답과 뜻이 얼마나 가까운지 유사도\u2060(%)\u2060로 알려 줘요.',
      visual: (
        <div aria-hidden className="flex gap-2">
          <span className="flex h-10 min-w-0 flex-1 items-center rounded-full border border-ink/20 bg-cream px-4 font-body-kr text-[14px] text-ink/50">
            {isEng ? 'Type a Korean word' : '단어를 입력하세요'}
          </span>
          <span className="flex h-10 shrink-0 items-center rounded-full border-2 border-ink bg-rust px-4 font-display text-[14px] text-paper">
            {isEng ? 'Guess' : '추측'}
          </span>
        </div>
      ),
    },
    {
      title: isEng ? 'Similarity is your clue' : '유사도가 힌트예요',
      body: isEng
        ? 'The closer the meaning, the nearer to 100%. Words in the top 1000 also show their rank.'
        : '가까울수록 100%에 가까워지고, 1000위 안에 들면 순위도 알려 줘요.',
      visual: (
        <ul aria-hidden className="grid grid-cols-4 gap-2 text-center">
          {[
            [isEng ? 'Answer' : '정답', '100%'],
            [isEng ? '#1' : '1위', '99%'],
            [isEng ? '#10' : '10위', '90%'],
            [isEng ? '#1000' : '1000위', '50%'],
          ].map(([rank, score]) => (
            <li key={rank} className={`${MOCK_BOX} px-1 py-2`}>
              <p className="font-condensed text-[18px] font-bold leading-6">{score}</p>
              <p className="font-body-kr text-[11px] leading-4 opacity-60">{rank}</p>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: isEng ? '10 PM & 11 PM events' : '밤 10시·11시 이벤트',
      body: isEng
        ? 'New puzzles open at 10 PM and 11 PM on Oct 28. The first 10 to solve each one make the ranking.'
        : '10월 28일 밤 10시와 11시에 새 문제가 열려요. 먼저 맞힌 10명이 랭킹에 올라요.',
      visual: (
        <div aria-hidden className="grid grid-cols-2 gap-2">
          {HANGMENTLE_EVENT_ROUNDS.map((event) => (
            <div key={event.round} className={`${MOCK_BOX} px-3 py-2`}>
              <p className="font-condensed text-[22px] font-bold leading-7">
                {formatKstTime(event.scheduledAt, false)}
              </p>
              <p className="font-body-kr text-[12px] leading-4 opacity-60">
                {isEng ? event.titleEn : event.title}
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: isEng ? 'Log in to join' : '로그인하고 참여하세요',
      body: isEng
        ? 'Only players logged in with Kakao can join the events. Anyone can play the practice puzzles.'
        : '이벤트는 카카오 로그인한 사람만 참여할 수 있어요. 연습 문제는 누구나 풀 수 있어요.',
      visual: isLogin ? (
        <p className="flex h-11 items-center justify-center gap-2 rounded-full border border-ink bg-cream font-body-kr text-[14px] font-semibold">
          <FiCheck aria-hidden size={16} />
          {isEng ? 'You are logged in' : '로그인되어 있어요'}
        </p>
      ) : (
        <KakaoLoginButton source="hub" />
      ),
    },
  ];
  const last = slides.length - 1;
  const go = (next: number) => {
    keepFocus.current = !!sectionRef.current?.contains(document.activeElement);
    setIndex(Math.max(0, Math.min(last, next)));
  };

  // 포커스가 있던 컨트롤이 넘긴 뒤 쓸 수 없게 되면(다른 장의 카카오 버튼은 inert, 끝에서는 이전·다음 버튼이 disabled)
  // 포커스가 문서 맨 위로 빠져 화살표가 더는 듣지 않는다. 그럴 때는 카드 화면으로 옮겨 계속 넘길 수 있게 한다
  useEffect(() => {
    if (!keepFocus.current) return;
    keepFocus.current = false;
    const active = document.activeElement;
    const lost =
      !(active instanceof HTMLElement) ||
      !sectionRef.current?.contains(active) ||
      active.matches(':disabled') ||
      active.closest('[inert]') !== null;
    if (lost) viewportRef.current?.focus({ preventScroll: true });
  }, [index]);

  // 세로로 끌면 페이지 스크롤에 맡기고(touch-action: pan-y), 가로로 끌 때만 카드를 따라 움직인다
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    gesture.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      width: e.currentTarget.clientWidth,
      axis: null,
      startT: e.timeStamp,
      lastX: e.clientX,
      lastT: e.timeStamp,
      vx: 0,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (g.axis === null) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
      g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (g.axis === 'x') {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
      }
    }
    if (g.axis !== 'x') return;
    const dt = e.timeStamp - g.lastT;
    if (dt > 0) g.vx = 0.8 * ((e.clientX - g.lastX) / dt) + 0.2 * g.vx;
    g.lastX = e.clientX;
    g.lastT = e.timeStamp;
    // 첫 장·마지막 장에서 바깥으로 끌면 덜 따라온다
    const pastEdge = (index === 0 && dx > 0) || (index === last && dx < 0);
    setDragX(pastEdge ? dx / 3 : dx);
  };

  const endGesture = (e: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    gesture.current = null;
    if (g.axis === 'x' && !cancelled) {
      const dx = e.clientX - g.x;
      const threshold = Math.min(SWIPE_MIN_PX, g.width * 0.2);
      // 멀리 끌었거나, 짧아도 같은 쪽으로 빠르게 튕겼으면 넘긴다
      const vx = e.timeStamp - g.lastT > FLICK_IDLE_MS ? 0 : g.vx;
      const quick = e.timeStamp - g.startT < QUICK_SWIPE_MS && Math.abs(dx) > QUICK_SWIPE_PX;
      const flick = quick || (Math.abs(vx) >= FLICK_PX_PER_MS && Math.sign(vx) === Math.sign(dx));
      if (dx <= -threshold || (flick && dx < 0)) go(index + 1);
      else if (dx >= threshold || (flick && dx > 0)) go(index - 1);
    }
    setDragging(false);
    setDragX(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') go(index + 1);
    else if (e.key === 'ArrowLeft') go(index - 1);
    else return;
    e.preventDefault();
  };

  const stepButton =
    'flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-ink drop-shadow-[2px_2px_0px_var(--color-ink)] transition-transform active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-30 disabled:drop-shadow-none';

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-roledescription={isEng ? 'carousel' : '슬라이드'}
      aria-label={isEng ? 'How to play Hangmentle' : '항멘틀 안내'}
      onKeyDown={handleKeyDown}
      className={`${GAME_CARD} overflow-hidden px-0`}
    >
      <div className="flex items-center justify-between px-5 font-typewriter text-[12px] leading-4 opacity-60">
        <span>HOW TO PLAY</span>
        <span aria-hidden>
          {index + 1} / {slides.length}
        </span>
      </div>

      <div
        ref={viewportRef}
        tabIndex={0}
        aria-label={isEng ? 'Slides. Use the arrow keys to move.' : '설명 카드. 좌우 화살표로 넘겨요'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => endGesture(e, false)}
        onPointerCancel={(e) => endGesture(e, true)}
        className={`touch-pan-y overflow-hidden outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mustard ${
          dragging ? 'select-none' : ''
        }`}
      >
        <div
          className={`flex ${dragging ? '' : 'transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'}`}
          style={{ transform: `translateX(calc(${-index * 100}% + ${dragX}px))` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.title}
              role="group"
              aria-roledescription={isEng ? 'slide' : '설명'}
              aria-label={`${i + 1} / ${slides.length}`}
              inert={i !== index}
              className="flex w-full shrink-0 flex-col px-5 pt-3"
            >
              <p className="font-condensed text-[36px] font-bold leading-10 text-rust">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="pt-1 font-display text-[22px] leading-[30px]">{slide.title}</h2>
              <p className="pt-2 font-body-kr text-[14px] leading-[22px] opacity-70">{slide.body}</p>
              <div className="mt-auto pt-5">{slide.visual}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pt-5">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label={isEng ? 'Previous' : '이전 설명'}
          className={`${stepButton} bg-paper text-ink`}
        >
          <FiChevronLeft size={20} aria-hidden />
        </button>
        <div className="flex items-center">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => go(i)}
              aria-label={isEng ? `Slide ${i + 1}` : `${i + 1}번째 설명`}
              aria-current={i === index ? 'step' : undefined}
              className="flex h-8 items-center px-1"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                  i === index ? 'w-6 bg-ink' : 'w-2 bg-ink/30'
                }`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === last}
          aria-label={isEng ? 'Next' : '다음 설명'}
          className={`${stepButton} bg-ink text-paper`}
        >
          <FiChevronRight size={20} aria-hidden />
        </button>
      </div>

      {/* 화면 낭독기에 넘긴 장을 알려 준다 */}
      <p aria-live="polite" className="sr-only">
        {`${index + 1} / ${slides.length}. ${slides[index].title}`}
      </p>
    </section>
  );
};

export default HangmentleIntro;
