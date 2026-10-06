import { useState } from 'react';

export const useLikes = (prefix: string) => {
  const getInitial = (): Record<number, boolean> => {
    const stored = localStorage.getItem(`likes_${prefix}`);
    return stored ? JSON.parse(stored) : {};
  };

  const [likes, setLikes] = useState<Record<number, boolean>>(getInitial);

  const toggle = (id: number) => {
    setLikes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(`likes_${prefix}`, JSON.stringify(next));
      return next;
    });
  };

  const isLiked = (id: number) => !!likes[id];

  return { isLiked, toggle };
};