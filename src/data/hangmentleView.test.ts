import { describe, expect, it } from 'vitest';
import {
  hasHangmentleViewKey,
  hangmentleViewKey,
  hangmentleViewParams,
  isCanonicalHangmentleView,
  parseHangmentleView,
} from './hangmentleView';

const params = (query: string) => new URLSearchParams(query);

describe('parseHangmentleView', () => {
  it('쿼리가 없으면 이벤트 안내(허브)', () => {
    expect(parseHangmentleView(params(''))).toEqual({ kind: 'hub' });
  });

  it('?round=1·2는 회차 화면 (링크로 바로 들어와도)', () => {
    expect(parseHangmentleView(params('round=1'))).toEqual({ kind: 'round', round: 1 });
    expect(parseHangmentleView(params('round=2'))).toEqual({ kind: 'round', round: 2 });
  });

  it('없는 회차·이상한 값은 허브', () => {
    expect(parseHangmentleView(params('round=3'))).toEqual({ kind: 'hub' });
    expect(parseHangmentleView(params('round=0'))).toEqual({ kind: 'hub' });
    expect(parseHangmentleView(params('round=1.5'))).toEqual({ kind: 'hub' });
    expect(parseHangmentleView(params('round=abc'))).toEqual({ kind: 'hub' });
    expect(parseHangmentleView(params('view=ranking'))).toEqual({ kind: 'hub' });
  });

  it('?view=practice는 연습 화면, 문제 번호는 1~2 (그 밖은 1)', () => {
    expect(parseHangmentleView(params('view=practice'))).toEqual({ kind: 'practice', puzzleNo: 1 });
    expect(parseHangmentleView(params('view=practice&puzzle=2'))).toEqual({
      kind: 'practice',
      puzzleNo: 2,
    });
    expect(parseHangmentleView(params('view=practice&puzzle=9'))).toEqual({
      kind: 'practice',
      puzzleNo: 1,
    });
  });
});

describe('hangmentleViewParams', () => {
  it('화면마다 쿼리', () => {
    expect(hangmentleViewParams({ kind: 'hub' }).toString()).toBe('');
    expect(hangmentleViewParams({ kind: 'round', round: 2 }).toString()).toBe('round=2');
    expect(hangmentleViewParams({ kind: 'practice', puzzleNo: 1 }).toString()).toBe('view=practice');
    expect(hangmentleViewParams({ kind: 'practice', puzzleNo: 2 }).toString()).toBe(
      'view=practice&puzzle=2',
    );
  });

  it('항멘틀 쿼리만 바꾸고 다른 쿼리는 남긴다', () => {
    const base = params('utm_source=insta&round=1');
    expect(hangmentleViewParams({ kind: 'practice', puzzleNo: 1 }, base).toString()).toBe(
      'utm_source=insta&view=practice',
    );
    expect(hangmentleViewParams({ kind: 'hub' }, base).toString()).toBe('utm_source=insta');
    // 원래 객체는 그대로
    expect(base.toString()).toBe('utm_source=insta&round=1');
  });

  it('읽은 화면을 다시 쿼리로 만들면 같은 화면', () => {
    for (const query of ['', 'round=1', 'round=2', 'view=practice', 'view=practice&puzzle=2']) {
      expect(hangmentleViewParams(parseHangmentleView(params(query))).toString()).toBe(query);
    }
  });
});

describe('isCanonicalHangmentleView', () => {
  it('맞는 주소는 그대로, 틀린 값은 고쳐 써야 한다', () => {
    expect(isCanonicalHangmentleView(params(''))).toBe(true);
    expect(isCanonicalHangmentleView(params('round=2'))).toBe(true);
    expect(isCanonicalHangmentleView(params('utm_source=insta&view=practice'))).toBe(true);
    expect(isCanonicalHangmentleView(params('round=9'))).toBe(false);
    expect(isCanonicalHangmentleView(params('view=practice&puzzle=1'))).toBe(false);
    expect(isCanonicalHangmentleView(params('round=1&view=practice'))).toBe(false);
  });
});

describe('hangmentleViewKey', () => {
  it('연습 문제 번호만 바뀐 건 같은 화면', () => {
    expect(hangmentleViewKey({ kind: 'practice', puzzleNo: 1 })).toBe(
      hangmentleViewKey({ kind: 'practice', puzzleNo: 2 }),
    );
    expect(hangmentleViewKey({ kind: 'round', round: 1 })).not.toBe(
      hangmentleViewKey({ kind: 'round', round: 2 }),
    );
  });
});

describe('hasHangmentleViewKey', () => {
  it('회차·연습 쿼리가 있을 때만 true (추적용 쿼리만 있으면 false)', () => {
    expect(hasHangmentleViewKey(params('round=1'))).toBe(true);
    expect(hasHangmentleViewKey(params('view=practice'))).toBe(true);
    expect(hasHangmentleViewKey(params('puzzle=2'))).toBe(true);
    expect(hasHangmentleViewKey(params('utm_source=insta&round=2'))).toBe(true);
    expect(hasHangmentleViewKey(params('utm_source=insta'))).toBe(false);
    expect(hasHangmentleViewKey(params('fbclid=abc'))).toBe(false);
    expect(hasHangmentleViewKey(params(''))).toBe(false);
  });
});
