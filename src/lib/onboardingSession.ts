const ONBOARDING_SEEN_SESSION_KEY = "cwf_onboarding_seen_v1";

export const hasSeenOnboardingInCurrentTab = (): boolean => {
  if (typeof window === "undefined") {
    return true;
  }

  return window.sessionStorage.getItem(ONBOARDING_SEEN_SESSION_KEY) === "1";
};

export const markOnboardingSeenInCurrentTab = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(ONBOARDING_SEEN_SESSION_KEY, "1");
};
