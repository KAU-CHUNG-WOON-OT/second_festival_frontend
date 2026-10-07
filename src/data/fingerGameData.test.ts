import { describe, expect, it } from 'vitest';
import { FINGER_INITIAL_STATE, fingerReducer, type FingerAction, type FingerState } from './fingerGameData';

const run = (actions: FingerAction[], state: FingerState = FINGER_INITIAL_STATE) => actions.reduce(fingerReducer, state);
const down = (id: number, at = 0): FingerAction => ({ type: 'down', id, x: id * 10, y: id * 20, at });
const up = (id: number, at = 0): FingerAction => ({ type: 'up', id, at });

describe('fingerReducer', () => {
  it('손가락이 하나뿐이면 대기를 시작하지 않는다', () => {
    expect(run([down(1, 100)]).holdStartedAt).toBeNull();
  });

  it('두 번째 손가락이 올라오면 그때부터 대기한다', () => {
    expect(run([down(1, 100), down(2, 200)]).holdStartedAt).toBe(200);
  });

  it('여러 손가락이 한꺼번에 올라와도 모두 기록한다', () => {
    const state = run([down(1), down(2), down(3)]);
    expect(Object.keys(state.fingers).map(Number)).toEqual([1, 2, 3]);
  });

  it('손가락마다 다른 색을 준다', () => {
    const colors = Object.values(run([down(1), down(2), down(3)]).fingers).map((f) => f.color);
    expect(new Set(colors).size).toBe(3);
  });

  it('손가락이 바뀌면 대기를 처음부터 다시 한다', () => {
    expect(run([down(1, 0), down(2, 0), down(3, 0), up(3, 1500)]).holdStartedAt).toBe(1500);
  });

  it('한 명만 남으면 대기를 멈춘다', () => {
    expect(run([down(1), down(2), up(2, 500)]).holdStartedAt).toBeNull();
  });

  it('당첨자는 올라와 있는 손가락 중에서 뽑는다', () => {
    const ready = run([down(1), down(2), down(3)]);
    expect(fingerReducer(ready, { type: 'pick', random: 0 }).winner).toEqual(ready.fingers[1]);
    const picked = fingerReducer(ready, { type: 'pick', random: 0.9999 });
    expect(picked.winner).toEqual(ready.fingers[3]);
    expect(picked.holdStartedAt).toBeNull();
  });

  it('당첨 뒤 손가락을 떼는 동안에는 결과를 유지하고 새 판을 시작하지 않는다', () => {
    const picked = fingerReducer(run([down(1), down(2), down(3)]), { type: 'pick', random: 0 });
    const state = run([up(1, 100), up(2, 200)], picked);
    expect(state.winner).toEqual(picked.winner);
    expect(state.holdStartedAt).toBeNull();
  });

  it('모두 뗀 뒤 다시 누르면 새 판이 시작된다', () => {
    const picked = fingerReducer(run([down(1), down(2)]), { type: 'pick', random: 0 });
    const state = run([up(1), up(2), down(5, 900)], picked);
    expect(state.winner).toBeNull();
    expect(Object.keys(state.fingers).map(Number)).toEqual([5]);
  });
});
