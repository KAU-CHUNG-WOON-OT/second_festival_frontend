import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// 목록의 필터·검색어를 URL 쿼리에 담아 상세에 갔다가 뒤로 와도 그대로 남게 한다.
// 입력 중 한글 조합이 끊기지 않도록 값은 state로 들고, URL에는 replace로 한 번에 반영한다.
// defaults는 렌더마다 새로 만들지 말고 모듈 상수로 넘긴다.
export const useUrlFilters = <T extends Record<string, string>>(defaults: T) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<T>(() => {
    const initial = { ...defaults };
    for (const key in defaults) {
      initial[key] = (searchParams.get(key) ?? defaults[key]) as T[typeof key];
    }
    return initial;
  });

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    for (const key in defaults) {
      if (filters[key] === defaults[key]) next.delete(key);
      else next.set(key, filters[key]);
    }
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [filters, defaults, searchParams, setSearchParams]);

  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => setFilters((prev) => ({ ...prev, [key]: value })),
    [],
  );
  const resetFilters = useCallback(() => setFilters(defaults), [defaults]);

  return { filters, setFilter, resetFilters };
};
