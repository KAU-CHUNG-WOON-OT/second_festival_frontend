// 카카오 OAuth 시작 주소. API 주소 환경변수가 없으면 null
export const getKakaoLoginUrl = (): string | null => {
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (!apiBase) {
    console.error('VITE_API_BASE_URL is not configured.');
    return null;
  }
  return `${apiBase.replace(/\/$/, '')}/oauth2/authorization/kakao`;
};
