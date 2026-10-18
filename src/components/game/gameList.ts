import { lazy, type ComponentType } from 'react';
import BombGame from './BombGame';
import ChosungGame from './ChosungGame';
import FingerGame from './FingerGame';
import LiarGame from './LiarGame';
import StopGame from './StopGame';

// 3D 게임은 three.js가 무거워서 들어갈 때 불러온다
const CrocodileGame = lazy(() => import('./CrocodileGame'));
const PirateGame = lazy(() => import('./PirateGame'));

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
  {
    id: 'bomb',
    title: '폭탄 돌리기',
    title_en: 'Hot Potato Bomb',
    sub: '터질 때 들고 있으면 벌칙',
    sub_en: 'Don’t be holding it when it blows',
    caption: 'TRACK B-02 · BOMB',
    colorClass: 'bg-rust text-paper',
    Component: BombGame,
  },
  {
    id: 'finger',
    title: '손가락 복불복',
    title_en: 'Finger Roulette',
    sub: '다 같이 올리면 한 명 당첨',
    sub_en: 'Everyone taps, one gets picked',
    caption: 'TRACK B-03 · ROULETTE',
    colorClass: 'bg-mustard text-ink',
    Component: FingerGame,
  },
  {
    id: 'stop',
    title: '10초 멈추기',
    title_en: '10-Second Stop',
    sub: '정확히 10.00초에 멈춰라',
    sub_en: 'Stop at exactly 10.00 seconds',
    caption: 'TRACK B-04 · 10 SEC',
    colorClass: 'bg-olive text-paper',
    Component: StopGame,
  },
  {
    id: 'chosung',
    title: '초성 게임',
    title_en: 'Chosung Game',
    sub: '10초 안에 초성 단어 대기',
    sub_en: 'Name a word from Korean initials in 10s',
    caption: 'TRACK B-05 · CHOSUNG',
    colorClass: 'bg-tape-blue text-paper',
    Component: ChosungGame,
  },
  {
    id: 'crocodile',
    title: '악어 게임',
    title_en: 'Crocodile Dentist',
    sub: '이빨 누르다 물리면 벌칙',
    sub_en: 'Press a tooth, hope it doesn’t bite',
    caption: 'TRACK B-06 · CROCODILE',
    colorClass: 'bg-olive text-paper',
    Component: CrocodileGame,
  },
  {
    id: 'pirate',
    title: '통아저씨',
    title_en: 'Pop-up Pirate',
    sub: '칼 꽂다 튀어나오면 벌칙',
    sub_en: 'Stab the barrel, don’t pop the pirate',
    caption: 'TRACK B-07 · POP-UP PIRATE',
    colorClass: 'bg-mustard text-ink',
    Component: PirateGame,
  },
];
