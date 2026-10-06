import { useEffect, useState, type ReactNode } from 'react';
import { cleanupLegacyAuthStorage, setAccessToken } from '@/lib/authStorage';
import { refreshAccessToken } from '@/lib/authRefresh';
import { markOnboardingSeenInCurrentTab } from '@/lib/onboardingSession';
import { identify, setPeople } from '@/lib/mixpanel';
import { getUserInfo } from '@/lib/userInfoStorage';

interface AuthBootGateProps {
  children: ReactNode;
}

const consumeAccessTokenFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const token = params.get('accessToken');
  if (!token) return null;

  params.delete('accessToken');
  params.delete('refreshToken');
  const remaining = params.toString();
  const cleanedUrl = `${window.location.pathname}${remaining ? `?${remaining}` : ''}${window.location.hash}`;
  window.history.replaceState({}, '', cleanedUrl);
  return token;
};

const AuthBootGate = ({ children }: AuthBootGateProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    cleanupLegacyAuthStorage();

    const urlAccessToken = consumeAccessTokenFromUrl();
    if (urlAccessToken) {
      setAccessToken(urlAccessToken);
      markOnboardingSeenInCurrentTab();
      const info = getUserInfo();
      if (info) {
        identify(info.studentId);
        setPeople({ $name: info.name, department: info.department, student_type: info.studentType });
      }
      setReady(true);
      return;
    }

    refreshAccessToken().finally(() => {
      if (!cancelled) {
        const info = getUserInfo();
        if (info) {
          identify(info.studentId);
          setPeople({ $name: info.name, department: info.department, student_type: info.studentType });
        }
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-white">
        <p className="text-[16px] font-medium text-[#314158]">로딩 중...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthBootGate;
