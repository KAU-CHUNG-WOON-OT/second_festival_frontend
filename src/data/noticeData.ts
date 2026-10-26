import smokingAreaImage from '../assets/notice/smoking_area.jpg';
import hwarangroMapImage from '../assets/notice/hwarangro_map.jpg';

export interface NoticeData {
  id: number;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  date: string;
  isNew: boolean;
  isImportant: boolean;
  // HOT 라벨. 홈 공지 띠에 가장 먼저 뜬다
  isHot?: boolean;
  category: string;
  category_en: string;
  // 본문 위에 차례로 보이는 카드뉴스·안내 이미지
  images?: string[];
}
    
export const dummyNotices: NoticeData[] = [
  {
    id: 10,
    title: '화랑로 사업 소개',
    title_en: 'About the Hwarangro Project',
    content:
      '[화랑로 사업소개]\n\n' +
      '| 취지\n' +
      '화랑로는 한국항공대역 1번출구 앞 상권의 이름입니다.\n' +
      '우리가 화전이라고 부르던 바로 그 거리입니다.\n\n' +
      '올해 활주로(活酒路)는 학교와 화랑로 상권이 함께하는 지역상생 프로젝트로 열립니다.\n\n' +
      '活 살 활 · 酒 술 주 · 路 길 로\n' +
      '한 잔 기울였던 그 날을 다시 재생해, 화랑로를 다시 생기 있게\n\n' +
      '[화랑로 이용 유의사항]\n' +
      '• 주류 주문 시 신분증을 꼭 지참해 주십시오.\n' +
      '• 화랑로는 주민분들의 생활공간입니다. 거리에서 고성 및 소란은 자제해 주십시오.\n' +
      '• 혜택 적용 기준은 매장마다 다를 수 있습니다.\n\n' +
      '제52대 총학생회 x 중앙운영위원회',
    content_en:
      '[About the Hwarangro Project]\n\n' +
      '| Purpose\n' +
      'Hwarangro is the name of the shopping street in front of Exit 1 of Korea Aerospace University Station.\n' +
      "It's the very street we used to call Hwajeon.\n\n" +
      "This year's Hwaljuro (活酒路) is a local partnership project between the university and the Hwarangro shops.\n\n" +
      '活 life · 酒 drink · 路 road\n' +
      'Replay the nights we raised a glass, and bring Hwarangro back to life.\n\n' +
      '[Notes for visiting Hwarangro]\n' +
      '• Please bring your ID when ordering alcohol.\n' +
      '• Hwarangro is where local residents live. Please avoid shouting or making noise on the street.\n' +
      '• Benefit conditions may differ by store.\n\n' +
      '52nd Student Council x Central Steering Committee',
    date: '2026.10.26',
    isNew: false,
    isImportant: false,
    isHot: true,
    category: '행사',
    category_en: 'Event',
    images: [hwarangroMapImage],
  },
  {
    id: 9,
    title: '[흡연구역] 흡연구역 안내',
    title_en: '[Smoking Area] Designated Smoking Areas',
    content:
      '활주로 기간 동안 흡연구역을 다음과 같이 설정합니다.\n\n' +
      '✔일정 : 강의동 임시 흡연장, 학생회관 후면 흡연장 - 10.28 (수)\n\n' +
      '[주의사항]\n' +
      '❗지정된 구역에서만 흡연을 해주시기 바랍니다.\n' +
      '❗지정된 구역 이외에서 흡연을 할 경우 흡연이 제지될 수 있습니다.\n' +
      '❗흡연 후 꽁초, 쓰레기 등은 쓰레기통에 버려주시기 바랍니다.\n\n' +
      // \u00a0: 채널 이름이 줄 중간에서 끊기지 않게
      '문의사항은 카카오톡 플러스친구 ‘한국항공대학교\u00a0총학생회’로 부탁드립니다.\n\n' +
      '카드뉴스 속 유의사항 숙지 후 안전하고 즐거운 행사를 위해 많은 협조 부탁드립니다.',
    content_en:
      'During Hwaljuro, smoking areas are designated as follows.\n\n' +
      '✔Schedule: Temporary smoking area by the Lecture Building, smoking area behind the Student Union Building - Oct 28 (Wed)\n\n' +
      '[Notes]\n' +
      '❗Please smoke only in the designated areas.\n' +
      '❗Smoking outside the designated areas may be stopped.\n' +
      '❗Please throw cigarette butts and other trash in the trash bins.\n\n' +
      "For questions, please contact the KakaoTalk channel 'Korea Aerospace University Student Council'.\n\n" +
      'Please read the notes in the card news and help us keep the festival safe and fun.',
    date: '2026.10.26',
    isNew: true,
    isImportant: false,
    category: '장소',
    category_en: 'Location',
    images: [smokingAreaImage],
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
