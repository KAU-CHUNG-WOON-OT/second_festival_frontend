import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import RetroFooter from './RetroFooter';
import SkyDots from '../components/common/SkyDots';
import { useTimeOfDay } from '../hooks/useTimeOfDay';
import { usePageTracking } from '../hooks/usePageTracking';
import { SidebarContext } from '../contexts/SidebarContext';

// 새 디자인이 적용된 페이지: 자체 헤더·배경을 쓰므로 공통 헤더/하늘 배경을 숨김
const REDESIGNED_PATHS = [
  /^\/home$/,
  /^\/timetable$/,
  /^\/performance$/,
  /^\/notice$/,
  /^\/game(\/[a-z]+)?$/,
  /^\/makers$/,
  /^\/info$/,
  /^\/yard(\/\d+)?$/,
  /^\/pub(\/\d+)?$/,
  /^\/foodtruck(\/\d+)?$/,
  /^\/stores(\/\d+)?$/,
];

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigationType = useNavigationType();
  const timeOfDay = useTimeOfDay();
  usePageTracking();
  const isOnboardingPath = location.pathname === '/onboarding';
  const isRedesignedPath = REDESIGNED_PATHS.some((pattern) => pattern.test(location.pathname));
  const scrollRef = useRef<HTMLDivElement>(null);

  const showFooterPaths = ['/home', '/notice', '/makers'];
  const shouldShowFooter = isRedesignedPath || showFooterPaths.includes(location.pathname);

  // 기록 항목(location.key)별 스크롤 위치. 뒤로가기로 돌아오면 보던 자리로 복원
  const scrollPositions = useRef<Record<string, number>>({});
  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const key = location.key;
    const save = () => {
      scrollPositions.current[key] = el.scrollTop;
    };
    el.addEventListener('scroll', save, { passive: true });
    return () => el.removeEventListener('scroll', save);
  }, [location.key]);

  // 페이지가 바뀌면 맨 위로, 뒤로·앞으로 가기면 저장해 둔 위치로 (필터만 바뀐 경우는 그대로)
  useEffect(() => {
    if (prevPathname.current === location.pathname) return;
    prevPathname.current = location.pathname;
    const top = navigationType === 'POP' ? (scrollPositions.current[location.key] ?? 0) : 0;
    scrollRef.current?.scrollTo(0, top);
  }, [location.pathname, location.key, navigationType]);

  const scrollMask = {
    maskImage: 'linear-gradient(to bottom, transparent 0%, black 24px)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 24px)',
  };

  return (
    <SidebarContext.Provider value={{ openSidebar: () => setIsSidebarOpen(true) }}>
      <div
        data-theme={timeOfDay}
        className="relative flex h-dvh w-full justify-center overflow-hidden"
        // 온보딩도 넓은 화면에서 양옆에 보이는 바깥 배경은 다른 화면과 같은 노을 하늘로 맞춘다
        style={{ background: isRedesignedPath || isOnboardingPath ? 'var(--gradient-retro-dusk)' : 'var(--bg-gradient)' }}
      >
        <div className="relative flex h-full w-full max-w-[430px] flex-col overflow-clip bg-transparent">
          {/* 새 디자인 페이지: 노을 하늘과 별은 화면에 고정되고 콘텐츠만 그 위로 스크롤 */}
          {isRedesignedPath && <SkyDots night />}
          {!isOnboardingPath && !isRedesignedPath && (
            <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
          )}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
              <div
                ref={scrollRef}
                className={`relative flex min-h-full flex-col ${isOnboardingPath ? 'overflow-hidden' : 'overflow-y-auto'}`}
                style={isOnboardingPath || isRedesignedPath ? undefined : scrollMask}
              >
                {!isOnboardingPath && !isRedesignedPath && <SkyDots />}
                <div className="relative z-10 flex-1">{children}</div>
                {shouldShowFooter && (
                  <div className="relative z-10">
                    {isRedesignedPath ? (
                      <RetroFooter />
                    ) : (
                      <Footer />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Layout;
