import type { ReactNode } from 'react';
import { FESTIVAL_TITLE } from '../../data/timetableData';

// 노을 배경 위 반투명 알약 "활주로: 항대인의 밤"
export const FestivalPill = () => (
  <span className="inline-flex h-9 items-center rounded-full border border-paper/40 bg-paper/10 px-4 font-body-kr text-[15px] font-medium leading-5 text-paper backdrop-blur-[4px]">
    {FESTIVAL_TITLE}
  </span>
);

interface RetroPageTitleProps {
  title: string;
  // 제목 아래 타자기 부제 (예: "SIDE A · TRACK LIST")
  caption?: string;
  // 제목 오른쪽에 붙는 요소 (예: 새로고침 버튼)
  aside?: ReactNode;
}

// RetroPageHeader 아래에 오는 공통 제목 블록: 알약 → 얇은 48px 제목 → 부제
const RetroPageTitle = ({ title, caption, aside }: RetroPageTitleProps) => {
  return (
    <div className="text-paper">
      <div className="pt-6">
        <FestivalPill />
      </div>
      <div className="flex items-end gap-3 pt-3">
        <h1 className="font-sans text-[48px] font-light leading-[56px] tracking-[-1px]">{title}</h1>
        {aside}
      </div>
      {caption && (
        <p className="pt-2 font-typewriter text-[12px] leading-4 tracking-[3.6px] opacity-70">{caption}</p>
      )}
    </div>
  );
};

export default RetroPageTitle;
