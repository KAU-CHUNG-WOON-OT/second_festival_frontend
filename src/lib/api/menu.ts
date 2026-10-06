import { apiFetch } from "../apiClient";

export interface MenuLikeData {
  menuId: number;
  barId: number;
  menuName: string;
  likeCount: number;
  likedByMe: boolean;
}

export const getMenu = (menuId: number): Promise<MenuLikeData> =>
  apiFetch<MenuLikeData>(`/api/menus/${menuId}`);

export const toggleMenuLike = (menuId: number): Promise<MenuLikeData> =>
  apiFetch<MenuLikeData>(`/api/menus/${menuId}/likes`, { method: 'POST' });
