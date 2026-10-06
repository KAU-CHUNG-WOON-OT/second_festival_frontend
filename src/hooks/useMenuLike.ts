import { useState, useEffect } from "react";
import { getMenu, toggleMenuLike } from "../lib/api/menu";
import { useIsLogin } from "./useIsLogin";
import { track } from '@/lib/mixpanel';

export const useMenuLike = (menuId: number) => {
  const isLogin = useIsLogin();
  const [likeCount, setLikeCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMenu(menuId)
      .then((data) => {
        setLikeCount(data.likeCount);
        setLikedByMe(data.likedByMe);
      })
      .catch(() => {});
  }, [menuId]);

  const toggle = async () => {
    if (!isLogin || loading) return;
    setLoading(true);
    try {
      const data = await toggleMenuLike(menuId);
      track(data.likedByMe ? 'item_liked' : 'item_unliked', { item_type: 'menu', item_id: menuId });
      setLikeCount(data.likeCount);
      setLikedByMe(data.likedByMe);
    } catch {
      // 실패 시 무시
    } finally {
      setLoading(false);
    }
  };

  return { likeCount, likedByMe, toggle, isLogin };
};