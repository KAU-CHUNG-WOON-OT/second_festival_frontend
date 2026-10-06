export const AUTH_STORAGE_CHANGED_EVENT = "cwf_auth_storage_changed";

const LEGACY_STORAGE_KEYS = ["cwf_access_token_v1", "cwf_refresh_token_v1"];

let accessTokenInMemory: string | null = null;

const notifyAuthChanged = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_STORAGE_CHANGED_EVENT));
};

export const getAccessToken = (): string | null => accessTokenInMemory;

export const setAccessToken = (token: string | null): void => {
  accessTokenInMemory = token;
  notifyAuthChanged();
};

export const clearAccessToken = (): void => {
  setAccessToken(null);
};

export const isAuthenticated = (): boolean => accessTokenInMemory !== null;

export const cleanupLegacyAuthStorage = (): void => {
  if (typeof window === "undefined") return;
  for (const key of LEGACY_STORAGE_KEYS) {
    window.localStorage.removeItem(key);
  }
};
