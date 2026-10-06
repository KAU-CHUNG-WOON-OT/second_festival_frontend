import { apiFetch } from "../apiClient";

export interface BarLikeData {
  barId: number;
  barName: string;
  likeCount: number;
  likedByMe: boolean;
}

export const getBar = (barId: number): Promise<BarLikeData> =>
  apiFetch<BarLikeData>(`/api/bars/${barId}`);

export const toggleBarLike = (barId: number): Promise<BarLikeData> =>
  apiFetch<BarLikeData>(`/api/bars/${barId}/likes`, { method: 'POST' });
