import type { ReactNode } from 'react';
import { FESTIVAL_DATE_LABEL } from '../../data/timetableData';

interface RetroPageTitleProps {
  title: string;
  // 겨자색 알약에 "· 10.28 WED" 날짜를 붙일지
  showDate?: boolean;
  // 제목 아래 타자기 부제 (예: "SIDE A · TRACK LIST")
  caption?: string;
  // 제목 오른쪽에 붙는 요소 (예: 새로고침 버튼)
  aside?: ReactNode;
}

// RetroPageHeader 아래에 오는 공통 제목 블록: 알약 → 60px 제목 → 부제
const RetroPageTitle = ({ title, showDate = false, caption, aside }: RetroPageTitleProps) => {
  return (
    <>
      <div className="pt-8">
        <span className="inline-flex h-[38px] items-center rounded-full border border-ink bg-mustard px-4 font-display text-[18px] leading-7">
          {showDate ? `활주로 · ${FESTIVAL_DATE_LABEL}` : '활주로'}
        </span>
      </div>
      <div className="flex items-end gap-3 pt-2">
        <h1 className="font-display text-[60px] leading-[60px]">{title}</h1>
        {aside}
      </div>
      {caption && <p className="pt-2 font-typewriter text-[12px] leading-4 tracking-[3.6px]">{caption}</p>}
    </>
  );
};

export default RetroPageTitle;
