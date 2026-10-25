import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { track } from '@/lib/mixpanel';
import { clearLoginReturnPath, peekLoginReturnPath } from '@/lib/loginReturn';
import reelIcon from '@/assets/cassette_reel.svg';

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

  // 바로 다음 화면으로 넘어가지만, 그 사이 흰 화면이 번쩍이지 않게 노을 하늘 위에 도는 릴을 둔다
  return (
    <section className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-5 text-paper">
      <img
        src={reelIcon}
        alt=""
        width={56}
        height={56}
        className="animate-spin [animation-duration:2.4s] motion-reduce:animate-none"
      />
      <p role="status" className="font-body-kr text-[16px] font-semibold leading-6">
        로그인하는 중이에요…
      </p>
    </section>
  );
};

export default OAuthRedirectPage;
