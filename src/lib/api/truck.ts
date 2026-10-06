import { apiFetch } from "../apiClient";

export interface TruckMenuLike {
  menuId: number;
  menuName: string;
  likeCount: number;
  likedByMe: boolean;
}

export interface TruckBarLikes {
  barId: number;
  barName: string;
  menus: TruckMenuLike[];
}

export const fetchTruckLikes = (): Promise<TruckBarLikes[]> =>
  apiFetch<TruckBarLikes[]>("/api/truck/likes");
