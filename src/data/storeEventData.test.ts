import { describe, expect, it } from 'vitest';
import { formatDealPrice, storeEvents, type StoreDeal } from './storeEventData';

const allDeals = (): StoreDeal[] =>
  storeEvents.flatMap((store) => [...(store.deals ?? []), ...(store.groups ?? []).flatMap((g) => g.deals)]);

describe('storeEvents', () => {
  it('가게 id는 겹치지 않는다', () => {
    const ids = storeEvents.map((store) => store.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('가게마다 보여 줄 내용이 있다 (행사·묶음·안내 중 하나 이상)', () => {
    for (const store of storeEvents) {
      const dealCount = (store.deals?.length ?? 0) + (store.groups ?? []).reduce((n, g) => n + g.deals.length, 0);
      expect(dealCount > 0 || Boolean(store.note), store.name).toBe(true);
    }
  });

  it('한국어 문구마다 영어 문구가 있다', () => {
    for (const deal of allDeals()) {
      expect(deal.menu_en.trim(), deal.menu).not.toBe('');
    }
    for (const store of storeEvents) {
      expect(Boolean(store.note), store.name).toBe(Boolean(store.note_en));
      for (const group of store.groups ?? []) {
        expect(group.label_en.trim(), group.label).not.toBe('');
        expect(group.deals.length, group.label).toBeGreaterThan(0);
        expect(Boolean(group.note), group.label).toBe(Boolean(group.note_en));
      }
    }
  });

  it('금액은 0보다 큰 정수', () => {
    for (const deal of allDeals()) {
      if (deal.price === undefined) {
        expect(deal.discount, deal.menu).toBeUndefined();
        continue;
      }
      expect(Number.isInteger(deal.price) && deal.price > 0, deal.menu).toBe(true);
    }
  });
});

describe('formatDealPrice', () => {
  it('한국어는 원, 영어는 ₩', () => {
    expect(formatDealPrice(1000, false)).toBe('1,000원');
    expect(formatDealPrice(1500, true)).toBe('₩1,500');
  });
});
