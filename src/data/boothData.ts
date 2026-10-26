import wooriBumoLogo from '../assets/booth/woori_bumo.jpeg';
import wooriBumoPoster from '../assets/booth/woori_bumo_poster.jpeg';
import wooriBumoQr from '../assets/booth/woori_bumo_qr.jpeg';
import seinyeongLogo from '../assets/booth/seinyeong.jpeg';
import seinyeongPoster from '../assets/booth/seinyeong_poster.jpeg';
import seinyeongQr from '../assets/booth/seinyeong_qr.png';
import neighborLogo from '../assets/booth/neighbor.png';
import neighborPoster from '../assets/booth/neighbor_poster.jpeg';
import neighborQr from '../assets/booth/neighbor_qr.jpeg';
import liftHandsOnTopLogo from '../assets/booth/lift_hands_on_top.png';
import liftPoster1 from '../assets/booth/lift_poster_1.jpeg';
import liftPoster2 from '../assets/booth/lift_poster_2.jpeg';
import liftPoster3 from '../assets/booth/lift_poster_3.jpeg';
import liftQr from '../assets/booth/lift_qr.jpeg';
import liftMenuMandu from '../assets/booth/lift_menu_mandu.png';
import liftMenuSki from '../assets/booth/lift_menu_ski.png';
import hakbokLogo from '../assets/booth/hakbok.png';
import hakbokPoster from '../assets/booth/hakbok_poster.jpeg';
import hakbokMenuMochi from '../assets/booth/hakbok_menu_mochi.jpeg';

export interface MenuItem {
    id: number;
    name: string;
    name_en?: string;
    price: string;
    image?: string;
}

export interface BoothData {
    id: number;
    name: string;
    name_en: string;
    category: string;
    description: string;
    description_en: string;
    logo_img: string;
    images: string[];
    insta: string;
    operatingTime: string;
    introduction: string;
    introduction_en: string;
    menu: MenuItem[];
    account: string;
    poster: string[];
    qr_img?: string;
}

export const CATEGORIES = ['전체', '중앙단위', '동아리'];

