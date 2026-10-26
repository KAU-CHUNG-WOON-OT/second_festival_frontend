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
    
// 같은 날짜끼리는 이 순서대로 보이고, 맨 앞 공지가 홈 공지 띠에 나온다
export const dummyNotices: NoticeData[] = [
  {
    id: 9,
    title: '[활주로] 푸드트럭 및 테이블 안내',
    title_en: '[Hwaljuro] Food Trucks & Tables',
    content:
      '2026 한국항공대학교 가을축제 : 활주로 (活酒路)\n\n' +
      '1. 푸드트럭\n' +
      '일정 : 10월 28일 (수)\n' +
      '위치 : 대운동장\n' +
      '운영 시간 : 10:00 ~ 22:00\n\n' +
      '2. 테이블\n' +
      '일정 : 10월 28일 (수)\n' +
      '위치 : 대운동장\n' +
      '운영 시간 : 16:00 ~ 22:00 (선착순 50 테이블 진행)\n\n' +
      '자세한 내용은 총학생회 인스타그램(@kau_students) 카드뉴스 확인 부탁드립니다.\n\n' +
      "문의사항은 카카오톡 플러스친구 '한국항공대학교\u00a0총학생회'로 부탁드립니다.\n\n" +
      '제52대 총학생회 x 중앙운영위원회',
    content_en:
      '2026 Korea Aerospace University Fall Festival: Hwaljuro\n\n' +
      '1. Food Trucks\n' +
      'Date: Oct 28 (Wed)\n' +
      'Location: Main Field\n' +
      'Hours: 10:00 - 22:00\n\n' +
      '2. Tables\n' +
      'Date: Oct 28 (Wed)\n' +
      'Location: Main Field\n' +
      'Hours: 16:00 - 22:00 (50 tables, first come, first served)\n\n' +
      'For details, see the card news on the Student Council Instagram (@kau_students).\n\n' +
      "For questions, please contact the KakaoTalk channel 'Korea Aerospace University Student Council'.\n\n" +
      '52nd Student Council x Central Steering Committee',
    date: '2026.10.26',
    isNew: true,
    isImportant: false,
    category: '행사',
    category_en: 'Event',
  },
  {
    id: 10,
    title: '[활주로] 총학생회 행사 안내',
    title_en: '[Hwaljuro] Student Council Events',
    content:
      '2026 한국항공대학교 가을축제 : 활주로 (活酒路)\n\n' +
      '일정 : 10월 28일 (수)\n' +
      '위치 : 학생회관 앞\n' +
      '운영 내용 : 인스타 리그램 이벤트 / 돌림판 게임 & 쿠폰 이벤트\n\n' +
      '자세한 내용은 총학생회 인스타그램(@kau_students) 카드뉴스 확인 부탁드립니다.\n\n' +
      "문의사항은 카카오톡 플러스친구 '한국항공대학교\u00a0총학생회'로 부탁드립니다.\n\n" +
      '제52대 총학생회 x 중앙운영위원회',
    content_en:
      '2026 Korea Aerospace University Fall Festival: Hwaljuro\n\n' +
      'Date: Oct 28 (Wed)\n' +
      'Location: In front of the Student Union Building\n' +
      'Events: Instagram regram event / Spin-the-wheel game & coupon event\n\n' +
      'For details, see the card news on the Student Council Instagram (@kau_students).\n\n' +
      "For questions, please contact the KakaoTalk channel 'Korea Aerospace University Student Council'.\n\n" +
      '52nd Student Council x Central Steering Committee',
    date: '2026.10.26',
    isNew: true,
    isImportant: false,
    category: '행사',
    category_en: 'Event',
  },
  {
    id: 11,
    title: '[활주로] 화랑로 사업소개',
    title_en: '[Hwaljuro] About the Hwarang-ro Project',
    content:
      '2026 한국항공대학교 가을축제 : 활주로 (活酒路)\n\n' +
      '[취지]\n' +
      '화랑로는 한국항공대역 1번출구 앞 상권의 이름입니다.\n' +
      '우리가 화전이라고 부르던 바로 그 거리입니다.\n\n' +
      '올해 활주로(活酒路)는 학교와 화랑로 상권이 함께하는 지역상생 프로젝트로 열립니다.\n\n' +
      '活 살 활 · 酒 술 주 · 路 길 로\n' +
      '한 잔 기울였던 그 날을 다시 재생해, 화랑로를 다시 생기 있게.\n\n' +
      '자세한 내용은 총학생회 인스타그램(@kau_students) 카드뉴스 확인 부탁드립니다.\n\n' +
      "문의사항은 카카오톡 플러스친구 '한국항공대학교\u00a0총학생회'로 부탁드립니다.\n\n" +
      '제52대 총학생회 x 중앙운영위원회',
    content_en:
      '2026 Korea Aerospace University Fall Festival: Hwaljuro\n\n' +
      '[Purpose]\n' +
      'Hwarang-ro is the shopping street in front of Exit 1 of Korea Aerospace University Station — the street we used to call Hwajeon.\n\n' +
      'This year, Hwaljuro (活酒路) is held as a local partnership project between the university and the Hwarang-ro merchants.\n\n' +
      '活 Life · 酒 Drinks · 路 Road\n' +
      'Replaying the days we shared a drink there, to bring Hwarang-ro back to life.\n\n' +
      'For details, see the card news on the Student Council Instagram (@kau_students).\n\n' +
      "For questions, please contact the KakaoTalk channel 'Korea Aerospace University Student Council'.\n\n" +
      '52nd Student Council x Central Steering Committee',
    date: '2026.10.26',
    isNew: true,
    isImportant: false,
    category: '행사',
    category_en: 'Event',
  },
  {
    id: 12,
    title: '[활주로] 화랑로 주점소개',
    title_en: '[Hwaljuro] Hwarang-ro Pubs',
    content:
      '2026 한국항공대학교 가을축제 : 활주로 (活酒路)\n\n' +
      '일정 : 10월 28일 (수)\n' +
      '위치 : 화랑로 일대\n\n' +
      '자세한 내용은 총학생회 인스타그램(@kau_students) 카드뉴스 확인 부탁드립니다.\n\n' +
      '많은 관심 부탁드립니다 :)\n\n' +
      "문의사항은 카카오톡 플러스친구 '한국항공대학교\u00a0총학생회'로 부탁드립니다.\n\n" +
      '제52대 총학생회 x 중앙운영위원회',
    content_en:
      '2026 Korea Aerospace University Fall Festival: Hwaljuro\n\n' +
      'Date: Oct 28 (Wed)\n' +
      'Location: Around Hwarang-ro\n\n' +
      'For details, see the card news on the Student Council Instagram (@kau_students).\n\n' +
      'We hope to see you there :)\n\n' +
      "For questions, please contact the KakaoTalk channel 'Korea Aerospace University Student Council'.\n\n" +
      '52nd Student Council x Central Steering Committee',
    date: '2026.10.26',
    isNew: true,
    isImportant: false,
    category: '행사',
    category_en: 'Event',
  },
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
    isImportant: false,
    category: '행사',
    category_en: 'Event',
  },
];
