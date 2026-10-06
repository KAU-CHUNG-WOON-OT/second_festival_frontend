import { useEffect, useState, type MouseEvent } from 'react';
import { useIsLogin } from './useIsLogin';
import { useLikes } from './useLikes';
import { getBar, toggleBarLike } from '../lib/api/bar';
import { track } from '@/lib/mixpanel';

export const useBarLike = (barId: number, initialLikes = 0) => {
  const isLogin = useIsLogin();
  const { isLiked, toggle } = useLikes('bar');
  const [likeCount, setLikeCount] = useState(initialLikes);

  useEffect(() => {
    getBar(barId)
      .then((data) => {
        setLikeCount(data.likeCount);
        const localLiked = isLiked(barId);
        if (data.likedByMe !== localLiked) toggle(barId);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barId]);

  const handleLike = async (event: MouseEvent) => {
    event.stopPropagation();
    if (!isLogin) return false;

    const currentlyLiked = isLiked(barId);
    toggle(barId);
    setLikeCount((prev) => prev + (currentlyLiked ? -1 : 1));

    try {
      const data = await toggleBarLike(barId);
      setLikeCount(data.likeCount);
      track(currentlyLiked ? 'item_unliked' : 'item_liked', { item_type: 'bar', item_id: barId });
    } catch {
      toggle(barId);
      setLikeCount((prev) => prev + (currentlyLiked ? 1 : -1));
    }

    return true;
  };

  return { likeCount, likedByMe: isLiked(barId), handleLike, isLogin };
};