export const dummyBooths: BoothData[] = [
    {
        id: 101,
        name: '우리부모',
        name_en: 'Woori Bumo',
        category: '동아리',
        description: '우리부모 부스',
        description_en: 'Woori Bumo Booth',
        logo_img: wooriBumoLogo,
        images: [],
        insta: '@kau_wooboo',
        operatingTime: '',
        introduction:
            '밴드 동아리 우리부모의 활동과 공연을 소개하고, 기타 피크를 활용해 나만의 키링을 만들어 보는 체험 부스입니다. ' +
            '스티커와 유성펜 등으로 피크를 자유롭게 꾸미고 키링 고리를 연결해 세상에 하나뿐인 키링을 완성해 보세요!',
        introduction_en:
            'Meet Woori Bumo, our band club, learn about our activities and performances, and make your own keyring out of a guitar pick! ' +
            'Decorate a pick however you like with stickers and permanent markers, attach a keyring, and take home a one-of-a-kind keyring!',
        menu: [
            {
                id: 1011,
                name: '나만의 피크 키링 만들기',
                name_en: 'Make Your Own Guitar Pick Keyring',
                price: '2,000원',
                image: wooriBumoLogo,
            },
        ],
        account: '카카오뱅크 79423547921 신유진',
        poster: [wooriBumoPoster],
        qr_img: wooriBumoQr,
    },
    {
        id: 102,
        name: '세인영',
        name_en: 'Saint-Young',
        category: '동아리',
        description: '세인영 부스',
        description_en: 'Saint-Young Booth',
        logo_img: seinyeongLogo,
        images: [],
        insta: '@kau_saintyoung',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '세인영 마당사업 안내\n' +
            ' - 브롤스타즈 2:2 대결 진행\n' +
            ' - 영화 취향 랜덤 소개팅 운영\n' +
            ' - 군고구마 아이스크림 및 아포카토 판매',
        introduction_en:
            'Saint-Young Booth Activities\n' +
            ' - Brawl Stars 2v2 matches\n' +
            ' - Random blind dates matched by movie taste\n' +
            ' - Roasted sweet potato ice cream and affogato',
        menu: [
            { id: 1021, name: '브롤스타즈', name_en: 'Brawl Stars 2v2', price: '1,000원', image: seinyeongLogo },
            { id: 1022, name: '랜덤소개팅', name_en: 'Random Blind Date', price: '2,000원', image: seinyeongLogo },
            { id: 1023, name: '아포카토', name_en: 'Affogato', price: '3,000원', image: seinyeongLogo },
            {
                id: 1024,
                name: '군고구마 아이스크림',
                name_en: 'Roasted Sweet Potato Ice Cream',
                price: '3,500원',
                image: seinyeongLogo,
            },
        ],
        account: '우리은행 1002866075122 최은서',
        poster: [seinyeongPoster],
        qr_img: seinyeongQr,
    },
    {
        id: 103,
        name: '이웃사촌부',
        name_en: 'Friendly neighborhood',
        category: '동아리',
        description: '이웃사촌부 부스',
        description_en: 'Friendly Neighbourhood Booth',
        logo_img: neighborLogo,
        images: [],
        insta: '@kau_fn_arumi',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '이번 축제를 맞아 일본식 소힘줄 카레인 규스지카레(牛すじカレー)\u2060를 준비했습니다.\n' +
            '\n' +
            '규스지카레는 소힘줄을 푹 끓여 부드러운 식감과 깊고 진한 맛을 살린 일본식 카레입니다. ' +
            '따뜻한 밥과 함께 즐길 수 있는 규스지카레를 판매하니 많은 관심 부탁드립니다!',
        introduction_en:
            'For this festival, we have prepared gyusuji curry (牛すじカレー), a Japanese curry made with beef tendon.\n' +
            '\n' +
            'Gyusuji curry is a Japanese curry in which beef tendon is slowly simmered to bring out a tender texture and a deep, rich flavor. ' +
            'Come enjoy our gyusuji curry served with warm rice!',
        menu: [
            {
                id: 1801,
                name: '규스지카레(牛すじカレー)',
                name_en: 'Gyusuji Curry (Beef Tendon Curry)',
                price: '5,000원',
                image: neighborLogo,
            },
        ],
        account: '카카오뱅크 3333364206941 이성민',
        poster: [neighborPoster],
        qr_img: neighborQr,
    },
    {
        id: 104,
        name: 'LIFT x Hands On Top!',
        name_en: 'LIFT x Hands On Top!',
        category: '동아리',
        description: 'LIFT x Hands On Top! 부스',
        description_en: 'LIFT x Hands On Top! Booth',
        logo_img: liftHandsOnTopLogo,
        images: [],
        insta: '@kau_ski_team / @hand.sontop',
        operatingTime: '10:00 ~ 16:00',
        introduction: '오르는 클라이밍과 내려오는 스키가 만났다! 스키 퀴즈·악력 대회·따끈한 만두까지 한번에!',
        introduction_en:
            'Climbing up meets skiing down! Ski quiz, grip strength contest, and hot dumplings all in one place!',
        menu: [
            { id: 1041, name: '만두 (4알)', name_en: 'Dumplings (4 pcs)', price: '3,000원', image: liftMenuMandu },
            {
                id: 1042,
                name: '악력대회 (1회)',
                name_en: 'Grip Strength Contest (1 Try)',
                price: '1,000원',
                image: liftHandsOnTopLogo,
            },
            { id: 1043, name: '스키 퀴즈 (1회)', name_en: 'Ski Quiz (1 Try)', price: '1,500원', image: liftMenuSki },
            { id: 1044, name: '스키 장비 전시', name_en: 'Ski Equipment Exhibition', price: '무료', image: liftMenuSki },
        ],
        account: '카카오뱅크 3333153310936 강성우',
        poster: [liftPoster1, liftPoster2, liftPoster3],
        qr_img: liftQr,
    },
    {
        id: 105,
        name: '학생복지위원회',
        name_en: 'Student Welfare Committee',
        category: '중앙단위',
        description: '학생복지위원회 부스',
        description_en: 'Student Welfare Committee Booth',
        logo_img: hakbokLogo,
        images: [],
        insta: '@kau_hakbock',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '航貞仙 (항정선) | 과일모찌 만들기\n\n' +
            '상큼달콤한 샤인머스캣 & 블루베리 요거트 과일모찌를 직접 만들고 맛있게 즐겨보세요!\n\n' +
            '일시 | 2026년 10월 28일 (수) 10:00 - 16:00\n' +
            '장소 | 학생회관 앞\n' +
            '참가비 | 3,500원\n' +
            '인원 | 선착순 100명 한정\n' +
            // \u00a0: 채널 이름이 줄 중간에서 끊기지 않게
            "문의 | Instagram @kau_hakbock / 카카오톡 채널 '한국항공대학교\u00a0학생복지회'",
        introduction_en:
            'Hangjeongseon (航貞仙) | Make Your Own Fruit Mochi\n\n' +
            'Make sweet and tangy Shine Muscat & blueberry yogurt fruit mochi yourself and enjoy!\n\n' +
            'When | Wed, Oct 28, 2026, 10:00 - 16:00\n' +
            'Where | In front of the Student Union Building\n' +
            'Fee | 3,500 won\n' +
            'Spots | First 100 people only\n' +
            "Contact | Instagram @kau_hakbock / KakaoTalk channel 'Korea Aerospace University Student Welfare Committee'",
        menu: [
            {
                id: 1051,
                name: '항정선 (선착순 100명)',
                name_en: 'Hangjeongseon Fruit Mochi (First 100)',
                price: '3,500원',
                image: hakbokMenuMochi,
            },
        ],
        account: '',
        poster: [hakbokPoster],
    },
];
