import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { track } from '@/lib/mixpanel';
import { clearLoginReturnPath, peekLoginReturnPath } from '@/lib/loginReturn';

const OAuthRedirectPage = () => {
  const navigate = useNavigate();
  const { dest } = useParams<{ dest: string }>();
  // 로그인 버튼을 누른 화면. 처음 그릴 때 한 번만 읽는다 (StrictMode에서 효과가 두 번 돌아도 같은 곳으로)
  const [returnPath] = useState(peekLoginReturnPath);

  useEffect(() => {
    const target = dest === 'info' ? '/info' : '/home';
    track('login_completed', { destination: target });
    // 처음 로그인(정보 입력)이면 돌아갈 곳은 남겨 두고 정보 입력을 마친 뒤 보낸다
    if (target === '/home' && returnPath) {
      clearLoginReturnPath();
      navigate(returnPath, { replace: true });
      return;
    }
    navigate(target, { replace: true });
  }, [dest, navigate, returnPath]);

  return (
    <section className="flex min-h-[100dvh] items-center justify-center bg-white">
      <p className="text-[16px] font-medium text-[#314158]">로그인 처리 중...</p>
    </section>
  );
};

export default OAuthRedirectPage;
