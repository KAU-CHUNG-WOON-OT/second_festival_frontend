// 카카오 로그인을 마치고 돌아올 곳. 카카오로 보내기 직전에 지금 주소(경로+쿼리)를 이 탭의 sessionStorage에 넣어 두고,
// 로그인 콜백(/oauth/callback/home)이나 첫 정보 입력(/info)을 마친 뒤 그 주소로 보낸다
const LOGIN_RETURN_KEY = 'cwf_login_return_v1';

// 로그인 흐름 자체의 화면으로는 되돌아가지 않는다 (그때는 지금처럼 홈으로)
const LOGIN_FLOW_PATH = /^\/(?:onboarding|info|oauth(?:\/.*)?)?(?:[?#]|$)/;

// 같은 사이트 안의 상대 경로만 받는다 (오픈 리다이렉트 방지): '/'로 시작하고 '//'·'/\'가 아니며,
// 역슬래시·공백·제어 문자가 없어야 한다 (브라우저는 '/\evil.com'이나 탭이 섞인 '/\t/evil.com'도 다른 사이트로 읽는다)
export const isSafeReturnPath = (value: unknown): value is string => {
  if (typeof value !== 'string' || value.length === 0 || value.length > 2048) return false;
  if (!value.startsWith('/') || value.startsWith('//')) return false;
  // eslint-disable-next-line no-control-regex
  if (/[\\\s\u0000-\u001f\u007f]/.test(value)) return false;
  return !LOGIN_FLOW_PATH.test(value);
};

const storage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

// 카카오로 보내기 직전에 부른다. 로그인 흐름 화면(온보딩 등)에서 누르면 예전에 넣어 둔 값을 지워 홈으로 가게 한다
export const saveLoginReturnPath = () => {
  try {
    const path = `${window.location.pathname}${window.location.search}`;
    if (isSafeReturnPath(path)) storage()?.setItem(LOGIN_RETURN_KEY, path);
    else storage()?.removeItem(LOGIN_RETURN_KEY);
  } catch {
    // 저장이 막혀 있으면 지금처럼 홈으로 간다
  }
};

// 넣어 둔 주소 (없거나 안전하지 않으면 null). 지우지는 않는다
export const peekLoginReturnPath = (): string | null => {
  try {
    const path = storage()?.getItem(LOGIN_RETURN_KEY);
    return isSafeReturnPath(path) ? path : null;
  } catch {
    return null;
  }
};

export const clearLoginReturnPath = () => {
  try {
    storage()?.removeItem(LOGIN_RETURN_KEY);
  } catch {
    // 무시
  }
};

// 넣어 둔 주소를 꺼내고 지운다
export const takeLoginReturnPath = (): string | null => {
  const path = peekLoginReturnPath();
  clearLoginReturnPath();
  return path;
};
