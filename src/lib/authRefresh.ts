import { clearAccessToken, setAccessToken } from "./authStorage";

interface RefreshResponseData {
  accessToken: string;
  grantType?: string;
  role?: string;
}

interface RefreshEnvelope {
  success?: boolean;
  data?: RefreshResponseData | null;
}

const resolveBaseUrl = (): string => {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) {
    throw new Error("API base URL is not configured.");
  }
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

let inflightRefresh: Promise<string | null> | null = null;

export const refreshAccessToken = (): Promise<string | null> => {
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = (async () => {
    try {
      const response = await fetch(`${resolveBaseUrl()}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearAccessToken();
        }
        return null;
      }

      const json = (await response.json()) as RefreshEnvelope;
      const accessToken = json?.data?.accessToken;
      if (typeof accessToken === "string" && accessToken.length > 0) {
        setAccessToken(accessToken);
        return accessToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      inflightRefresh = null;
    }
  })();

  return inflightRefresh;
};
