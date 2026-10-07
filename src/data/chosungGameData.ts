export const CHOSUNG_TURN_MS = 10000;

const INITIALS = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
// 초성 하나당 중성 21 × 종성 28 글자
const SYLLABLES_PER_INITIAL = 588;

export const getChosung = (word: string) =>
  [...word]
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code < HANGUL_START || code > HANGUL_END) return char;
      return INITIALS[Math.floor((code - HANGUL_START) / SYLLABLES_PER_INITIAL)];
    })
    .join('');

export interface ChosungQuiz {
  chosung: string;
  // 시간이 끝난 뒤 보여줄 예시 정답
  examples: string[];
}

export const CHOSUNG_QUIZZES: ChosungQuiz[] = [
  { chosung: 'ㄱㅅ', examples: ['가수', '감사', '고속'] },
  { chosung: 'ㅅㄹ', examples: ['사랑', '소리', '서랍'] },
  { chosung: 'ㅂㄷ', examples: ['바다', '반대', '별도'] },
  { chosung: 'ㅈㄷ', examples: ['자동', '정도', '지도'] },
  { chosung: 'ㅁㅈ', examples: ['문자', '모자', '매장'] },
  { chosung: 'ㄴㅁ', examples: ['나무', '너무', '나물'] },
  { chosung: 'ㅎㄱ', examples: ['학교', '한국', '휴가'] },
  { chosung: 'ㄷㅈ', examples: ['도전', '단점', '대장'] },
  { chosung: 'ㅅㄱ', examples: ['시간', '사과', '세계'] },
  { chosung: 'ㅊㄱ', examples: ['축구', '친구', '창고'] },
  { chosung: 'ㅇㅅ', examples: ['의사', '우산', '야식'] },
  { chosung: 'ㄱㅂ', examples: ['가방', '김밥', '기분'] },
  { chosung: 'ㅂㅅ', examples: ['버스', '박수', '비서'] },
  { chosung: 'ㅍㄷ', examples: ['포도', '파도', '판단'] },
  { chosung: 'ㄱㅇ', examples: ['공원', '거울', '가을'] },
  { chosung: 'ㄷㄱ', examples: ['대구', '동굴', '단골'] },
  { chosung: 'ㅅㅈ', examples: ['사진', '시장', '숙제'] },
  { chosung: 'ㅁㄹ', examples: ['머리', '마루', '무릎'] },
  { chosung: 'ㅈㅁ', examples: ['주말', '장미', '질문'] },
  { chosung: 'ㅋㅍ', examples: ['커피', '커플', '카페'] },
  { chosung: 'ㅎㄹ', examples: ['하루', '활력', '화려'] },
  { chosung: 'ㄱㄹ', examples: ['거리', '기린', '고래'] },
  { chosung: 'ㄴㄹ', examples: ['노래', '나라', '누리'] },
  { chosung: 'ㄷㅅ', examples: ['도시', '독서', '대신'] },
  { chosung: 'ㅇㄹ', examples: ['여름', '요리', '어른'] },
  { chosung: 'ㅂㅁ', examples: ['비밀', '보물', '방문'] },
  { chosung: 'ㅅㅁ', examples: ['사막', '소문', '시민'] },
  { chosung: 'ㅊㅊ', examples: ['추천', '출처', '철창'] },
  { chosung: 'ㄲㅁ', examples: ['꼬마', '꾸밈', '꿀물'] },
  { chosung: 'ㅈㅈ', examples: ['주장', '전쟁', '정지'] },
];
