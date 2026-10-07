import type { ComponentType } from 'react';
import LiarGame from './LiarGame';

export interface GameEntry {
  id: string;
  title: string;
  title_en: string;
  sub: string;
  sub_en: string;
  // 페이지 제목 아래 타자기 부제
  caption: string;
  // 목록 카드 배경·글자색 (Tailwind 클래스)
  colorClass: string;
  Component: ComponentType;
}

export const GAMES: GameEntry[] = [
  {
    id: 'liar',
    title: '라이어 게임',
    title_en: 'Liar Game',
    sub: '제시어를 모르는 한 명 찾기',
    sub_en: 'Find the one who doesn’t know the word',
    caption: 'TRACK B-01 · LIAR GAME',
    colorClass: 'bg-maroon text-paper',
    Component: LiarGame,
  },
];
