const USER_INFO_STORAGE_KEY = "cwf_user_info_v1";

export type StudentType = "UNDERGRADUATE" | "ON_LEAVE" | "GRADUATE";

export interface UserInfo {
  name: string;
  studentId: string;
  email: string;
  department?: string;
  studentType: StudentType;
}

export const hasSubmittedUserInfo = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(USER_INFO_STORAGE_KEY) !== null;
};

export const saveUserInfo = (info: UserInfo): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(info));
};

export const getUserInfo = (): UserInfo | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(USER_INFO_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
};
