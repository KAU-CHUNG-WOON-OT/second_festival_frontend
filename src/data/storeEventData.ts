// ──────────────────────────────────────────────
//  가게 정보: 축제 기간 학교 앞 가게 행사
//  가게·행사를 늘리거나 고칠 때는 이 파일만 바꾸면 된다 (화면은 그대로)
//  가게 이름은 영어 화면에서도 한글 그대로 보인다
// ──────────────────────────────────────────────

export interface StoreDeal {
  // 메뉴·대상 (예: '전 메뉴', '소주·맥주')
  menu: string;
  menu_en: string;
  // 원 단위 금액. 없으면 메뉴 이름만 보인다 (추천 안주 등)
  price?: number;
  // true면 '1,000원 할인', 아니면 행사 가격 '4,000원'
  discount?: boolean;
}

// 조건이 다른 행사 묶음 (예: 일반 / 예약)
export interface StoreDealGroup {
  label: string;
  label_en: string;
  deals: StoreDeal[];
  // 묶음 아래 작은 안내 (note를 쓰면 note_en도 같이)
  note?: string;
  note_en?: string;
}

export interface StoreEvent {
  id: number;
  name: string;
  // 묶음 없이 바로 보이는 행사
  deals?: StoreDeal[];
  groups?: StoreDealGroup[];
  // 카드 맨 아래 안내 (note를 쓰면 note_en도 같이)
  note?: string;
  note_en?: string;
}

export const storeEvents: StoreEvent[] = [
  {
    id: 401,
    name: '골투',
    deals: [
      { menu: '전 메뉴', menu_en: 'All menu items', price: 1000, discount: true },
      { menu: '소주·맥주', menu_en: 'Soju & beer', price: 4000 },
    ],
  },
  {
    id: 402,
    name: '쭈삼',
    deals: [
      { menu: '쭈삼 메뉴', menu_en: 'Jjusam (octopus & pork belly)', price: 2000, discount: true },
      { menu: '소주', menu_en: 'Soju', price: 4000 },
      { menu: '병맥주', menu_en: 'Bottled beer', price: 3000 },
      { menu: '셀프볶음밥', menu_en: 'Make-your-own fried rice', price: 1500 },
    ],
  },
  {
    id: 403,
    name: '꼬끼오꼬꼬',
    groups: [
      {
        label: '일반',
        label_en: 'Regular',
        deals: [
          { menu: '치킨·탕류', menu_en: 'Chicken & stews', price: 1000, discount: true },
          { menu: '소주·병맥주', menu_en: 'Soju & bottled beer', price: 1000, discount: true },
        ],
      },
      {
        label: '예약 (6인 이상)',
        label_en: 'Reservations (6+ people)',
        deals: [{ menu: '치킨·탕류', menu_en: 'Chicken & stews', price: 2000, discount: true }],
        note: '대상 메뉴는 예약할 때 안내해 드려요',
        note_en: "You'll be told which dishes apply when you book.",
      },
    ],
  },
  {
    id: 404,
    name: '와인바',
    groups: [
      {
        label: '추천 안주',
        label_en: 'Recommended bites',
        deals: [
          { menu: '미트칠리치즈 감자튀김', menu_en: 'Meat chili cheese fries' },
          { menu: '버터갈릭 감자튀김', menu_en: 'Butter garlic fries' },
        ],
      },
    ],
    note: '행사 내용은 곧 추가될 예정이에요',
    note_en: 'Event details are coming soon.',
  },
];

// 1000 → '1,000원' / '₩1,000'
export const formatDealPrice = (price: number, isEng: boolean) => {
  const amount = price.toLocaleString('ko-KR');
  return isEng ? `₩${amount}` : `${amount}원`;
};
