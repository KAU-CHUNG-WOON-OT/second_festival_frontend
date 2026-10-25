import { describe, expect, it } from 'vitest';
import { formatDealPrice, hasStoreDeals, storeEvents, type StoreDeal } from './storeEventData';

const allDeals = (): StoreDeal[] =>
  storeEvents.flatMap((store) => [...(store.deals ?? []), ...(store.groups ?? []).flatMap((g) => g.deals)]);

describe('storeEvents', () => {
  it('가게 id는 겹치지 않는다', () => {
    const ids = storeEvents.map((store) => store.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('행사가 없는 가게는 행사 칸을 빈 배열이 아니라 아예 비워 둔다', () => {
    for (const store of storeEvents) {
      if (hasStoreDeals(store)) continue;
      expect(store.deals, store.name).toBeUndefined();
      expect(store.groups, store.name).toBeUndefined();
    }
  });

  it('한국어 문구마다 영어 문구가 있다', () => {
    for (const deal of allDeals()) {
      expect(deal.menu_en.trim(), deal.menu).not.toBe('');
    }
    for (const store of storeEvents) {
      expect(Boolean(store.note), store.name).toBe(Boolean(store.note_en));
      expect(Boolean(store.intro), store.name).toBe(Boolean(store.intro_en));
      for (const section of store.about ?? []) {
        expect([section.label_en, section.title_en, section.body_en].every((t) => t.trim() !== ''), section.title).toBe(true);
      }
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
