import { describe, expect, it } from 'vitest';
import { createTrapRound, trapReducer, type TrapState } from './trapGameData';

const press = (state: TrapState, ...slots: number[]) =>
  slots.reduce((s, slot) => trapReducer(s, { type: 'press', slot }), state);

describe('createTrapRound', () => {
  it('함정은 칸 중 하나로 정해진다', () => {
    expect(createTrapRound(12, () => 0).trap).toBe(0);
    expect(createTrapRound(12, () => 1 - Number.EPSILON).trap).toBe(11);
    expect(createTrapRound(15, () => 1 - Number.EPSILON).trap).toBe(14);
  });

  it('새 판은 아무 칸도 눌리지 않은 상태로 시작한다', () => {
    const round = createTrapRound(12, () => 0.5);
    expect(round.pressed).toEqual([]);
    expect(round.sprung).toBe(false);
  });
});

describe('trapReducer', () => {
  const round = createTrapRound(12, () => 0); // 함정은 0번

  it('함정이 아닌 칸을 누르면 눌린 칸으로 기록된다', () => {
    const state = press(round, 3, 5);
    expect(state.pressed).toEqual([3, 5]);
    expect(state.sprung).toBe(false);
  });

  it('함정 칸을 누르면 함정이 터진다', () => {
    const state = press(round, 3, 0);
    expect(state.sprung).toBe(true);
    expect(state.pressed).toEqual([3, 0]);
  });

  it('이미 누른 칸은 다시 눌러도 그대로다', () => {
    expect(press(round, 3, 3).pressed).toEqual([3]);
  });

  it('함정이 터진 뒤에는 더 누를 수 없다', () => {
    expect(press(round, 0, 4).pressed).toEqual([0]);
  });

  it('reset하면 칸 수는 그대로 두고 새 함정으로 다시 시작한다', () => {
    const state = trapReducer(
      press(
        createTrapRound(15, () => 0),
        2,
        0,
      ),
      { type: 'reset', random: 0.5 },
    );
    expect(state).toEqual(createTrapRound(15, () => 0.5));
  });
});
