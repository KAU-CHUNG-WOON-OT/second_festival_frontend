import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
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
];
// 새 디자인 페이지 중 시안에 푸터가 없는 곳
const NO_FOOTER_PATHS = ['/timetable'];

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const timeOfDay = useTimeOfDay();
  usePageTracking();
  const isOnboardingPath = location.pathname === '/onboarding';
  const isRedesignedPath = REDESIGNED_PATHS.some((pattern) => pattern.test(location.pathname));
  const scrollRef = useRef<HTMLDivElement>(null);

  const showFooterPaths = ['/home', '/notice', '/makers'];
  const shouldShowFooter = isRedesignedPath
    ? !NO_FOOTER_PATHS.includes(location.pathname)
    : showFooterPaths.includes(location.pathname);

  // 페이지가 바뀌면 스크롤을 맨 위로
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  const scrollMask = {
    maskImage: 'linear-gradient(to bottom, transparent 0%, black 24px)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 24px)',
  };

  return (
    <SidebarContext.Provider value={{ openSidebar: () => setIsSidebarOpen(true) }}>
      <div
        data-theme={timeOfDay}
        className="relative flex h-dvh w-full justify-center overflow-hidden"
        style={{ background: isRedesignedPath ? 'var(--color-cream)' : 'var(--bg-gradient)' }}
      >
        <div className="relative flex h-full w-full max-w-[430px] flex-col overflow-clip bg-transparent">
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
                      <RetroFooter large={location.pathname === '/home'} />
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
