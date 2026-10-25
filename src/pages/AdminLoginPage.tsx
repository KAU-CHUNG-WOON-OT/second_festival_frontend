import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import RetroPageHeader from '../components/common/RetroPageHeader';
import { ApiError } from '../lib/apiClient';
import { getAdminSession, saveAdminSession } from '../lib/adminSession';
import { loginAdmin } from '../lib/api/storeCongestion';

// 관리자 화면에서 넘겨주는 안내 (토큰 만료 등)
export interface AdminLoginState {
  notice?: string;
}

// 두 문장이면 문장 사이에서 줄을 바꾼다 (\n, 오류 칸은 whitespace-pre-line)
const loginErrorMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.status === 401) return '비밀번호가 맞지 않아요';
    if (error.status === 400) return '비밀번호를 입력해 주세요';
    if (error.status === 429) return error.message || '잠시 후 다시 시도해 주세요';
    return '로그인하지 못했어요.\n잠시 후 다시 시도해 주세요.';
  }
  return '연결이 불안정해요.\n잠시 후 다시 시도해 주세요.';
};

// 같은 기기(IP)에서 연속으로 3번 틀리면 서버가 30초 동안 막고 남은 초를 보낸다. 그 밖의 오류는 null
const lockSecondsOf = (error: unknown) => {
  if (!(error instanceof ApiError) || error.status !== 429) return null;
  const seconds = error.detail?.retryAfterSeconds;
  return typeof seconds === 'number' && seconds > 0 ? Math.ceil(seconds) : null;
};

// 운영진 로그인. 숨은 입구(청운 로고 7번)로만 들어오고, 화면에는 비밀번호 입력만 둔다. 비밀번호는 서버만 확인한다
// (맞든 틀리든 한 번에 1초쯤 걸림). 로고는 눌러도 홈으로 가지 않아서 7번 넘게 눌러도 이 화면에 머문다.
// 시안이 없어 정보 입력 화면의 폼 스타일 + 티켓(펀치 홈·절취선) 모양으로 맞춤
const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notice = (location.state as AdminLoginState | null)?.notice ?? null;
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // 이미 로그인한 탭이면 바로 관리자 화면으로 (처음 그릴 때 한 번만 확인)
  const [hasSession] = useState(() => getAdminSession() !== null);
  // 3번 틀려서 막힌 동안: 풀리는 시각과 남은 초 (버튼에 거꾸로 센다)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockSeconds, setLockSeconds] = useState(0);
  const isLocked = lockedUntil !== null;

  useEffect(() => {
    if (lockedUntil === null) return;
    const timer = window.setInterval(() => {
      const left = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (left > 0) {
        setLockSeconds(left);
        return;
      }
      setLockedUntil(null);
      setErrorMessage(null);
      // 풀리면 바로 다시 입력할 수 있게
      requestAnimationFrame(() => inputRef.current?.focus());
    }, 250);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  if (hasSession) return <Navigate to="/admin" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password.trim() || isSubmitting || isLocked) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const result = await loginAdmin(password);
      saveAdminSession({ token: result.token, expiresAt: result.expiresAt });
      navigate('/admin', { replace: true });
    } catch (error) {
      setPassword('');
      const seconds = lockSecondsOf(error);
      if (seconds !== null) {
        setErrorMessage('비밀번호를 3번 틀렸어요.\n잠시 후 다시 시도해 주세요');
        setLockSeconds(seconds);
        setLockedUntil(Date.now() + seconds * 1000);
      } else {
        setErrorMessage(loginErrorMessage(error));
        inputRef.current?.focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader logoLink={false} />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative mt-10 overflow-clip rounded-[24px] border-2 border-ink bg-paper text-ink shadow-[6px_6px_0px_0px_var(--color-ink)]"
      >
        <div className="h-2 w-full bg-retro-stripe" />
        <header className="px-6 pb-5 pt-5">
          <p className="font-typewriter text-[12px] leading-4 tracking-[3.6px] opacity-60">
            ADMIN PASS
          </p>
          <h2 className="pt-2 font-display text-[24px] leading-[30px]">운영진 로그인</h2>
        </header>

        <div className="relative flex flex-col gap-[14px] border-t border-dashed border-ink/50 px-6 pb-6 pt-5">
          <span className="absolute -left-[10px] -top-[10px] size-5 rounded-full border border-ink bg-cream" />
          <span className="absolute -right-[10px] -top-[10px] size-5 rounded-full border border-ink bg-cream" />

          {notice && !errorMessage && (
            <p className="rounded-[16px] border-2 border-ink bg-cream px-4 py-[10px] text-center font-body-kr text-[14px] font-bold">
              {notice}
            </p>
          )}

          <label
            htmlFor="admin-password"
            className="font-body-kr text-[14px] font-semibold leading-5"
          >
            비밀번호
          </label>
          <input
            ref={inputRef}
            id="admin-password"
            name="admin-code"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            maxLength={64}
            disabled={isLocked}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            aria-invalid={errorMessage !== null}
            aria-describedby={errorMessage ? 'admin-login-error' : undefined}
            className={`h-14 w-full rounded-full border-2 bg-cream px-5 font-body-kr text-[18px] tracking-[0.3em] outline-none placeholder:tracking-normal placeholder:text-ink/40 disabled:opacity-60 ${
              errorMessage ? 'border-rust' : 'border-ink'
            }`}
            placeholder="비밀번호"
          />

          {errorMessage && (
            <p
              id="admin-login-error"
              role="alert"
              className="whitespace-pre-line rounded-[16px] border-2 border-rust bg-cream px-4 py-[10px] text-center font-body-kr text-[14px] font-bold text-rust"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!password.trim() || isSubmitting || isLocked}
            className="mt-2 h-16 w-full rounded-[16px] border-2 border-ink bg-rust font-display text-[20px] leading-7 text-paper drop-shadow-[4px_4px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLocked ? `${lockSeconds}초 뒤에 다시 시도` : isSubmitting ? '확인 중…' : '들어가기'}
          </button>
        </div>

        {/* 티켓 아래 떼는 부분: 실수로 들어온 사람은 여기서 나간다 (뒤로가기 기록에 남기지 않음) */}
        <div className="relative flex items-center justify-between gap-3 border-t border-dashed border-ink/50 px-6 py-4">
          <span className="absolute -left-[10px] -top-[10px] size-5 rounded-full border border-ink bg-cream" />
          <span className="absolute -right-[10px] -top-[10px] size-5 rounded-full border border-ink bg-cream" />
          <p className="text-balance font-body-kr text-[14px] leading-5 text-ink/70">운영진이 아니라면 나가기를 눌러 주세요</p>
          <button
            type="button"
            onClick={() => navigate('/home', { replace: true })}
            className="h-10 shrink-0 rounded-full border-2 border-ink bg-cream px-5 font-body-kr text-[14px] font-bold drop-shadow-[3px_3px_0px_var(--color-ink)] transition-transform active:translate-x-[2px] active:translate-y-[2px]"
          >
            나가기
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminLoginPage;
