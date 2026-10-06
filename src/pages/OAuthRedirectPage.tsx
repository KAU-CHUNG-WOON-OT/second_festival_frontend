import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { track } from '@/lib/mixpanel';

const OAuthRedirectPage = () => {
  const navigate = useNavigate();
  const { dest } = useParams<{ dest: string }>();

  useEffect(() => {
    const target = dest === 'info' ? '/info' : '/home';
    track('login_completed', { destination: target });
    navigate(target, { replace: true });
  }, [dest, navigate]);

  return (
    <section className="flex min-h-[100dvh] items-center justify-center bg-white">
      <p className="text-[16px] font-medium text-[#314158]">로그인 처리 중...</p>
    </section>
  );
};

export default OAuthRedirectPage;
