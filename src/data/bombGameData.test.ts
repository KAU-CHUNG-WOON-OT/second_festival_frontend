import { describe, expect, it } from 'vitest';
import { BOMB_MAX_MS, BOMB_MIN_MS, createBombFuse } from './bombGameData';

describe('createBombFuse', () => {
  it('폭탄은 정해진 최소~최대 시간 사이에 터진다', () => {
    expect(createBombFuse(() => 0)).toBe(BOMB_MIN_MS);
    expect(createBombFuse(() => 1 - Number.EPSILON)).toBe(BOMB_MAX_MS);
  });

  it('너무 빨리 터지지 않도록 최소 몇 초는 버틴다', () => {
    expect(BOMB_MIN_MS).toBeGreaterThanOrEqual(3000);
    expect(BOMB_MAX_MS).toBeGreaterThan(BOMB_MIN_MS);
  });
});
