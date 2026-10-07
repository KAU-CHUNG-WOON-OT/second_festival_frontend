import { describe, expect, it } from 'vitest';
import { LIAR_CATEGORIES, LIAR_MAX_PLAYERS, LIAR_MIN_PLAYERS, createLiarRound } from './liarGameData';

const food = LIAR_CATEGORIES.find((c) => c.id === 'food')!;
// 항상 같은 값을 내는 난수
const fixed = (value: number) => () => value;

describe('createLiarRound', () => {
  it('라이어는 항상 참가자 중 한 명이다', () => {
    for (let count = LIAR_MIN_PLAYERS; count <= LIAR_MAX_PLAYERS; count++) {
      expect(createLiarRound(food, count, fixed(0)).liarIndex).toBe(0);
      expect(createLiarRound(food, count, fixed(0.9999)).liarIndex).toBe(count - 1);
    }
  });

  it('첫 발언자는 항상 참가자 중 한 명이다', () => {
    for (let count = LIAR_MIN_PLAYERS; count <= LIAR_MAX_PLAYERS; count++) {
      expect(createLiarRound(food, count, fixed(0)).firstSpeakerIndex).toBe(0);
      expect(createLiarRound(food, count, fixed(0.9999)).firstSpeakerIndex).toBe(count - 1);
    }
  });

  it('제시어는 고른 주제의 단어에서 나온다', () => {
    for (const category of LIAR_CATEGORIES) {
      for (const value of [0, 0.5, 0.9999]) {
        const round = createLiarRound(category, 4, fixed(value));
        expect(round.category).toBe(category);
        expect(category.words).toContain(round.word);
      }
    }
  });

  it('난수에 따라 매 판 다른 제시어가 나올 수 있다', () => {
    const words = new Set([0, 0.5, 0.9999].map((value) => createLiarRound(food, 4, fixed(value)).word.ko));
    expect(words.size).toBe(3);
  });
});

describe('LIAR_CATEGORIES', () => {
  it('주제 id가 겹치지 않는다', () => {
    const ids = LIAR_CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('주제마다 한글·영어 제시어가 모두 채워져 있고 겹치지 않는다', () => {
    for (const category of LIAR_CATEGORIES) {
      expect(category.words.length).toBeGreaterThan(0);
      for (const word of category.words) {
        expect(word.ko.trim()).not.toBe('');
        expect(word.en.trim()).not.toBe('');
      }
      expect(new Set(category.words.map((w) => w.ko)).size).toBe(category.words.length);
      expect(new Set(category.words.map((w) => w.en)).size).toBe(category.words.length);
    }
  });
});
