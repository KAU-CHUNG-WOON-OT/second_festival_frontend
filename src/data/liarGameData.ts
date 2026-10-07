import { pickRandom } from '@/util/random';

export interface LiarWord {
  ko: string;
  en: string;
}

export interface LiarCategory {
  id: string;
  name: string;
  name_en: string;
  words: LiarWord[];
}

export const LIAR_MIN_PLAYERS = 3;
export const LIAR_MAX_PLAYERS = 10;

export const LIAR_CATEGORIES: LiarCategory[] = [
  {
    id: 'food',
    name: '음식',
    name_en: 'Food',
    words: [
      { ko: '떡볶이', en: 'Tteokbokki' },
      { ko: '치킨', en: 'Fried Chicken' },
      { ko: '피자', en: 'Pizza' },
      { ko: '김밥', en: 'Gimbap' },
      { ko: '라면', en: 'Ramen' },
      { ko: '삼겹살', en: 'Pork Belly' },
      { ko: '초밥', en: 'Sushi' },
      { ko: '햄버거', en: 'Hamburger' },
      { ko: '짜장면', en: 'Jjajangmyeon' },
      { ko: '마라탕', en: 'Malatang' },
      { ko: '탕후루', en: 'Tanghulu' },
      { ko: '붕어빵', en: 'Fish-shaped Bun' },
    ],
  },
  {
    id: 'animal',
    name: '동물',
    name_en: 'Animal',
    words: [
      { ko: '고양이', en: 'Cat' },
      { ko: '강아지', en: 'Dog' },
      { ko: '펭귄', en: 'Penguin' },
      { ko: '기린', en: 'Giraffe' },
      { ko: '코끼리', en: 'Elephant' },
      { ko: '호랑이', en: 'Tiger' },
      { ko: '판다', en: 'Panda' },
      { ko: '문어', en: 'Octopus' },
      { ko: '독수리', en: 'Eagle' },
      { ko: '캥거루', en: 'Kangaroo' },
      { ko: '거북이', en: 'Turtle' },
      { ko: '햄스터', en: 'Hamster' },
    ],
  },
  {
    id: 'place',
    name: '장소',
    name_en: 'Place',
    words: [
      { ko: '공항', en: 'Airport' },
      { ko: '도서관', en: 'Library' },
      { ko: '편의점', en: 'Convenience Store' },
      { ko: '놀이공원', en: 'Amusement Park' },
      { ko: '찜질방', en: 'Jjimjilbang' },
      { ko: '노래방', en: 'Karaoke' },
      { ko: '병원', en: 'Hospital' },
      { ko: '해수욕장', en: 'Beach' },
      { ko: '영화관', en: 'Movie Theater' },
      { ko: 'PC방', en: 'PC Cafe' },
      { ko: '헬스장', en: 'Gym' },
      { ko: '지하철역', en: 'Subway Station' },
    ],
  },
  {
    id: 'job',
    name: '직업',
    name_en: 'Job',
    words: [
      { ko: '파일럿', en: 'Pilot' },
      { ko: '승무원', en: 'Flight Attendant' },
      { ko: '의사', en: 'Doctor' },
      { ko: '소방관', en: 'Firefighter' },
      { ko: '요리사', en: 'Chef' },
      { ko: '개발자', en: 'Developer' },
      { ko: '유튜버', en: 'YouTuber' },
      { ko: '선생님', en: 'Teacher' },
      { ko: '경찰', en: 'Police Officer' },
      { ko: '가수', en: 'Singer' },
      { ko: '바리스타', en: 'Barista' },
      { ko: '우주비행사', en: 'Astronaut' },
    ],
  },
  {
    id: 'festival',
    name: '축제',
    name_en: 'Festival',
    words: [
      { ko: '주점', en: 'Pub' },
      { ko: '푸드트럭', en: 'Food Truck' },
      { ko: '팔찌', en: 'Wristband' },
      { ko: '응원봉', en: 'Light Stick' },
      { ko: '불꽃놀이', en: 'Fireworks' },
      { ko: '버스킹', en: 'Busking' },
      { ko: '포토부스', en: 'Photo Booth' },
      { ko: '야광봉', en: 'Glow Stick' },
      { ko: '굿즈', en: 'Merch' },
      { ko: '타임테이블', en: 'Timetable' },
      { ko: '앵콜', en: 'Encore' },
      { ko: '떼창', en: 'Sing-along' },
    ],
  },
];

export interface LiarRound {
  category: LiarCategory;
  word: LiarWord;
  // 0부터 시작하는 플레이어 번호
  liarIndex: number;
  firstSpeakerIndex: number;
}

export const createLiarRound = (
  category: LiarCategory,
  playerCount: number,
  random: () => number = Math.random,
): LiarRound => ({
  category,
  word: pickRandom(category.words, random),
  liarIndex: Math.floor(random() * playerCount),
  firstSpeakerIndex: Math.floor(random() * playerCount),
});
