import { randomInt } from '@/util/random';

export const BOMB_MIN_MS = 5000;
export const BOMB_MAX_MS = 20000;

// 폭탄이 터질 때까지 남은 시간(ms). 플레이어에게는 보여주지 않는다.
export const createBombFuse = (random: () => number = Math.random) => randomInt(BOMB_MIN_MS, BOMB_MAX_MS, random);
