import golbaengi2Image from '../assets/stores/golbaengi2.jpeg';
import jjukkumiImage from '../assets/stores/jjukkumi.jpeg';
import kkokkoImage from '../assets/stores/kkokko.jpeg';
import cafe161Image from '../assets/stores/cafe161.jpeg';
import dukkeobiImage from '../assets/stores/dukkeobi.jpeg';

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

// 가게 화면에만 보이는 소개 묶음 (예: '3F' / '보드게임존')
export interface StoreAboutSection {
  label: string;
  label_en: string;
  title: string;
  title_en: string;
  body: string;
  body_en: string;
}

export interface StoreEvent {
  id: number;
  name: string;
  // 가게 화면 맨 위 가게 사진
  image?: string;
  // 가게 화면의 '네이버 지도로 길찾기' (네이버 지도 앱 '공유 → 링크 복사'로 받은 가게 페이지)
  naverMapUrl?: string;
  // 묶음 없이 바로 보이는 행사
  deals?: StoreDeal[];
  groups?: StoreDealGroup[];
  // 카드 맨 아래 안내 (note를 쓰면 note_en도 같이)
  note?: string;
  note_en?: string;
  // 가게 화면에만 보이는 소개 (목록 카드에는 안 보인다. intro를 쓰면 intro_en도 같이)
  intro?: string;
  intro_en?: string;
  about?: StoreAboutSection[];
}

export const storeEvents: StoreEvent[] = [
  {
    id: 401,
    name: '골뱅이2',
    naverMapUrl: 'https://map.naver.com/p/entry/place/851724475',
    image: golbaengi2Image,
    deals: [
      { menu: '전 메뉴', menu_en: 'All menu items', price: 1000, discount: true },
      { menu: '소주·맥주', menu_en: 'Soju & beer', price: 4000 },
    ],
  },
  {
    id: 402,
    name: '용두동 고흥 쭈꾸미',
    naverMapUrl: 'https://map.naver.com/p/entry/place/31642054',
    image: jjukkumiImage,
    deals: [
      { menu: '쭈삼', menu_en: 'Jjusam (octopus & pork belly)', price: 2000, discount: true },
      { menu: '소주', menu_en: 'Soju', price: 4000 },
      { menu: '병맥주', menu_en: 'Bottled beer', price: 3000 },
    ],
  },
  {
    id: 403,
    name: '꼬끼오꼬꼬',
    naverMapUrl: 'https://map.naver.com/p/entry/place/1069358980',
    image: kkokkoImage,
    deals: [{ menu: '소주·병맥주', menu_en: 'Soju & bottled beer', price: 1000, discount: true }],
    groups: [
      {
        label: '예약 고객 (6인 이상)',
        label_en: 'Reservations (6+ people)',
        deals: [{ menu: '치킨·탕류', menu_en: 'Chicken & stews', price: 2000, discount: true }],
      },
    ],
  },
  {
    id: 404,
    name: '카페161',
    naverMapUrl: 'https://map.naver.com/p/entry/place/2053440858',
    image: cafe161Image,
    deals: [
      { menu: '삼겹살 바베큐', menu_en: 'Pork belly barbecue', price: 12000 },
      { menu: '해산물 토마토 해장 파스타', menu_en: 'Seafood tomato hangover pasta', price: 10000 },
      { menu: '닭가슴살 시저 샐러드', menu_en: 'Chicken breast Caesar salad', price: 10000 },
      {
        menu: '감자튀김, 갈릭버터딥',
        menu_en: 'French fries with garlic butter dip',
        price: 10000,
      },
      { menu: '먹태', menu_en: 'Dried pollock (meoktae)', price: 15000 },
      { menu: '소주·병맥주', menu_en: 'Soju & bottled beer', price: 1000, discount: true },
    ],
    intro: '보드게임존, 야구경기응원존 운영\n활주로 축제 한정 특별 메뉴 제공',
    intro_en:
      'Board game zone and baseball cheering zone\nSpecial menu only for the Runway Festival',
    about: [
      {
        label: '3F',
        label_en: '3F',
        title: '보드게임존',
        title_en: 'Board game zone',
        body: '우노, 할리갈리, 텔레스트레이션, 꼬치의 달인 등',
        body_en: 'UNO, Halli Galli, Telestrations, Kkochi Master, and more',
      },
      {
        label: '4F',
        label_en: '4F',
        title: '스포츠경기 관람존',
        title_en: 'Sports viewing zone',
        body: '야구 플레이오프',
        body_en: 'Baseball playoffs',
      },
    ],
  },
  {
    id: 405,
    name: '두꺼비하우스',
    naverMapUrl: 'https://map.naver.com/p/entry/place/1787228709',
    image: dukkeobiImage,
    note: '할인 행사 없음',
    note_en: 'No discount',
  },
];

// 행사·묶음이 하나도 없으면 false. 그런 가게(두꺼비하우스)는 목록에 행사 칸이 없고, 안내(note)는 가게 화면 사진 밑에 글자로만
export const hasStoreDeals = (store: StoreEvent) => Boolean(store.deals?.length || store.groups?.length);

// 1000 → '1,000원' / '₩1,000'
export const formatDealPrice = (price: number, isEng: boolean) => {
  const amount = price.toLocaleString('ko-KR');
  return isEng ? `₩${amount}` : `${amount}원`;
};
