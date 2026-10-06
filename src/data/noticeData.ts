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
    id: 2,
    title: '활공제 기간 중 교내 차량 통제 안내',
    title_en: 'Campus Traffic Notice During Hwalgongje',
    content:
      '• 도로 통제에 따른 안내는 관계자가 진행 예정입니다.\n' +
      '• 관계자의 안내에 따르지 않을 시 통행이 거부될 수 있습니다.\n' +
      '• 과학관 옆 주차장은 사용 가능합니다.\n' +
      '• 지정된 경로로만 통행 가능합니다.\n' +
      '• 차량이 많아 축제 당일 교내가 매우 혼잡할 것으로 예상되니 가급적 대중교통 이용 바랍니다',
    content_en:
      '• Staff will be on-site to guide traffic during road restrictions.\n' +
      '• Entry may be denied if you do not follow the staff instructions.\n' +
      '• The parking lot next to the Science Building will be available.\n' +
      '• Vehicles must follow the designated route only.\n' +
      '• Heavy traffic is expected on campus during the festival, so we recommend using public transportation if possible.',
    date: '2026.05.15',
    isNew: false,
    isImportant: false,
    category: '장소',
    category_en: 'Location',
  },
  {
    id: 3,
    title: '흡연장 안내',
    title_en: 'Smoking Area Notice',
    content:
      '• 지정된 흡연 구역 외 장소에서는 흡연이 제한됩니다.\n' +
      '• 흡연장 이용 후 꽁초 및 쓰레기는 반드시 지정된 장소에 버려주시기 바랍니다.\n' +
      '• 많은 인원이 이용하는 만큼 서로 배려하여 이용 부탁드립니다.\n' +
      '• 음주 후 안전사고가 발생하지 않도록 유의 바랍니다.\n' +
      '• 쾌적하고 안전한 축제 환경 조성을 위해 협조 부탁드립니다',
    content_en:
      '• Smoking is only allowed in designated smoking areas.\n' +
      '• Please dispose of cigarette butts and trash in the designated bins.\n' +
      '• Please be considerate of others when using the smoking area.\n' +
      '• Please take extra care to prevent accidents after drinking.\n' +
      '• Thank you for helping us keep the festival safe and pleasant for everyone.',
    date: '2026.05.15',
    isNew: false,
    isImportant: false,
    category: '장소',
    category_en: 'Location',
  },
  {
    id: 4,
    title: '항대존 입장 팔찌 선착순 배부',
    title_en: 'KAU-Zone Entry Wristbands - First Come, First Served',
    content:
      '[티켓팅 시간]' +
      '• 재학생, 대학원생 10:00 ~ 15:00\n' +
      '• 휴학생 12:00 ~ 15:00\n' +
      '※ 12시 이전 티켓이 소진되었을 경우 휴학생 배부 없이 마감됩니다.\n' +
      '※ 졸업생은 팔찌 수령 불가합니다.\n' +
      '※ 웹사이트 회원가입 시 본인의 실제 정보와 다른 정보로 가입 시 티켓 수령 불가를 포함한 불이익이 있을 수 있습니다.' +
      '[배부 시간]\n' +
      '• 티켓팅 성공자 10:00 ~ 15:00\n' +
      '• 미소진 팔찌 15:00 ~ 18:00\n' +
      '※ 티켓팅 성공자는 15시 이후 수령이 불가합니다.\n' +
      '※ 미소진 팔찌가 없을 시 미소진 팔찌 배부는 없습니다.\n' +
      '(티켓 소진 여부는 당일 총학생회 인스타 스토리를 참고해주세요)',
    content_en:
      '[Ticketing Hours]\n' +
      '• Enrolled Students & Graduate Students: 10:00 AM – 3:00 PM\n' +
      '• Students on Leave: 12:00 PM – 3:00 PM\n' +
      '※ If all tickets run out before 12:00 PM, ticketing will close without distribution for students on leave.\n' +
      '※ Alumni are not eligible to receive wristbands.\n' +
      '※ Please sign up with your real information. Using incorrect information may result in disadvantages, including being unable to receive the ticket.\n' +
      '[Wristband Pick-up Hours]\n' +
      '• Successful Ticket Holders: 10:00 AM – 3:00 PM\n' +
      '• Remaining Wristbands: 3:00 PM – 6:00 PM\n' +
      '※ Successful ticket holders cannot pick up their wristbands after 3:00 PM.\n' +
      '※ If there are no remaining wristbands, there will be no additional distribution.\n' +
      "※ Please check the Student Council's Instagram story on the day for ticket availability updates.",
    date: '2026.05.15',
    isNew: false,
    isImportant: false,
    category: '공연',
    category_en: 'Performance',
  },
  {
    id: 5,
    title: '배달존 안내',
    title_en: 'Delivery Zone Notice',
    content:
      '• 배달 음식은 지정된 배달존에서만 수령 가능합니다.\n' +
      '• 행사장 내부 및 통행로에서의 배달 수령은 제한될 수 있습니다.\n' +
      '• 배달 수령 후 발생한 쓰레기는 지정된 장소에 분리배출 바랍니다.\n' +
      '• 원활한 축제 운영과 안전한 통행을 위해 협조 부탁드립니다.',
    content_en:
      '• Food deliveries can only be picked up at the designated delivery zone.\n' +
      '• Pick-up inside the festival area or along walkways may be restricted.\n' +
      '• Please sort and dispose of any delivery waste in the designated bins.\n' +
      '• Thank you for helping us keep the festival running smoothly and the walkways safe.',
    date: '2026.05.15',
    isNew: false,
    isImportant: false,
    category: '장소',
    category_en: 'Location',
  },
  {
    id: 6,
    title: '항대존 입장 및 공연 관람 유의사항',
    title_en: 'Yard Event Booth Layout',
    content:
      '• 팔찌 소지자만 입장 가능합니다.\n' +
      '• 훼손된 팔찌 및 재부착된 팔찌는 입장이 불가능합니다.\n' +
      '• 항대존 내 휴대폰을 제외한 카메라 사용은 금지됩니다.\n' +
      '• 항대존 내부, 외부에서 의자에 올라가는 등 다른 사람에게 피해가 되는 행동은 총학생회에 의해 제재될 수 있습니다.\n' +
      '• 항대존 내부 및 외부에서 유리병, 사다리, 간이 의자, 대포 카메라, 물총 등 위험한 물건은 사용할 수 없습니다.\n' +
      '• 항대존 내 가방 반입 불가합니다.\n' +
      '• 총학생회 제재를 따르지 않을 경우 물건 압수 및 퇴장당할 수 있습니다.\n' +
      '※ 소지 및 사용 금지 물품 발견 시 압수 후 폐기 처분합니다.\n' +
      '※ 즐겁고 안전한 행사 진행을 위해 협조 부탁드립니다.',
    content_en:
      '• Only bracelet holders can enter.\n' +
      '• Damaged and reattached bracelets are not allowed to enter.\n' +
      '• The use of cameras is prohibited except for mobile phones in the zone.\n' +
      '• Actions that harm others, such as climbing onto a chair inside or outside the anti-zone, can be sanctioned by the student council.\n' +
      '• Dangerous items such as vials, ladders, simple chairs, cannon cameras, and water guns are not allowed inside and outside the zone.\n' +
      '• You cannot bring in your bag in the zone.\n' +
      '• Failure to comply with the student council sanctions may result in confiscation and exit.\n' +
      '※ If you find items that are prohibited from being carried or used, they will be confiscated and disposed of.\n' +
      '※ We ask for your cooperation for a pleasant and safe event.',
    date: '2026.05.15',
    isNew: false,
    isImportant: false,
    category: '장소',
    category_en: 'Etc.',
  },
  {
    id: 7,
    title: '우천 시 공연 관람 안전 수칙',
    title_en: 'Rainy Day Performance Safety Guidelines',
    content:
      '[항대존 입장 안내]\n' +
      '• 팔찌가 훼손된 경우 항대존 입장불가합니다.\n' +
      '• 우비는 개별 지참 부탁드립니다.\n' +
      '• 안전을 위해 서두르거나 뛰지 마시고 천천히 입장하시기 바랍니다.\n' +
      '\n' +
      '[공연 관람 안내]\n' +
      '• 대운동장 내에서는 우산 사용을 제한합니다. 안전을 위해 우비 사용을 부탁드립니다.\n' +
      '• 빗물에 젖은 전자기기로 인해 감전사고가 일어날 수 있으니 주의해 주시기 바랍니다.\n' +
      '• 빗물에 바닥이 미끄러울 수 있으니 주의해 주시기 바랍니다.',
    content_en:
      '[KAU-Zone Entry]\n' +
      '• Entry is not allowed if your wristband is damaged.\n' +
      '• Please bring your own raincoat.\n' +
      '• For your safety, please walk slowly and do not rush or run when entering.\n' +
      '\n' +
      '[Performance Viewing]\n' +
      '• Umbrellas are restricted inside the main field. Please use a raincoat for safety.\n' +
      '• Wet electronic devices may cause electric shock — please handle with care.\n' +
      '• The ground may be slippery due to rain — please watch your step.',
    date: '2026.05.16',
    isNew: true,
    isImportant: true,
    category: '공연',
    category_en: 'Performance',
  },
];
