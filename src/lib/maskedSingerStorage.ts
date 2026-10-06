const VOTE_KEY = "cwf_masked_singer_vote_v1";

export const getCurrentVote = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(VOTE_KEY);
};

export const setCurrentVote = (contestantId: string): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VOTE_KEY, contestantId);
};
