const TICKET_ISSUE_PENDING_UNTIL_KEY = 'cwf_ticket_issue_pending_until_v1';
export const TICKET_ISSUE_PENDING_DURATION_MS = 15 * 60 * 1000;

const isBrowser = (): boolean => typeof window !== 'undefined';

export const setTicketIssuePending = (
  durationMs: number = TICKET_ISSUE_PENDING_DURATION_MS,
): void => {
  if (!isBrowser()) return;
  const pendingUntil = Date.now() + Math.max(0, durationMs);
  window.sessionStorage.setItem(TICKET_ISSUE_PENDING_UNTIL_KEY, String(pendingUntil));
};

export const getTicketIssuePendingUntil = (): number | null => {
  if (!isBrowser()) return null;
  const raw = window.sessionStorage.getItem(TICKET_ISSUE_PENDING_UNTIL_KEY);
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

export const clearTicketIssuePending = (): void => {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(TICKET_ISSUE_PENDING_UNTIL_KEY);
};

export const isTicketIssuePendingActive = (): boolean => {
  const pendingUntil = getTicketIssuePendingUntil();
  if (!pendingUntil) return false;
  if (pendingUntil <= Date.now()) {
    clearTicketIssuePending();
    return false;
  }
  return true;
};
