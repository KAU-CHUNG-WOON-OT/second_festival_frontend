import { randomInt } from '@/util/random';

// 악어 게임·통아저씨처럼 여러 칸 중 하나가 함정인 게임
export interface TrapState {
  slots: number;
  // 누르면 터지는 칸 번호. 플레이어에게는 보여주지 않는다.
  trap: number;
  // 누른 순서대로
  pressed: number[];
  sprung: boolean;
}

export type TrapAction = { type: 'press'; slot: number } | { type: 'reset'; random: number };

export const createTrapRound = (slots: number, random: () => number = Math.random): TrapState => ({
  slots,
  trap: randomInt(0, slots - 1, random),
  pressed: [],
  sprung: false,
});

export const trapReducer = (state: TrapState, action: TrapAction): TrapState => {
  switch (action.type) {
    case 'press': {
      if (state.sprung || state.pressed.includes(action.slot)) return state;
      return {
        ...state,
        pressed: [...state.pressed, action.slot],
        sprung: action.slot === state.trap,
      };
    }
    case 'reset':
      return createTrapRound(state.slots, () => action.random);
  }
};
