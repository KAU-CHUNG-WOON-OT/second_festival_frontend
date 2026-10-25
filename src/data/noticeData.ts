export interface NoticeData {
  id: number;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  date: string;
  isNew: boolean;
  isImportant: boolean;
  category: string;
  category_en: string;
}
    
export const dummyNotices: NoticeData[] = [
  {
    id: 8,
    title: '[항대네컷] 포토부스 운영 안내',
    title_en: '[Hangdae 4-Cut] Photo Booth',
    content:
      '2026 한국항공대학교 가을축제 : 활주로 (活酒路)\n\n' +
      '일정 : 10월 21일 (수) ~ 10월 30일 (금)\n' +
      '위치 : 항트럴파크 포토부스\n' +
      '가격 : 2장 5,000원 (홀수 출력 불가)\n\n' +
      '많은 관심 부탁드립니다 :)\n\n' +
      // \u00a0: 채널 이름이 줄 중간에서 끊기지 않게
      "문의사항은 카카오톡 플러스친구 '한국항공대학교\u00a0총학생회'로 부탁드립니다.\n\n" +
      '제52대 총학생회 x 중앙운영위원회',
    content_en:
      '2026 Korea Aerospace University Fall Festival: Hwaljuro\n\n' +
      'Dates: Oct 21 (Wed) - Oct 30 (Fri)\n' +
      'Location: Photo booth at Hangtral Park\n' +
      'Price: 2 prints for 5,000 won (odd numbers of prints not available)\n\n' +
      'We hope to see you there :)\n\n' +
      "For questions, please contact the KakaoTalk channel 'Korea Aerospace University Student Council'.\n\n" +
      '52nd Student Council x Central Steering Committee',
    date: '2026.10.26',
    isNew: true,
    isImportant: true,
    category: '행사',
    category_en: 'Event',
  },
];
