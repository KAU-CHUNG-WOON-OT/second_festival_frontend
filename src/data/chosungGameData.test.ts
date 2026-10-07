import { describe, expect, it } from 'vitest';
import { CHOSUNG_QUIZZES, getChosung } from './chosungGameData';

describe('getChosung', () => {
  it('한글 단어의 초성만 뽑는다', () => {
    expect(getChosung('가수')).toBe('ㄱㅅ');
    expect(getChosung('활주로')).toBe('ㅎㅈㄹ');
  });

  it('된소리 초성도 그대로 뽑는다', () => {
    expect(getChosung('빵떡')).toBe('ㅃㄸ');
  });

  it('한글이 아닌 글자는 그대로 둔다', () => {
    expect(getChosung('PC방')).toBe('PCㅂ');
  });
});

describe('CHOSUNG_QUIZZES', () => {
  it('문제가 겹치지 않는다', () => {
    const chosungs = CHOSUNG_QUIZZES.map((q) => q.chosung);
    expect(new Set(chosungs).size).toBe(chosungs.length);
  });

  it('예시 단어가 모두 문제의 초성과 맞는다', () => {
    for (const quiz of CHOSUNG_QUIZZES) {
      expect(quiz.examples.length).toBeGreaterThan(0);
      for (const word of quiz.examples) {
        expect(getChosung(word), `${quiz.chosung} - ${word}`).toBe(quiz.chosung);
      }
    }
  });
});
