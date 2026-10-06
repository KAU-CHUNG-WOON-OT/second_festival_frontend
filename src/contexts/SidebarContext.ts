import { createContext, useContext } from 'react';

// 공통 헤더를 쓰지 않는 페이지(홈 등)에서 사이드바를 열기 위한 컨텍스트
export const SidebarContext = createContext<{ openSidebar: () => void }>({
  openSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);
