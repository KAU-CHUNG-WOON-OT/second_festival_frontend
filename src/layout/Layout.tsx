import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import SkyDots from '../components/common/SkyDots';
import { useTimeOfDay } from '../hooks/useTimeOfDay';
import { usePageTracking } from '../hooks/usePageTracking';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const timeOfDay = useTimeOfDay();
  usePageTracking();
  const isOnboardingPath = location.pathname === '/onboarding';

  const showFooterPaths = [
    '/home',
    '/notice',
    '/makers',
    '/ticket',
    '/myticket',
    '/masked-singer',
    '/masked-singer/result',
  ];
  const shouldShowFooter = showFooterPaths.includes(location.pathname);

  const scrollMask = {
    maskImage: "linear-gradient(to bottom, transparent 0%, black 24px)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 24px)",
  };

  return (
    <div
      data-theme={timeOfDay}
      className="relative flex h-dvh w-full justify-center overflow-hidden"
      style={{ background: 'var(--bg-gradient)' }}
    >
      <div className="relative flex h-full w-full max-w-[430px] flex-col overflow-clip bg-transparent">
        {!isOnboardingPath && <Header onOpenSidebar={() => setIsSidebarOpen(true)} />}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div
              className={`relative flex min-h-full flex-col ${isOnboardingPath ? 'overflow-hidden' : 'overflow-y-auto'}`}
              style={isOnboardingPath ? undefined : scrollMask}
            >
              {!isOnboardingPath && <SkyDots />}
              <div className="relative z-10 flex-1">{children}</div>
              {shouldShowFooter && (
                <div className="relative z-10">
                  <Footer />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
