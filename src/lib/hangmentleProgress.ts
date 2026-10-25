import type { HangmentleGuess } from '@/data/hangmentleData';

// 항멘틀 추측 기록을 기기에 저장한다. 새로고침해도 이어서 풀 수 있게 (실패해도 게임은 그대로 진행)

export type HangmentleStatus = 'playing' | 'solved';

export interface HangmentleProgress {
  guesses: HangmentleGuess[];
  status: HangmentleStatus;
}

export const EMPTY_PROGRESS: HangmentleProgress = { guesses: [], status: 'playing' };

// 연습 문제는 예전부터 쓰던 키를 그대로 쓰고, 이벤트 회차는 따로 둔다
export const practiceProgressKey = (puzzleNo: number) => `hangmentle:${puzzleNo}`;
export const eventProgressKey = (round: number) => `hangmentle:event:${round}`;

export const loadProgress = (key: string): HangmentleProgress => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return EMPTY_PROGRESS;
    const saved = JSON.parse(raw) as HangmentleProgress;
    if (!Array.isArray(saved.guesses)) return EMPTY_PROGRESS;
    // 예전 '포기' 기록은 이어서 풀 수 있게 진행 중으로 돌린다
    return { guesses: saved.guesses, status: saved.status === 'solved' ? 'solved' : 'playing' };
  } catch {
    return EMPTY_PROGRESS;
  }
};

export const saveProgress = (key: string, progress: HangmentleProgress) => {
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // 저장 공간을 못 쓰는 환경(사생활 보호 모드 등)
  }
};
