import { describe, expect, it } from 'vitest';
import { fallbackPath } from './backFallback';

describe('fallbackPath', () => {
  it('항멘틀 안쪽 화면(회차·연습)으로 바로 들어왔으면 그 게임의 첫 화면', () => {
    expect(fallbackPath('/game/hangmentle', '?round=1')).toBe('/game/hangmentle');
    expect(fallbackPath('/game/hangmentle', '?view=practice')).toBe('/game/hangmentle');
    expect(fallbackPath('/game/hangmentle', '?view=practice&puzzle=2')).toBe('/game/hangmentle');
    expect(fallbackPath('/game/hangmentle', '?utm_source=insta&round=2')).toBe('/game/hangmentle');
  });

  it('추적용 쿼리만 붙은 게임 첫 화면은 게임 목록으로 (뒤로가기 두 번 누르지 않게)', () => {
    expect(fallbackPath('/game/hangmentle', '?utm_source=insta')).toBe('/game');
    expect(fallbackPath('/game/hangmentle', '?fbclid=abc123')).toBe('/game');
    expect(fallbackPath('/game/hangmentle', '?utm_source=a&utm_medium=b')).toBe('/game');
    expect(fallbackPath('/game/hangmentle', '')).toBe('/game');
  });

  it('상세는 그 목록, 나머지는 홈', () => {
    expect(fallbackPath('/yard/3', '')).toBe('/yard');
    expect(fallbackPath('/pub/12', '?utm_source=x')).toBe('/pub');
    expect(fallbackPath('/foodtruck/1', '')).toBe('/foodtruck');
    expect(fallbackPath('/game/bomb', '')).toBe('/game');
    expect(fallbackPath('/notice', '?round=1')).toBe('/home');
    expect(fallbackPath('/info', '')).toBe('/home');
  });
});
