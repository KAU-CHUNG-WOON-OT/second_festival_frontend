import { describe, expect, it } from 'vitest';
import { pickRandom, randomInt } from './random';

const fixed = (value: number) => () => value;

describe('randomInt', () => {
  it('최솟값과 최댓값을 모두 포함한 범위에서 정수를 뽑는다', () => {
    expect(randomInt(5, 20, fixed(0))).toBe(5);
    expect(randomInt(5, 20, fixed(0.9999))).toBe(20);
    expect(randomInt(5, 20, fixed(0.5))).toBe(13);
  });
});

describe('pickRandom', () => {
  it('목록의 처음과 끝 항목까지 뽑을 수 있다', () => {
    expect(pickRandom(['a', 'b', 'c'], fixed(0))).toBe('a');
    expect(pickRandom(['a', 'b', 'c'], fixed(0.9999))).toBe('c');
  });
});
