// ──────────────────────────────────────────────
//  굿즈 안내 데이터
//  imageUrl: S3 URL 연동 시 여기에 넣으면 바로 반영
// ─────────────────────────────────────────────
export interface GoodsItem {
    id: number;
    name: string;
    name_en: string;
    price: number;
    badge?: 'BEST' | 'NEW';
    imageUrl?: string;
}

export const goodsItems: GoodsItem[] = [
    { id: 1, name: '짐색+와펜 세트',  name_en: 'Gym Bag + Patch Set',  price: 15000, imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/goods/1.png' },
    { id: 2, name: '타투스티커',       name_en: 'Tattoo Stickers',      price: 3000,  imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/goods/2.png' },
    { id: 3, name: '반다나',           name_en: 'Bandana',              price: 5000,  imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/goods/3.png' },
    { id: 4, name: '슬로건',           name_en: 'Slogan',               price: 5000,  imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/goods/4.png' },
    { id: 5, name: '야구 유니폼',      name_en: 'Baseball Jersey',      price: 0,     imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/goods/5.png' },
];

export const goodsNotices: string[] = [
    '수량이 한정되어 있으니 조기 품절될 수 있습니다',
    '현장에서만 구매 가능합니다 (온라인 판매 없음)',
    '구매 후 교환 및 환불이 불가능합니다',
    '굿즈 판매 수익금은 학생 복지를 위해 사용됩니다',
];

export const goodsNoticesEn: string[] = [
    'Limited quantities available; items may sell out early',
    'Available on-site only (no online sales)',
    'No exchanges or refunds after purchase',
    'Proceeds from goods sales go toward student welfare',
];

export const goodsSaleInfo = {
    location: '총학생회 부스',
    location_en: 'Student Council Booth',
    hours: '축제 기간 중 10:00 – 16:00',
    hours_en: '10:00 – 16:00 during festival days',
    payment: '계좌이체',
    payment_en: 'Bank Transfer',
};

// ──────────────────────────────────────────────
//  위치 안내 데이터
//  imageUrl: 항목별 위치 사진 — S3 URL 연동 시 여기에 넣으면 바로 반영
// ──────────────────────────────────────────────
export type LocationCategory = '흡연' | '도로통제' | '배달존' | '항대존' | '항대네컷';
export type LocationCategoryEn = 'Smoking' | 'Road' | 'Delivery' | 'KAU-Zone' | 'PhotoBooth';

export interface LocationItem {
    id: number;
    category: LocationCategory;
    category_en: LocationCategoryEn;
    name: string;
    name_en: string;
    detail: string;
    detail_en: string;
    imageUrl: string;
    images?: string[];
}

export const locationItems: LocationItem[] = [
    {
        id: 1, category: '흡연', category_en: 'Smoking',
        name: '흡연구역', name_en: 'Smoking Area',
        detail: '지정 흡연 구역', detail_en: 'Designated Smoking Area',
        imageUrl: '', images: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/ect/smoke_1.png', 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/ect/smoke_2.png'],
    },
    {
        id: 2, category: '도로통제', category_en: 'Road',
        name: '도로통제', name_en: 'Road Control',
        detail: '행사 기간 내 도로통제', detail_en: 'Road Restrictions During Event',
        imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/ect/road.png', images: [],
    },
    {
        id: 3, category: '배달존', category_en: 'Delivery',
        name: '배달존', name_en: 'Delivery Zone',
        detail: '배달 수령 가능 구역', detail_en: 'Designated Delivery Area',
        imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/ect/delivery.png', images: [],
    },
    {
        id: 4, category: '항대존', category_en: 'KAU-Zone',
        name: '항대존', name_en: 'KAU-Zone',
        detail: '공연 관람을 위한 항대존', detail_en: 'KAU-Zone for Performance Viewing',
        imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/ect/festival.png', images: [],
    },
    {
        id: 5, category: '항대네컷', category_en: 'PhotoBooth',
        name: '항대네컷', name_en: 'KAU PhotoBooth',
        detail: '포토부스 운영 (2장 5,000원)', detail_en: 'Photo Booth (2 shots ₩5,000)',
        imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/ect/frame.png', images: [],
    },
];

export const locationCategories: LocationCategory[] = [
    '흡연', '도로통제', '배달존', '항대존', '항대네컷',
];

// ──────────────────────────────────────────────
//  제휴사 안내 데이터
//  imageUrl: S3 URL 연동 시 여기에 넣으면 바로 반영됩니다
// ──────────────────────────────────────────────
export interface PartnerItem {
    id: number;
    name: string;
    description: string;
    description_en: string;
    hours: string;
    hours_en: string;
    tags: string[];
    tags_en: string[];
    benefit?: string;
    benefit_en?: string;
    imageUrl: string;
}

export const partnerItems: PartnerItem[] = [
    {
        id: 1, name: '카운셀러',
        description: '신비의 타로 및 사주', description_en: 'Mystical Tarot & Fortune Reading',
        hours: '5/18, 5/19, 5/20', hours_en: 'May 18, 19, 20',
        tags: ['타로', '사주'], tags_en: ['Tarot', 'Fortune Reading'],
        imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/ect/counseller.png',
    },
    {
        id: 2, name: '쿠팡이츠',
        description: '랜덤 쿠폰 뽑기 이벤트 (온라인)\n축제기간 내 쿠폰 발급 및 사용',
        description_en: 'Random coupon draw event (online)\nCoupon issuance & use during the festival',
        hours: '온라인 진행', hours_en: 'Online event',
        tags: ['쿠폰'], tags_en: ['Coupon'],
        imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/ect/coupang.png',
    },
    {
        id: 3, name: '강남스마일안과',
        description: '업체 홍보 및 경품 제공', description_en: 'Brand Promotion & Prize Giveaway',
        hours: '5/18, 5/19, 5/20', hours_en: 'May 18, 19, 20',
        tags: ['라식 할인권', '올리브영 상품권', '스타벅스 기프티콘'],
        tags_en: ['LASIK Discount Voucher', 'Olive Young Gift Card', 'Starbucks Gift Card'],
        imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/ect/smile.png',
    },
    {
        id: 4, name: 'YBM',
        description: '영어강의 관련 프로모션 행사', description_en: 'English Course Promotion Event',
        hours: '5/18', hours_en: 'May 18',
        tags: ['영어강의', '프로모션'], tags_en: ['English Course', 'Promotion'],
        imageUrl: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/ect/ybm.png',
    },
    {
        id: 5, name: '한끼통살',
        description: '익스트림은 사랑을 타고 (소개팅) & 공동구매 인원 대상 경품 제공',
        description_en: '"Extreme Rides on Love" Blind Date & Prize Giveaway for Group Purchase Participants',
        hours: '5/19', hours_en: 'May 19',
        tags: ['공동구매', '소개팅'], tags_en: ['Group Purchase', 'Blind Date'],
        imageUrl: '',
    },
    {
        id: 6, name: '몬스터 에너지',
        description: '몬스터에너지 제품 홍보 및 배부', description_en: 'Monster Energy Product Promotion & Distribution',
        hours: '5/18, 5/19, 5/20', hours_en: 'May 18, 19, 20',
        tags: ['에너지음료', '배부'], tags_en: ['Energy Drink', 'Giveaway'],
        imageUrl: '',
    },
    {
        id: 7, name: '한국필립모리스',
        description: '흡연 부스 관리 및 기기 학생 대상 프로모션', description_en: 'Smoking Area Management & Product Promotion for Students',
        hours: '5/18, 5/19, 5/20', hours_en: 'May 18, 19, 20',
        tags: ['프로모션'], tags_en: ['Promotion'],
        imageUrl: '',
    },
];
