import { pickRandom } from '@/util/random';

// 손가락이 바뀌지 않고 이만큼 지나면 당첨자를 뽑는다
export const FINGER_HOLD_MS = 3000;
const MIN_FINGERS = 2;
const COLORS = [
  'var(--color-rust)',
  'var(--color-tape-blue)',
  'var(--color-mustard)',
  'var(--color-olive)',
  'var(--color-maroon)',
  'var(--color-sky-light)',
];

export interface Finger {
  x: number;
  y: number;
  color: string;
}

export interface FingerState {
  fingers: Record<number, Finger>;
  // 대기를 시작한 시각(performance.now 기준). 대기 중이 아니면 null
  holdStartedAt: number | null;
  winner: Finger | null;
}

export type FingerAction =
  | { type: 'down'; id: number; x: number; y: number; at: number }
  | { type: 'up'; id: number; at: number }
  | { type: 'pick'; random: number };

export const FINGER_INITIAL_STATE: FingerState = { fingers: {}, holdStartedAt: null, winner: null };

const holdFrom = (fingers: Record<number, Finger>, winner: Finger | null, at: number) =>
  winner === null && Object.keys(fingers).length >= MIN_FINGERS ? at : null;

export const fingerReducer = (state: FingerState, action: FingerAction): FingerState => {
  switch (action.type) {
    case 'down': {
      // 당첨 뒤 손가락을 모두 뗐다가 다시 누르면 새 판
      const startsNewRound = state.winner !== null && Object.keys(state.fingers).length === 0;
      const current = startsNewRound ? {} : state.fingers;
      const usedColors = Object.values(current).map((f) => f.color);
      const color = COLORS.find((c) => !usedColors.includes(c)) ?? COLORS[action.id % COLORS.length];
      const fingers = { ...current, [action.id]: { x: action.x, y: action.y, color } };
      const winner = startsNewRound ? null : state.winner;
      return { fingers, winner, holdStartedAt: holdFrom(fingers, winner, action.at) };
    }
    case 'up': {
      if (!(action.id in state.fingers)) return state;
      const fingers = { ...state.fingers };
      delete fingers[action.id];
      return { ...state, fingers, holdStartedAt: holdFrom(fingers, state.winner, action.at) };
    }
    case 'pick': {
      if (state.holdStartedAt === null) return state;
      const id = Number(pickRandom(Object.keys(state.fingers), () => action.random));
      return { ...state, winner: state.fingers[id], holdStartedAt: null };
    }
  }
};
