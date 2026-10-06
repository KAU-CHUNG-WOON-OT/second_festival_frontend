import { apiFetch } from '../apiClient';

export type ClubStatus = "LIVE" | "SCHEDULED" | "DONE" | string;
export type ClubStatusUpdate = 'LIVE' | 'END';
export type ClubType = "CLUB" | "EVENT" | "BREAKTIME" | string;

export interface CurrentClub {
  clubId: number;
  clubName: string;
  clubStatus: ClubStatus;
  clubType: ClubType;
  clubCode: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  code?: string;
  message?: string;
  data?: T | null;
  error?: unknown;
}

export const updateClubStatus = (
  clubId: number,
  clubStatus: ClubStatusUpdate,
): Promise<void> =>
  apiFetch(`/api/clubs/${clubId}/status`, {
    method: 'PATCH',
    body: { clubStatus },
  });

export const fetchCurrentClub = async (): Promise<CurrentClub | null> => {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) throw new Error("VITE_API_BASE_URL is not configured.");

  const url = `${base.replace(/\/$/, "")}/api/clubs/current`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "omit",
    headers: { Accept: "*/*" },
  });

  const text = await response.text();
  let payload: ApiEnvelope<CurrentClub> | null = null;
  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<CurrentClub>;
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    throw new Error(payload?.message ?? `HTTP ${response.status}`);
  }

  return payload?.data ?? null;
};
