import logo from '../assets/logo.png';

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
    room: string;
    booth: string;
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

export const CATEGORIES = ['전체', '학과', '동아리', '중앙단위'];

export const dummyBooths: BoothData[] = [
    {
        id: 101,
        name: '총학생회',
        name_en: 'Student Council',
        category: '중앙단위',
        room: '',
        booth: '[1일차] D-1 [2일차] A-2,A-3\n [3일차] A-2',
        description: '총학생회 부스',
        description_en: 'Student Council Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/students.png',
        images: [logo],
        insta: '@kau_students',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '[총학 미니게임]\n' +
            '1. 준비된 타이머로 5:52초를 맞춰라!\n' +
            '5:52초를 맞추는 사람에겐 에어팟 4가 증정됩니다!\n' +
            '1등이 여러명일 경우 데스매치 진행 예정입니다.\n' +
            '\n' +
            '2. 돌려돌려돌림판!\n' +
            '돌림판을 돌려 다양한 선물 받아가세요!\n' +
            '\n' +
            '1등상품: 배달의 민족 5만원권\n' +
            '2등상품: 야구복\n' +
            '3등상품: 마하 키캡 키링\n' +
            '\n' +
            '[총학 굿즈]\n' +
            '타투스티커부터 반다나, 슬로건, 짐색, 야구복까지! 청운이 준비한 굿즈 구경하세요ᐠ( ᐢ ⩊ ᐢ )ᐟ\n' +
            '\n' +
            '[팔찌 배부]\n' +
            '19, 20일 오전 10시! 총학생회 자체 제작 웹사이트에서 티켓팅을 통해 팔찌 티켓팅하세요!',
        introduction_en: '[Student Council Mini Games]\n' +
            '1. Stop the Timer at 5.52 Seconds!\n' +
            'Hit exactly 5.52 seconds and win AirPods 4!\n' +
            'If there are multiple winners, a final showdown will decide the winner.\n' +
            '\n' +
            '2. Spin & Win!\n' +
            'Spin the wheel and get various prizes!\n' +
            '1st Prize: ₩50,000 Baemin Gift Voucher\n' +
            '2nd Prize: Baseball Jersey\n' +
            '3rd Prize: Maha Keycap Keyring\n' +
            '\n' +
            '[Student Council Goods]\n' +
            'From tattoo stickers and bandanas to slogans, gym sacks, and baseball jerseys!\n' +
            'Come check out the goods prepared by Cheongwoon ᐠ( ᐢ ⩊ ᐢ )ᐟ\n' +
            '\n' +
            '[Wristband Distribution]\n' +
            'May 19 & 20 at 10 AM!\n' +
            'Reserve your wristband through the Student Council\'s official ticketing website!',
        menu: [
            {
                id: 101,
                name: '미니게임(1판)',
                name_en: 'Mini Game - 1 Round',
                price: '1,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/students.png',
            },
            {
                id: 102,
                name: '미니게임(6판)',
                name_en: 'Mini Game - 6 Round',
                price: '5,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/students.png',
            },
        ],
        account: '우리은행 1005-004-149548 한국항공대 총학',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/student.jpeg'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/student.png',
    },
    {
        id: 102,
        name: '학생복지위원회',
        name_en: 'Student Welfare Committee',
        category: '중앙단위',
        room: '',
        booth: '[1일차] E-1 [3일차] A-1',
        description: '학생복지위원회 부스',
        description_en: 'Student Welfare Committee Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/hakbok.png',
        images: [],
        insta: '@kau_hakbok',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '소개글\n' +
            '- 시원한 소프트아이스크림과 짜릿한 다트 게임의 만남!\n' +
            '- 달콤한 아이스크림을 먹으며 당신의 운을 시험해 보세요!\n' +
            '\n' +
            '방법\n' +
            '1. 아이스크림 주문 (초코쉘 선택 가능)\n' +
            '2. 판 선택 후 다트 투척! (구매 시 기회 1번)\n' +
            '🛡️ 평화의 판: 시리얼 등 바삭한 토핑 100% 보장\n' +
            '🎲 도박의 판: 달콤한 벌꿀집 등의 토핑 당첨 혹은 가격 2배/양 절반 등의 짜릿한 복불복\n' +
            '\n' +
            '기타\n' +
            '- 학생복지위원회 인스타 팔로우 시 기회 +1번 더!\n' +
            '- 다트 기권 시에도 기본 초코 시럽 제공!\n' +
            '- 100% 랜덤 진행 (다트판은 가려져 있습니다)\n' +
            '- 토핑은 상황에 따라 변경될 수 있습니다.\n',
        introduction_en: '[About]\n' +
            'Cool soft ice cream meets an exciting dart challenge!\n' +
            'Enjoy sweet ice cream while testing your luck!\n' +
            '\n' +
            '[How to Play]\n' +
            '1. Order ice cream (chocolate shell option available)\n' +
            '2. Choose a board and throw the dart! (1 try per purchase)\n' +
            '🛡️ Peace Board: 100% guaranteed crunchy toppings like cereal\n' +
            '🎲 Gamble Board: Win sweet honeycomb toppings, or face double price/half portion in a thrilling game of luck!\n' +
            '\n' +
            '[Extra Info]\n' +
            '- Follow the Student Welfare Committee Instagram for 1 extra dart throw!\n' +
            '- Even if you skip the dart, you still get basic chocolate syrup!\n' +
            '- 100% random (dart board is covered)\n' +
            '- Toppings may vary depending on the situation.',
        menu: [
            {
                id: 201,
                name: '소프트아이스크림(+초코쉘, 다트 도전권)',
                name_en: 'Soft Ice Cream (+ Choco Shell, Dart Challenge Ticket)',
                price: '3,500원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/hakbok_1.png',
            },
        ],
        account: '카카오뱅크 79420857129 심소진',
        poster: [
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/hakbok_1.jpg',
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/hakbok_2.jpg',
        ],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/hakbok.jpg',
    },
    {
        id: 103,
        name: '항공운항학과',
        name_en: 'Dept. of Aeronautical Science and Flight Operations',
        category: '학과',
        room: '',
        booth: '[1일차] B-1 [3일차] B-4',
        description: '항공운항학과 부스️',
        description_en: 'Dept. of Aeronautical Science and Flight Operations Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/pilot.jpg',
        images: [],
        insta: '@kau_pilot',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '✈️ [항공운항학과] GATE 26 특별 탑승 안내\n' +
            '\n' +
            '"Ladies and gentlemen, welcome aboard."\n' +
            '\n' +
            '축제의 하늘로 이륙할 준비 되셨습니까? 항공운항학과가 준비한 GATE 26 부스에서 여러분을 위한 특별한 비행 서비스가 시작됩니다. 지금 바로 탑승해 주세요.\n' +
            '\n' +
            '🎲 In-Flight Entertainment (게임 안내)\n' +
            '비행의 무료함을 달래줄 짜릿한 기내 엔터테인먼트가 준비되어 있습니다.\n' +
            '*   BJ021 BLACKJACK: 승부사, 오늘의 행운 주인공은 누구일까요?\n' +
            '*   BB007 BEAN BAG: 정밀한 조종 실력을 뽐내보세요! 과녁을 향해 빈백을 던져 점수를 획득하세요.\n' +
            '*   DC666 DICE GAME: 주사위에 모든 것을 맡기는 긴장감 넘치는 베팅 타임!\n' +
            '\n' +
            '🍢 Special In-Flight Meal (메뉴 안내)\n' +
            '최고의 맛을 자랑하는 항공운항학과 전용 기내식을 소개합니다.\n' +
            '*   FD001 닭꼬치: 노릇노릇하게 구워진 든든한 에너지원 (3,500원)\n' +
            '*   FD002 아이스티: 상큼하고 시원하게 갈증을 해소해 줄 비행 필수 음료 (2,000원)\n' +
            '*   FD003 SET MENU: 닭꼬치와 아이스티를 한 번에! 가장 합리적인 선택 (5,000원)\n' +
            '\n' +
            '---\n' +
            '\n' +
            '💳 Flight Check-in (이용 안내)\n' +
            '*   탑승 게이트: 축제 마당 내 GATE 26 (항공운항학과 부스)\n' +
            '*   항공권 결제(계좌): 국민은행 948702-00-469978 (나건)\n' +
            '\n' +
            '"We hope you enjoy your flight with us. Thank you."\n' +
            '저희 항공운항학과 크루는 여러분이 가장 즐거운 비행을 경험하실 수 있도록 최선을 다하겠습니다. GATE 26에서 뵙겠습니다! 👨‍✈️👩‍✈️',
        introduction_en: '✈️ [Dept. of Aeronautical Science and Flight Operations] GATE 26 Special Boarding\n' +
            '\n' +
            '"Ladies and gentlemen, welcome aboard."\n' +
            '\n' +
            'Are you ready to take off into the festival sky? Special flight services await you at the GATE 26 booth prepared by the Dept. of Aeronautical Science and Flight Operations. Please board now.\n' +
            '\n' +
            '🎲 In-Flight Entertainment\n' +
            '* BJ021 BLACKJACK: Who\'s the lucky one today?\n' +
            '* BB007 BEAN BAG: Show off your precision! Throw the bean bag at the target to score points.\n' +
            '* DC666 DICE GAME: A thrilling betting round where you leave it all to the dice!\n' +
            '\n' +
            '🍢 Special In-Flight Meal\n' +
            '* FD001 Chicken Skewer: A hearty energy boost, perfectly grilled. (3,500 KRW)\n' +
            '* FD002 Iced Tea: A refreshing drink to quench your thirst. (2,000 KRW)\n' +
            '* FD003 SET MENU: Chicken Skewer + Iced Tea combo! The best value choice. (5,000 KRW)\n' +
            '\n' +
            '💳 Flight Check-in\n' +
            '* Boarding Gate: GATE 26 (Dept. of Aeronautical Science and Flight Operations Booth)\n' +
            '* Payment: Kookmin Bank 948702-00-469978 (Na Geon)\n' +
            '\n' +
            '"We hope you enjoy your flight with us. Thank you."',
        menu: [
            {
                id: 301,
                name: '블랙 잭',
                name_en: 'Black Jack',
                price: '1,000원 ~ 5,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/pilot_1.png',
            },
            {
                id: 302,
                name: '주사위 굴리기',
                name_en: 'Dice Roll',
                price: '1,000원 ~ 5,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/pilot_2.png',
            },
            {
                id: 303,
                name: 'bean bag 넣기',
                name_en: 'Bean Bag Throw',
                price: '2,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/pilot_3.png',
            },
            {
                id: 304,
                name: '닭꼬치',
                name_en: 'Chicken Skewer',
                price: '3,500원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/pilot_4.png',
            },
            {
                id: 305,
                name: '아이스티',
                name_en: 'Iced Tea',
                price: '2,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/pilot_5.png',
            },
            {
                id: 306,
                name: '닭꼬치 + 아이스티',
                name_en: 'Chicken Skewer + Iced Tea',
                price: '5,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/pilot_6.png',
            },
        ],
        account: 'kb 국민은행 948702-00-469978 나건',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/pilot_1.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/pilot.jpg',
    },
    {
        id: 104,
        name: '경영학과',
        name_en: 'Department of Business Administration',
        category: '학과',
        room: '',
        booth: '[1일차] B-2 [3일차] D-1',
        description: '경영학과 부스',
        description_en: 'Department of Business Administration Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/business.jpeg',
        images: [],
        insta: '@kau_officialbm',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '💚 케론별에서 지구 정복하러 왔슴다! 💚\n' +
            '\n' +
            '경영 마당사업 부스에 오면~\n' +
            '두근두근 소개팅도 하고!\n' +
            '왁뿌볼 폭탄 던지기 미션도 하고!\n' +
            '시원한 블루레모네이드도 마실 수 있슴다!!✨\n' +
            '\n' +
            '행운의 뽑기와 추억 인증샷까지 준비 완료!\n' +
            '오늘만큼은 지구인이 아니라 케론인처럼 놀아보라구~!! 🛸💥 ',
        introduction_en: '💚 We came from Planet Keron to conquer Earth! 💚\n' +
    '\n' +
    'Visit the Business Administration booth and—\n' +
    'Go on a blind date!\n' +
    'Take on the Wax Ball Bomb Throwing mission!\n' +
    'Drink refreshing Blue Lemonade!!\n' +
    '\n' +
    'Lucky draws and memorable photo ops are ready too!\n' +
    'Just for today, play like a Keronian, not an Earthling~!! 🛸💥',
        menu: [
            {
                id: 401,
                name: '[1일차] 키워드 소개팅 넣기/뽑기',
                name_en: '[Day 1] Keyword Blind Date Entry / Draw',
                price: '각각 2,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/business_123.jpeg',
            },
            {
                id: 403,
                name: '[1일차] 키워드 소개팅 넣기+뽑기',
                name_en: '[Day 1] Keyword Blind Date Entry + Draw',
                price: '3,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/business_123.jpeg',
            },
            {
                id: 404,
                name: '[3일차] 내친구를소개합니다? 붙이기/떼기',
                name_en: '[Day 3] "Let Me Introduce My Friend" Sticking / Peeling off',
                price: '각각 2,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/business_123.jpeg',
            },
            {
                id: 406,
                name: '[3일차] 내친구를소개합니다? 붙이기+떼기',
                name_en: '[Day 3] "Let Me Introduce My Friend" Sticking + Peeling off',
                price: '3,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/business_123.jpeg',
            },
            {
                id: 407,
                name: '코어 왁뿌볼',
                name_en: 'Core Wax Play Ball',
                price: '3,500원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/business_4.jpeg',
            },
            {
                id: 408,
                name: '블루레몬에이드',
                name_en: 'Blue Lemonade',
                price: '2,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/business_5.jpeg',
            },
            {
                id: 409,
                name: '행운의 복권',
                name_en: 'Lucky Draw',
                price: '1,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/business_6.jpeg',
            },
            {
                id: 410,
                name: '디카',
                name_en: 'Digital Camera',
                price: '1,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/business_7.jpeg',
            },
        ],
        account: '토스뱅크 1002-3813-1944 김민주',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/business.jpeg'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/business.jpeg',
    },
    {
        id: 105,
        name: '스마트드론공학과',
        name_en: 'Department of Smart Drone Engineering',
        category: '학과',
        room: '',
        booth: '[1일차] C-3 [3일차] B-1',
        description: '스마트드론공학과 부스',
        description_en: 'Department of Smart Drone Engineering Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/drone.jpg',
        images: [],
        insta: '@kau_drone_engineering',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '- 못박기 챌린지\n' +
            '가격 : 2000원\n' +
            '게임 설명 : \n' +
            '1) 성공 기준 : 정해진 횟수 내에 못을 나무판에 완전히 박으면 성공\n' +
            '2) 기회 제공 : 남성 3회 / 여성 4회 타격 기회 부여\n' +
            '3) 성공 보상 : 배달의 민족 1만 원 상품권 즉시 증정\n' +
            '4) 재도전 규칙 : \n' +
            '(1) 성공 시 : 재도전 불가능\n' +
            '(2) 실패 시 : 재도전 가능 (단, 기존 못을 제거하고 새 못으로 처음부터 다시 시작)\n' +
            '5) 실패 기준 : 타격 횟수 초과 또는 못이 휘어버릴 경우\n' +
            '\n' +
            '- 얼박사\n' +
            '가격 : 2000원\n' +
            '얼음 + 박카스 + 사이다를 섞은 시원하고 맛있는 피로회복제\n' +
            '\n' +
            '- 스모어 쿠키\n' +
            '가격 : 3개 2000원\n' +
            '바삭하고 담백한 크래커 위에 진한 누텔라와 쫀득한 마시멜로우를 얹었습니다. \n' +
            '한 입에 쏙 들어가는 기분 좋은 달콤함으로 가볍게 당 충전하고 가세요.',
        introduction_en: 'Nail Hammering Challenge\n' +
            'Price: 2,000 KRW\n' +
            'Game Rules:\n' +
            '1. Success: Fully hammer the nail into the wood within the given number of hits\n' +
            '2. Chances: Male players get 3 hits / Female players get 4 hits\n' +
            '3. Success reward: Instant ₩10,000 Baemin gift voucher\n' +
            '4. Retry rules: Success = no retry / Failure = retry allowed (start over with a new nail)\n' +
            '5. Failure: Exceeding hit count or nail bending\n' +
            '\n' +
            'Bacchus Ice Soda\n' +
            'Price: 2,000 KRW\n' +
            'A refreshing mix of ice, Bacchus energy drink, and cider.\n' +
            '\n' +
            'S\'more Cookie\n' +
            'Price: 2,000 KRW (3 pcs)\n' +
            'Crispy crackers topped with rich Nutella and chewy marshmallow.\n' +
            'A bite-sized sweet treat to recharge your energy!',
        menu: [
            { id: 501, name: '못박기 게임', name_en: 'Nail Hammering Game', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/drone_1.png' },
            { id: 502, name: '얼박사', name_en: 'Bacchus Ice Soda', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/drone_2.png' },
            { id: 503, name: '스모어 쿠키 3개', name_en: 'Smore Cookie (3 pcs)', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/drone_3.png' },
        ],
        account: '우리은행 1002166097983 반재민',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/drone.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/drone.png',
    },
    {
        id: 106,
        name: '항공교통물류학부',
        name_en: 'School of Air Transportation and Logistics',
        category: '학과',
        room: '',
        booth: '[1일차] B-3 [3일차] D-2',
        description: '항공교통물류학부 부스',
        description_en: 'School of Air Transportation and Logistics Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/attl.png',
        images: [],
        insta: '@kau_attl',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '🎯 놀거리 부스: 한판 붙자! 스트레스 타파 존\n' +
            '• 종이컵 양궁 & 통아저씨: 당신의 손끝에 운명을 맡겨라! 쫄깃한 긴장감, 컵은 날리고 아저씨는 튀어 오릅니다!\n' +
            '• 반응속도 & 펀치기계: 내 안에 잠든 야수를 깨워라! 빛보다 빠른 손놀림과 묵직한 한 방으로 서열 정리 끝.\n' +
            '• 추억의 뽑기판: 인생은 한 방! 판을 뒤집는 순간, 대박 경품의 주인공은 바로 당신입니다.\n' +
            '\n' +
            '🍞 1일차 먹거리: 달콤 짭짤! 갓성비 브런치 카페\n' +
            '• 허니브레드 & 다방커피: 달콤한 빵과 진한 커피의 환상 조합! 세트로 즐기면 단돈 5,000원의 행복\n' +
            '• 티코 소금빵: 겉바속촉의 정석! 짭조름한 매력에 빠지면 헤어 나올 수 없어요.\n' +
            '\n' +
            '🍕 3일차 먹거리: 천국의 맛! 피자 파티 레스토랑\n' +
            '• 코스트코 피자 + 콜라: 압도적 크기, 확실한 맛! 피콜 조합 4,000원이면 점심 고민 해결입니다.\n' +
            '• 소시지 : 육즙 팡팡! 피자만으론 아쉽다면 뽀득뽀득 소시지 하나 추가요~\n' +
            '• 청포도 에이드: 상큼함이 팡팡! 갈증을 한 번에 날려버릴 시원한 청포도의 유혹',
        introduction_en: '🎯 Game Booth: Let\'s Fight! Stress Relief Zone\n' +
            '• Cup Archery & Pop-Up Pirate: Leave your fate to your fingertips!\n' +
            '• Reaction Speed & Punch Machine: Awaken the beast within! Quick hands and a heavy hit.\n' +
            '• Retro Lucky Draw: Life is all or nothing!\n' +
            '\n' +
            '🍞 Day 1 Food: Sweet & Salty Budget Brunch Cafe\n' +
            '• Honey Bread & Dabang Coffee: Sweet bread + rich coffee combo! Only 5,000 KRW for the set!\n' +
            '• Tico Salt Bread: The definition of crispy outside, chewy inside!\n' +
            '\n' +
            '🍕 Day 3 Food: Heaven\'s Flavor Pizza Party Restaurant\n' +
            '• Costco Pizza + Cola: Massive size, definite taste! Pizza + Cola combo for 4,000 KRW!\n' +
            '• Sausage: Juicy and satisfying!\n' +
            '• Green Grape Ade: Refreshingly sweet and cool!',
        menu: [
            { id: 601, name: '[1일차] 허니브레드+다방커피', name_en: '[Day 1] Honey Bread & Dabang Coffee', price: '5,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_1.jpeg' },
            { id: 602, name: '[1일차] 티코 소금빵+다방커피', name_en: '[Day 1] Tico Salt Bread + Traditional Coffee', price: '4,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_2.jpeg' },
            { id: 603, name: '[1일차] 허니브레드', name_en: '[Day 1] Honey Bread', price: '4,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_3.jpeg' },
            { id: 604, name: '[1일차] 티코 소금빵', name_en: '[Day 1] Tico Salt Bread', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_4.jpeg' },
            { id: 605, name: '[1일차] 다방커피', name_en: '[Day 1] Dabang Coffee', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_5.jpeg' },
            { id: 606, name: '[1일차] 양궁', name_en: '[Day 1] Archery', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_6.png' },
            { id: 607, name: '[1일차] 통아저씨', name_en: '[Day 1] Pop-Up Pirate', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_7.jpeg' },
            { id: 608, name: '[1일차] 뽑기판', name_en: '[Day 1] Lucky Draw', price: '1,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_8.jpeg' },
            { id: 609, name: '[3일차] 코스트코피자+콜라', name_en: '[Day 3] Costco Pizza + Cola', price: '4,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_9.jpeg' },
            { id: 610, name: '[3일차] 소시지', name_en: '[Day 3] Sausage', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_10.jpeg' },
            { id: 611, name: '[3일차] 청포도에이드', name_en: '[Day 3] Green Grape Ade', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_11.jpeg' },
            { id: 612, name: '[3일차] 펀치기계', name_en: '[Day 3] Punch Machine', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_12.jpeg' },
            { id: 613, name: '[3일차] 반응속도게임', name_en: '[Day 3] Reaction Speed Game', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_13.png' },
            { id: 614, name: '[3일차] 뽑기판', name_en: '[Day 3] Lucky Draw', price: '1,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/attl_14.jpeg' },
        ],
        account: '카카오뱅크 3333-33-8430708 성유현',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/attl_1.png',
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/attl_2.png',
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/attl_3.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/attl.png',
    },
    {
        id: 107,
        name: '항공우주 및 기계공학부',
        name_en: 'School of Aerospace and Mechanical Engineering',
        category: '학과',
        room: '',
        booth: '[1일차] C-2 [3일차] B-3',
        description: '항공우주 및 기계공학부 부스',
        description_en: 'School of Aerospace and Mechanical Engineering Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/mecha.png',
        images: [],
        insta: '@kau_mecha',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '📍 [1일차]\n' +
            '✨ 타투 스티커: 물만 묻히면 끝! 축제 분위기 제대로 낼 수 있는 필수 아이템.\n' +
            '🎯 사격: 스트레스 타파! 친구와  같이 플레이 가능한 2인 사격 시스템 완비!\n' +
            '🎟️ 추억의 종이 뽑기: \'똑\' 뜯어서 확인하는 긴장감! 다양한 경품이 기다리고 있습니다!\n' +
            '☁️ 솜사탕 만들기: 달콤함 치사량! 내가 직접 돌려 만드는 몽글몽글 솜사탕. 만드는 재미부터 먹는 재미까지 한 번에 즐기세요~\n' +
            '\n' +
            '📍 [3일차]\n' +
            '✨ 타투 스티커: 물만 묻히면 끝! 축제 분위기 제대로 낼 수 있는 필수 아이템\n' +
            '🎴 딱지치기: 본격 추억 소환! 왕년에 딱지 좀 쳐봤다면 주저 말고 도전하세요. 진정한 승부의 세계!!\n' +
            '🍞 계란 설탕 토스트: 계란 물 입혀 노릇하게 구운 식빵 위에 설탕 가득! 추억의 맛을 경험해보세요!\n' +
            '🍹 시원 에이드: 얼음 가득 컵에 시럽과 청량한 사이다의 만남! 축제 열기를 한방에 날려줄 갓성비 에이드!\n',
        introduction_en: '📍 [Day 1]\n' +
            '✨ Tattoo Stickers: Just add water and you\'re done!\n' +
            '🎯 Shooting Game: Stress reliever! 2-player shooting system available!\n' +
            '🎟️ Retro Paper Draw: Snap and reveal the prize!\n' +
            '☁️ Cotton Candy Making: Dangerously sweet! Spin it yourself and enjoy.\n' +
            '\n' +
            '📍 [Day 3]\n' +
            '✨ Tattoo Stickers: Just add water and you\'re done!\n' +
            '🎴 Ttakji Game: A real trip down memory lane!\n' +
            '🍞 Egg Sugar Toast: Sweet, golden-fried bread!\n' +
            '🍹 Refreshing Ade: Ice-cold syrup + soda!',
        menu: [
            { id: 701, name: '[1일차] 타투 스티커', name_en: '[Day 1] Tattoo Stickers', price: '500원 ~ 5,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/mecha.png' },
            { id: 702, name: '[1일차] 사격(1게임)', name_en: '[Day 1] Shooting Game (1 try)', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/mecha.png'  },
            { id: 703, name: '[1일차] 추억의 종이 뽑기', name_en: '[Day 1] Retro Paper Draw', price: '500원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/mecha.png'  },
            { id: 704, name: '[1일차] 솜사탕 만들기', name_en: '[Day 1] Cotton Candy Making', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/mecha.png'  },
            { id: 705, name: '[3일차] 타투 스티커', name_en: '[Day 3] Tattoo Stickers', price: '500원 ~ 5,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/mecha.png'  },
            { id: 706, name: '[3일차] 딱지치기', name_en: '[Day 3] Ttakji Game', price: '1,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/mecha.png'  },
            { id: 707, name: '[3일차] 계란설탕토스트 판매', name_en: '[Day 3] Egg Sugar Toast', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/mecha.png'  },
            { id: 708, name: '[3일차] 에이드/아이스티', name_en: '[Day 3] Ade / Iced Tea', price: '2,500원/2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/mecha.png'  },
        ],
        account: '토스뱅크 100240417451 송정우',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/mecha.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/mecha.png',
    },
    {
        id: 108,
        name: '소프트웨어학과',
        name_en: 'Department of Software',
        category: '학과',
        room: '',
        booth: '[1일차] A-2 [3일차] C-1',
        description: '소프트웨어학과 부스',
        description_en: 'Department of Software Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/software.jpg',
        images: [],
        insta: '@kau_software',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '🎨 대충 캐리커쳐\n' +
            '\n' +
            '짧은 시간 안에 특징을 살려 그려드리는 캐리커쳐 부스입니다.\n' +
            '본인 사진은 물론, 반려동물 사진 등을 가져와도 제작 가능합니다.\n' +
            '\n' +
            '재미와 추억을 위한 콘텐츠이므로 완성도를 보장하기는 어렵습니다.\n' +
            '\n' +
            '[이용 금액]\n' +
            '30초 캐리커쳐 : 1,000원\n' +
            '2분 캐리커쳐 : 1,500원\n' +
            '\n' +
            '────────────────────\n' +
            '\n' +
            '🧀 칠리스 치즈스틱\n' +
            '\n' +
            'SNS에서 유행한 칠리스 치즈스틱을 즐길 수 있는 먹거리 부스입니다.\n' +
            '치즈스틱과 함께 랜치소스, 불닭소스, 양념치킨소스 등이 제공됩니다.\n' +
            '\n' +
            '[판매 금액]\n' +
            '1개 : 4,000원\n' +
            '2개 : 7,500원\n' +
            '\n' +
            '────────────────────\n' +
            '\n' +
            '🌈 대충 퍼스널컬러\n' +
            '\n' +
            '퍼스널컬러 진단키트를 활용해 나에게 어울리는 색을 찾아보는 체험 부스입니다.\n' +
            '진단 후에는 퍼스널컬러 이수증도 받을 수 있습니다.\n' +
            '\n' +
            '전문 진단이 아닌 축제용 체험 콘텐츠입니다.\n' +
            '\n' +
            '[진단비]\n' +
            '1인 : 2,500원\n' +
            '\n' +
            '────────────────────\n' +
            '\n' +
            '⌨️ 타자왕 결정전\n' +
            '\n' +
            '애국가 대본을 활용해 빠르고 정확한 타자 실력을 겨루는 게임 부스입니다.\n' +
            '축제 최고의 타자왕에 도전해 보세요.\n' +
            '\n' +
            '1인당 2번의 기회가 주어지며, 가장 좋은 기록으로 순위가 결정됩니다.\n' +
            '참가상이 지급되며, 상위 1·2·3등에게는 특별 상품이 지급됩니다.\n' +
            '\n' +
            '정확도 95% 이상일 때만 기록이 인정됩니다.\n' +
            '\n' +
            '[참가비]\n' +
            '1인 : 1,000원',
        introduction_en: '1. Quick Caricature\n' +
            'A fun caricature booth where we capture your unique features in a short time.\n' +
            'Bring your own photo or even your pet\'s photo!\n' +
            'Note: This is a fun experience, not a professional portrait.\n' +
            'Prices: 30-sec: 1,000 KRW / 2-min: 1,500 KRW\n' +
            '\n' +
            '2. Chili\'s Cheese Sticks\n' +
            'SNS-famous Chili\'s Cheese Sticks at our food booth!\n' +
            'Served with ranch, buldak, and yangnyeom chicken sauce.\n' +
            'Prices: 1 pc: 4,000 KRW / 2 pcs: 7,500 KRW\n' +
            '\n' +
            '3. Quick Personal Color Test\n' +
            'Find your color using a personal color diagnosis kit!\n' +
            'Get a color certificate after the diagnosis.\n' +
            'Note: Festival experience only, not a professional diagnosis.\n' +
            'Price: 1 person: 2,500 KRW\n' +
            '\n' +
            '4. Typing King Showdown\n' +
            'Compete in a typing speed contest using the national anthem script!\n' +
            'Challenge for the top typing speed of the festival!\n' +
            '2 tries per person, best score counts. Participation prize given; special prizes for top 3!\n' +
            'Only records with 95%+ accuracy count.\n' +
            'Price: 1 person: 1,000 KRW',
        menu: [
            {
                id: 801,
                name: '대충 퍼스널컬러',
                name_en: 'Quick Personal Color Test',
                price: '2,500원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/software_1.jpg',
            },
            {
                id: 802,
                name: '대충 캐리커처(30초)',
                name_en: 'Quick Caricature (30 sec)',
                price: '1,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/software_12.png',
            },
            {
                id: 803,
                name: '대충 캐리커처(2분)',
                name_en: 'Quick Caricature (2 min)',
                price: '1,500원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/software_12.png',
            },
            {
                id: 804,
                name: '칠리스 치즈스틱 1개',
                name_en: 'Chilis Cheese Sticks (1 pc)',
                price: '4,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/software_45.jpg',
            },
            {
                id: 805,
                name: '칠리스 치즈스틱 2개',
                name_en: 'Chilis Cheese Sticks (2 pcs)',
                price: '7,500원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/software_45.jpg',
            },
            { id: 806, name: '타자게임', name_en: 'Typing Game', price: '1,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/software_6.png' },
        ],
        account: '카카오뱅크 7942-24-86004 김지현',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/software_1.png', 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/software_2.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/software.jpeg',
    },
    {
        id: 109,
        name: '항공전자정보공학부',
        name_en: 'School of Avionics and Information Engineering',
        category: '학과',
        room: '',
        booth: '[1일차] A-3 [3일차] B-2',
        description: '항공전자정보공학부 부스',
        description_en: 'School of Avionics and Information Engineering Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/eie.png',
        images: [],
        insta: '@kau_eie',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '✈️ 항공전자정보공학부 마당사업 — 1일차\n' +
            '💘 당연시 (당신도 연애를 시작할 때)\n' +
            '남/녀 두 개의 판에 내 성격과 매력을 직접 적어 붙이고, 마음에 드는 이성의 판에서 연락처를 가져가는 설레는 소개팅 부스예요.\n' +
            '🎰 추억의 뽑기\n' +
            '숫자 위에 막대를 올리고 원하는 번호를 뽑아봐요! 당첨되면 원하는 선물을 얻을 수 있어요 🎁\n' +
            '🍧 추억의 간식\n' +
            '슬러시, 한입핫도그, 콜팝까지! 걸어다니며 손에 들고 즐기기 딱 좋은 추억의 그 맛이에요 🌭\n' +
            '🌀 우주 왁뿌볼\n' +
            '손으로 쥐고 으깨고 또 으깨는 쫀득한 왁뿌볼! 스트레스 풀기엔 이게 최고예요 💥\n' +
            '\n' +
            '✈️ 항공전자정보공학부 마당사업 — 3일차\n' +
            '💌 캡랜소 (캡슐 랜덤 소개팅)\n' +
            '내 연락처를 포스트잇에 적어 캡슐에 담고, 랜덤으로 이성의 캡슐을 뽑아가는 두근두근 소개팅! 누가 나를 뽑아갈지는 아무도 몰라요 🎲\n' +
            '🔮 타로 (연애운 · 오늘의 운세)\n' +
            '펄스 학생회가 직접 봐주는 타로! 오늘 연애운이 궁금하다면 망설이지 말고 찾아오세요 ✨\n' +
            '⚡ 순발력 게임 (봉잡기)\n' +
            '위에서 봉이 랜덤으로 떨어지면 반사신경으로 잡아라! 단순한데 자꾸 하고 싶어지는 중독 게임 🎯 친구들끼리 내기로 경쟁을 해봐도 좋아요\n' +
            '🥤 시원한 에이드\n' +
            '돌아다니다 더우면 여기서 잠깐 쉬어가요! 두 가지 색깔의 에이드라 맛도 좋고 사진도 잘나와요!',
        introduction_en: '✈️ School of Avionics and Information Engineering Festival — Day 1\n💘 Dangyeonsi (Start Your Love Story): Write your personality and charms on a board, then pick up contact info from someone you like!\n🎰 Retro Lucky Draw: Place the stick on a number and draw your prize!\n🍧 Retro Snacks: Slush, One-Bite Hot Dog, Cup Cola & Popcorn Chicken!\n🌀 Cosmic Wax Play Ball: Squeeze, squish, and destress!\n\n✈️ School of Avionics and Information Engineering Festival — Day 3\n💌 Capsule Random Blind Date: Write your contact info in a capsule, then draw a random match!\n🔮 Tarot (Love Fortune · Daily Fortune): Get your tarot read by our club members!\n⚡ Quick Reflex Game (Catch the Stick): Pure reaction-based fun!\n🥤 Refreshing Ade: Two colors, great taste, and great for photos!',
        menu: [
            { id: 901, name: '[1일차] 당연시 ', name_en: '[Day 1] "Dangyeonsi" Date Matching', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_1.jpeg' },
            { id: 902, name: '[1일차] 당연시+슬러시', name_en: '[Day 1] "Dangyeonsi" + Slush', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_1.jpeg' },
            { id: 903, name: '[1일차] 추억의 뽑기', name_en: '[Day 1] Retro Lucky Draw', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_3.jpeg' },
            { id: 904, name: '[1일차] 추억의 간식 - 슬러시', name_en: '[Day 1] Retro Snacks - Slush', price: '1,500원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_4.jpeg' },
            {
                id: 905,
                name: '[1일차] 추억의 간식 - 한입핫도그',
                name_en: '[Day 1] Retro Snacks - One-Bite Hot Dog',
                price: '1,500원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/eie.png'
            },
            { id: 906, name: '[1일차] 추억의 간식 - 콜팝', name_en: '[Day 1] Retro Snacks - Cup Cola & Popcorn Chicken', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/eie.png' },
            { id: 907, name: '[1일차] 우주왁뿌볼', name_en: '[Day 1] Cosmic Wax Play Ball', price: '3,500원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_7.jpeg' },
            { id: 908, name: '[3일차] 캡랜소 1회 넣고 1회 뽑기', name_en: '[Day 3] Capsule Random Blind Date - 1 Entry + 1 Draw', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_8.jpeg' },
            { id: 909, name: '[3일차] 캡랜소 + 음료', name_en: '[Day 3] Capsule Random Blind Date + Drink', price: '4,000원' , image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_8.jpeg'},
            { id: 910, name: '[3일차] 캡슐 추가뽑기', name_en: '[Day 3] Capsule Extra Draw', price: '1,500원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_8.jpeg' },
            {
                id: 911,
                name: '[3일차] 엉터리 타로(연애운, 오늘의 운세) 1회',
                name_en: '[Day 3] Tarot (Love Fortune · Daily Fortune) 1 Time',
                price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_11.jpeg'
            },
            { id: 912, name: '[3일차] 순발력 게임 - 봉잡기', name_en: '[Day 3] Quick Reflex Game - Catch the Stick', price: '1,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_5.jpeg' },
            { id: 913, name: '[3일차] 시원한 음료', name_en: '[Day 3] Refreshing Drink', price: '2,000원' , image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/eie_13.jpeg'},
        ],
        account: '카카오뱅크 3333-34-8245343 이익수',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/eie.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/eie.jpg',
    },
    {
        id: 110,
        name: 'AI자율주행시스템공학과',
        name_en: 'Department of Autonomous Systems Engineering',
        category: '학과',
        room: '',
        booth: '[1일차] A-1 [3일차] C-2',
        description: 'AI자율주행시스템공학과 부스',
        description_en: 'Department of Autonomous Systems Engineering Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/ai.png',
        images: [],
        insta: '@kau_autonomous_vehicle',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '[1일차]\n' +
            '\n' +
            '에행 주식 거래소\n' +
            '\n' +
            '"가장 높은 곳에 오르는 순간, 당신은 타겟이 됩니다."\n' +
            '단순히 투자하고 기다리는 지루한 시장이 아닙니다. 이곳은 30분마다 판이 뒤집히고, 1위의 왕관이 독이 되어 돌아오는 하이 리스크 하이 리턴의 전장입니다. 끝까지 살아남아 최후의 승자가 될 준비가 되셨습니까?\n' +
            '⏱️ 시장 운영 시간\n' +
            '• 개장: 오전 10시\n' +
            '• 종장: 오후 4시 (16:00)\n' +
            '• 갱신 주기: 매 30분마다 (주가 변동 및 페널티 적용)\n' +
            '⚖️ 시장의 절대 법칙\n' +
            '1.   투자한 만큼 오릅니다\n' +
            '• 여러분의 자본이 곧 주가입니다. 공격적인 투자는 주가를 견인하지만, 동시에 다른 투자자들의 견제를 부릅니다.\n' +
            '2.   1위의 저주 (The 30% Cut)\n' +
            '• 매 30분마다 시장은 가장 가치가 높은 주식을 심판합니다. 현재 1위 주식은 즉시 가치의 30%가 차감됩니다. 너무 일찍 정상에 오르는 것은 파멸의 지름길일지도 모릅니다.\n' +
            '3.   최후의 승자 (Double Return)\n' +
            '• 오후 4시 정각, 종장 시점에 가장 높은 주가를 기록한 종목의 투자자들에게는 원금의 2배(200%)를 상환해 드립니다.\n' +
            '\n' +
            '자세한 룰은 부스에서 \n' +
            '확인 바랍니다\n' +
            '\n' +
            '[3일차] 리얼 반동 사격장\n' +
            '내용: 가스건(GBB, Gas Blowback)을 이용한 타겟 정밀 사격 체험\n' +
            '🎯 사격 종목 • M249 경기관총(연사 체험)\n' +
            '• 소총 사격 (20발)\n' +
            '• 권총 사격 (20발)\n' +
            '• 경품 응모 (전동건)\n' +
            ' (신속 사격 챌린지)\n' +
            '🏆 경품 안내\n' +
            '• 1등 상품: 5만 원 상당의 경품 증정\n' +
            '⚙️ 장비 및 안전 안내\n' +
            '• 리얼리티: 실제 총기의 작동 방식과 반동을 그대로 구현한 가스식 장비(GBB) 운용\n' +
            '• 안전 관리: 운영 요원의 통제하에 안전 장구(고글 등)를 반드시 착용한 후 실시\n' +
            '\n' +
            '• M249 경기관총(연사 체험): 3,000원\n' +
            '• 소총 사격 (20발): 2,000원\n' +
            '• 권총 사격 (20발): 1,000원\n' +
            '• 경품 응모 (전동건): 5,000원',
        introduction_en: '[Day 1] Aehyang Stock Exchange\n' +
            '"The moment you rise to the top, you become the target."\n' +
            'This is not a boring market where you just invest and wait. Here, the board flips every 30 minutes, and the crown of No.1 comes back as poison. Are you ready to be the last survivor?\n' +
            '\n' +
            '⏱️ Market Hours: Open 10:00 AM – Close 4:00 PM (16:00)\n' +
            '📊 Refresh cycle: Every 30 minutes (price fluctuation & penalty applied)\n' +
            '\n' +
            '⚖️ Absolute Market Rules:\n' +
            '1. Your capital = your stock price. Aggressive investment drives up the price but invites competition.\n' +
            '2. The 30% Cut: Every 30 minutes, the top stock loses 30% of its value.\n' +
            '3. Double Return: At 4:00 PM, investors holding the highest stock get 2x their investment back.\n' +
            '\n' +
            '[Day 3] Real Recoil Shooting Range\n' +
            'Gas-powered gun (GBB) target shooting experience\n' +
            '🎯 Shooting Events: M249 Light Machine Gun / Rifle (20 rounds) / Handgun (20 rounds) / Prize Entry (Rapid Fire Challenge)\n' +
            '🏆 1st Prize: ₩50,000 worth of prizes\n' +
            '⚙️ Safety: All participants must wear safety gear under staff supervision.',
        menu: [
            { id: 1001, name: 'M249 경기관총(연사 체험)', name_en: 'M249 Light Machine Gun (Full-Auto Shooting Experience)', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/ai.png'},
            { id: 1003, name: '저격소총 사격(20발)', name_en: 'Sniper Rifle Shooting (20 Rounds)', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/ai.png' },
            { id: 1004, name: '소총 사격(20발)', name_en: 'Rifle Shooting (20 Rounds)', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/ai.png' },
            { id: 1005, name: '권총 사격(20발)', name_en: 'Handgun Shooting (20 Rounds)', price: '1,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/ai.png' },
            { id: 1006, name: '경품 응모(전동건) 신속 사격 챌린지', name_en: 'Prize Entry (Airsoft Gun) Rapid Shooting Challenge', price: '5,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/ai.png' },
        ],
        account: '카카오뱅크 79422493957 카카오뱅크 허가연',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/ai_1.png',
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/ai_2.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/ai.JPG',
    },
    {
        id: 111,
        name: '자유전공학부',
        name_en: 'School of Open Major',
        category: '학과',
        room: '',
        booth: '[1일차] E-2 [3일차] D-3',
        description: '자유전공학부 부스',
        description_en: 'School of Open Major Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/open.png',
        images: [],
        insta: '@kau_openmajor',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '🔥✨무한자전 마당사업✨🔥\n' +
            '\n' +
            '토스트 먹고, 미숫가루 마시고, 미니게임도 하자!\n' +
            '\n' +
            '든든한 추억의 옛날 할머니 토스트🥪\n' +
            '시원하고 고소한 미숫가루🥤\n' +
            '오락실 농구게임, 명예의 전당에 도전해봐!🏀\n' +
            '인간 슬롯 머신으로 행운의 잭팟을!🎰🍀',
        introduction_en: '🔥✨ Infinite Spin Yard Project ✨🔥\n' +
            'Eat toast, drink misutgaru, and play mini-games!\n' +
            '\n' +
            'Hearty classic grandma toast 🥪\n' +
            'Refreshing and nutty misutgaru 🥤\n' +
            'Arcade basketball game - challenge the hall of fame! 🏀\n' +
            'Human slot machine - hit the lucky jackpot! 🎰🍀',
        menu: [
            { id: 1101, name: '오락실 농구게임', name_en: 'Arcade Basketball Game', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/open.png' },
            { id: 1102, name: '인간 슬롯 머신(1회)', name_en: 'Human Slot Machine (1 Round)', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/open.png'  },
            { id: 1103, name: '인간 슬롯 머신(3회)', name_en: 'Human Slot Machine (3 Rounds)', price: '5,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/open.png'  },
            { id: 1104, name: '옛날 할머니 토스트', name_en: 'Classic Grandma Toast', price: '4,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/open.png'  },
            { id: 1105, name: '미숫가루', name_en: 'Misutgaru (Traditional Grain Drink)', price: '3,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/open.png'  },
            { id: 1106, name: '옛날 할머니 토스트 & 미숫가루 세트', name_en: 'Classic Grandma Toast & Misutgaru Set', price: '6,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/open.png'  },
            { id: 1107, name: '[3일차] 추억의 종이뽑기', name_en: '[Day 3] Retro Paper Draw', price: '1,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/open.png'  },
        ],
        account: '카카오뱅크 3333-36-4920068 김기현',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/open.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/open.jpeg',
    },
    {
        id: 112,
        name: '신소재공학과',
        name_en: 'Department of Materials Science and Engineering',
        category: '학과',
        room: '',
        booth: '[1일차] C-1 [3일차] D-4',
        description: '신소재공학과 부스',
        description_en: 'Department of Materials Science and Engineering Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/material.png',
        images: [],
        insta: '@kau_materials',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '신소재공학과 마당사업 부스 OPEN ✨\n' +
            '\n' +
            '올해 축제, 그냥 지나칠 예정이신가요? 👀\n' +
            '달콤한 인연을 만날 수 있는 사탕소개팅부터\n' +
            '긴장간 넘치는 손바닥 끈끈이 게임,\n' +
            '친구와 함께하는 탁구공 챌린지,\n' +
            '그리고 자존심을 건 턱걸이 대결까지🔥\n' +
            '신나게 놀다 지친 순간엔 시원한 슬러시 한잔!❄️🍻\n' +
            '\n' +
            '먹고, 놀고, 웃고, 추억까지 만들어 갈 수 있는 공간!\n' +
            '친구와 함께 와도, 혼자 와도 즐길 수 있는\n' +
            '신소재공학과만의 축제 부스로 놀러오세요✨',
        introduction_en: 'Materials Science & Engineering Booth OPEN ✨\n' +
            '\n' +
            '🍭 Sweet Candy Blind Date\n' +
            '✋ Sticky Hand Game\n' +
            '🏓 Ping-Pong Ball Toss\n' +
            '💪 Pull-up Battle\n' +
            '❄️ Refreshing Slush when you need a break!\n' +
            '\n' +
            'A space to eat, play, laugh, and make memories!\n' +
            'Come enjoy our festival booth, fun whether you come with friends or solo!',
        menu: [
            { id: 1201, name: '사탕 소개팅', name_en: 'Candy Blind Date', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/material_1.png' },
            { id: 1202, name: '슬러시', name_en: 'Slush', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/material_2.png' },
            { id: 1203, name: '끈끈이주걱', name_en: 'Sticky Hand', price: '1,000원~5,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/material_3.png' },
            { id: 1204, name: '탁구공 주고받기', name_en: 'Ping-Pong Ball Toss', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/material_4.png' },
            { id: 1205, name: '턱걸이', name_en: 'Pull-up', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/material_5.png' },
        ],
        account: '카카오뱅크 3333359030646 심지은',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/material.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/material.png',
    },
    {
        id: 113,
        name: 'KAUVOY',
        name_en: 'KAUVOY',
        category: '동아리',
        room: '',
        booth: '[2일차] B-1',
        description: 'KAUVOY 부스',
        description_en: 'KAUVOY Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/kauvoy.png',
        images: [],
        insta: '@kauvoy',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '🏁 RC카 챔피언십\n' +
            '한국항공대학교 자작자동차 동아리 KAUVOY에서 운영하는 RC카 경주 체험 부스입니다.\n' +
            '\n' +
            '2인 방문 시 1:1 대결전, 1인 방문 시 타임어택 랭킹전에 참여하실 수 있습니다.\n' +
            '\n' +
            '참가비 1,000원으로 체험 가능하며, 대결 승리자에게는 즉석 경품을, 타임어택 랭킹 최종 1위에게는 배달의민족 5만원 쿠폰을 증정합니다.\n' +
            '\n' +
            'RC카 챔피언십의 우승자는 누가 될 것인가?!',
        introduction_en: 'RC Car Championship\n' +
            'This is an RC car racing experience booth run by KAUVOY, the custom car club at Korea Aerospace University.\n' +
            '\n' +
            '2 players: 1v1 race / 1 player: time attack ranking contest\n' +
            '\n' +
            'Entry fee: 1,000 KRW. Win the match and get an instant prize! The #1 time attack champion wins a 50,000 KRW Baemin coupon.\n' +
            '\n' +
            'Who will be the RC Car Championship winner?!',
        menu: [
            {
                id: 1301,
                name: '1:1레이싱',
                name_en: '1v1 Racing',
                price: '인당 1,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/kauvoy_1.png',
            },
            {
                id: 1302,
                name: '전체 랭킹전(1회)',
                name_en: 'Overall Rankings (1 Round)',
                price: '1,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/kauvoy_2.png',
            },
        ],
        account: '토스뱅크 1002-2678-9922 이지수',
        poster: [
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/kauvoy_1.png',
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/kauvoy_2.png',
        ],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/kauvoy.png',
    },
    {
        id: 114,
        name: 'ESC',
        name_en: 'ESC',
        category: '동아리',
        room: '',
        booth: '[2일차] B-2',
        description: 'ESC 부스',
        description_en: 'ESC Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/esc.jpg',
        images: [],
        insta: '@kau_esc',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '⚡️ESC 찌릿찌릿 소개팅\n' +
            '키워드 소개팅 🏷️: 내 키워드 쓰고, 상대 키워드 뽑아가기\n' +
            '블라인드 소개팅 👤: 부스 뒤에서 얼굴 모른 채 3분간 설레는 대화하기\n' +
            '청포도 에이드 🥤: 시원하게 스트레스 풀기',
        introduction_en: '⚡️ESC Electric Blind Date\n' +
            'Keyword Dating 🏷️: Write your keyword, draw a match\'s keyword!\n' +
            'Blind Dating 👤: 3 minutes of exciting conversation behind the booth without seeing each other!\n' +
            'Green Grape Ade 🥤: Cool off and relieve stress!',
        menu: [
            { id: 1401, name: '키워드 소개팅', name_en: 'Keyword Dating', price: '2,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/esc.jpg' },
            { id: 1402, name: '블라인드 소개팅', name_en: 'Blind Dating', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/esc.jpg'  },
            { id: 1403, name: '청포도 에이드', name_en: 'Green Grape Ade', price: '3,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/esc.jpg'  },
            { id: 1404, name: '키워드 + 청포도', name_en: 'Keyword + Green Grape Ade', price: '4,500원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/esc.jpg'  },
            { id: 1405, name: '블라인드 + 청포도', name_en: 'Blind + Green Grape Ade', price: '5,500원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/esc.jpg'  },
            { id: 1406, name: '키워드 + 블라인드 + 에이드', name_en: 'Keyword + Blind + Ade', price: '7,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/esc.jpg'  },
        ],
        account: '토스뱅크 1002-3790-0547 최태영',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/esc_1.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/esc.jpg',
    },
    {
        id: 115,
        name: '재징유',
        name_en: 'Jazzingyou',
        category: '동아리',
        room: '',
        booth: '[2일차] B-3',
        description: '재징유 부스',
        description_en: 'Jazzingyou Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/jazz.jpg',
        images: [],
        insta: '@kau.jazzingyou',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '안녕하세요! 항공대 유일무이 재즈 동아리, 🎷재징유🎺입니다.\n' +
            '설레이는 2026 활공제를 맞아 마당사업을 준비했습니다!\n' +
            '\n' +
            '🎼 EVENT\n' +
            '• 음악 랜덤 소개팅 ~사랑은 징유를 타고~ (1,000₩)\n' +
            '\n' +
            '부스 게시판에 본인의 ‘인생곡’을 적어주세요. 누군가 그대의 곡을 선택한다면.. 매칭 성공!\n' +
            '\n' +
            '\n' +
            '🍜 MENU\n' +
            '• 콘치즈 불닭볶음면(4,500₩)\n' +
            '• 불닭볶음면(3,500₩)\n' +
            '• 아이스크림(1,200₩)\n' +
            '- 바닐라, 초코, 딸기 세가지 모두!\n' +
            '\n' +
            '매콤 고소한 콘치즈불닭과 달콤한 아이스크림을 준비했습니다! 부스에 들러 뜨거운 축제의 열기를 잠시 달래보세요!\n' +
            '\n' +
            '\n' +
            '학관 앞, 재징유 부스에서 만나요!',
        introduction_en: 'Hello! We are Jazzingyou, the one and only jazz club at KAU.\n' +
            'To celebrate the exciting 2026 Hwalgongje, we have prepared a yard project!\n' +
            '\n' +
            '🎼 EVENT\n' +
            '• Random Music Blind Date ~Love Rides on Jazz~ (1,000 KRW)\n' +
            'Write your "song of your life" on the board. If someone picks your song... it\'s a match!\n' +
            '\n' +
            '🍜 MENU\n' +
            '• Corn Cheese Buldak Noodles (4,500 KRW)\n' +
            '• Buldak Noodles (3,500 KRW)\n' +
            '• Ice Cream (1,200 KRW) - Vanilla, Chocolate, Strawberry!\n' +
            '\n' +
            'We have spicy Corn Cheese Buldak and sweet ice cream ready! Stop by the Jazzingyou booth to cool off from the festival heat!',
        menu: [
            {
                id: 1501,
                name: '음악 랜덤 소개팅~ 사랑은 징유를 타고~',
                name_en: 'Random Music Blind Date ~Love Rides on Jazz~',
                price: '1,000원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/jazz.jpg'
            },
            { id: 1502, name: '콘치즈 불닭볶음면', name_en: 'Corn Cheese Buldak Noodles', price: '4,500원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/jazz.jpg'},
            { id: 1503, name: '불닭볶음면', name_en: 'Buldak Noodles', price: '3,500원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/jazz.jpg' },
            { id: 1504, name: '아이스크림', name_en: 'Ice Cream', price: '1,200원', image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/jazz.jpg' },
        ],
        account: '카카오뱅크 3333257475193 김규리',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/jazz.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/jazz.png',
    },
    {
        id: 116,
        name: '픽쳐(FICTURE)',
        name_en: 'FICTURE',
        category: '동아리',
        room: '',
        booth: '[2일차] B-4',
        description: '픽쳐 부스',
        description_en: 'FICTURE Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/ficture.JPG',
        images: [],
        insta: '@kau_ficture',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '안녕하세요, 한국항공대학교 유일무이 사진동아리 픽쳐입니다! 이번 픽쳐 마당사업에는 크게 4가지 항목이 있는데요, 폴라로이드 사진 촬영, 사진 엽서•필름 키링 판매, 그리고 꽝이 없는 추억의 뽑기판까지 준비하였습니다! 동기나 선후배들과 함께 방문하여 많은 추억 만들어가셨으면 좋겠습니다! 많은 관심 부탁드립니다!',
        introduction_en: 'Hello, we are FICTURE, the one and only photography club at Korea Aerospace University! Our booth features 4 main activities: Polaroid photo shoots, photo postcard & film keyring sales, and a guaranteed-prize lucky draw! We hope you visit with classmates, seniors, or juniors and create lots of memories together!',
        menu: [
            {
                id: 1601,
                name: '폴라로이드 사진 즉석 촬영',
                name_en: 'Instant Polaroid Photo Shoot',
                price: '2,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/ficture_1.PNG',
            },
            {
                id: 1602,
                name: '학교 사진 및 사진전 엽서(1장)',
                name_en: 'Campus & Exhibition Photo Postcard (1 Sheet)',
                price: '1,500원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/ficture_23.PNG',
            },
            {
                id: 1603,
                name: '학교 사진 및 사진전 엽서(3장 묶음)',
                name_en: 'Campus & Exhibition Photo Postcards (Set of 3)',
                price: '4,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/ficture_23.PNG',
            },
            {
                id: 1604,
                name: '추억의 뽑기판',
                name_en: 'Lucky Draw Board',
                price: '1,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/ficture_4.PNG',
            },
            {
                id: 1605,
                name: '필름 키링',
                name_en: 'Film Keyring',
                price: '3,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/ficture_5.PNG',
            },
        ],
        account: '카카오뱅크 3333360084037 김예찬',
        poster: [
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/ficture_1.PNG',
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/ficture_2.PNG',
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/ficture_3.PNG',
        ],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/ficture.JPG',
    },
    {
        id: 117,
        name: '에어락',
        name_en: 'Aeorock',
        category: '동아리',
        room: '',
        booth: '[2일차] C-1',
        description: '에어락 부스',
        description_en: 'AeroRock Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/aerock.jpg',
        images: [],
        insta: '@kau_aerock',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '한국항공대학교 락밴드 동아리 에어락이 축제 부스를 운영합니다!\n' +
            '든든하게 즐길 수 있는 대패삼겹숙주볶음과 시원한 에이드 음료를 판매합니다.\n' +
            '축제 즐기다 출출할 때, 에어락 부스에 들러 맛있는 한 끼 하고 가세요!\n' +
            '많은 관심과 방문 부탁드립니다!',
        introduction_en: 'AeroRock, the rock band club at KAU, is running a festival booth!\n' +
            'We are serving hearty stir-fried thin pork belly with bean sprouts and refreshing ade drinks.\n' +
            'When you\'re feeling peckish at the festival, stop by the AeroRock booth for a delicious meal!\n' +
            'We look forward to your visit!',
        menu: [
            {
                id: 1701,
                name: '대패삼겹숙주볶음',
                name_en: 'Stir-Fried Thinly Sliced Pork Belly with Bean Sprouts',
                price: '8,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/aerock_1.png',
            },
            {
                id: 1702,
                name: '자몽허니블랙티',
                name_en: 'Honey Grapefruit Black Tea',
                price: '3,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/aerock_2.jpeg',
            },
            {
                id: 1703,
                name: '망고에이드',
                name_en: 'Mango Ade',
                price: '3,000원',
                image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/aerock_3.png',
            },
            { id: 1704, name: '대패 + 음료', name_en: 'Pork Belly + Drink Combo', price: '10,000원' },
        ],
        account: '우리은행 1002866055463 정주연',
        poster: ['https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/aerock_1.png'],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/aerock.jpeg',
    },
    {
        id: 118,
        name: '이웃사촌부',
        name_en: 'Friendly neighborhood',
        category: '동아리',
        room: '',
        booth: '[2일차] C-2',
        description: '이웃사촌부 부스',
        description_en: 'Friendly Neighbourhood Booth',
        logo_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png',
        images: [],
        insta: '@kau_fn_arumi',
        operatingTime: '10:00 ~ 16:00',
        introduction:
            '일본의 다양한 식료품을 저렴하게 파는 기업, 돈키호테에서 영감을 받아 다양한 일본 과자와 음료수, 그리고 일본식 주먹밥인 오니기리를 판매합니다!',
        introduction_en: 'Inspired by Don Quijote, the famous discount store in Japan, we sell a variety of Japanese snacks, beverages, and onigiri (Japanese rice balls)!',
        menu: [
            { id: 1801, name: '라무네 1병', name_en: 'Ramune (1 Bottle)', price: '1,500원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1802, name: '펩시 생콜라 600ml', name_en: 'Pepsi Raw Cola 600ml', price: '2,500원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1803, name: '가루비 포테이토칩 노리시오', name_en: 'Calbee Potato Chips (Seaweed & Salt)', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1804, name: '가루비 포테이토 우스시오', name_en: 'Calbee Potato Chips (Lightly Salted)', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1805, name: '야가이 오야츠 칼파스(개당)', name_en: 'Yagai Oyatsu Calpas Dry Sausage (Per Piece)', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1806, name: '코코로 포도', name_en: 'Kororo Gummy (Grape)', price: '1,500원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1807, name: '코코로 백도', name_en: 'Kororo Gummy (Peach)', price: '1,500원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1808, name: '칼피스 민티아', name_en: 'Calpis Mintia Mints', price: '1,500원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1809, name: '가루비 자가리코 감자버터', name_en: 'Calbee Jagarico (Potato Butter)', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1810, name: '가루비 자가리코 샐러드', name_en: 'Calbee Jagarico (Salad Flavor)', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1811, name: '가루비 명란버터', name_en: 'Calbee Jagarico (Mentaiko Butter)', price: '2,000원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
            { id: 1812, name: '타케노코 53봉지(개당)', name_en: 'Takenoko Biscuit (Per Pack)', price: '1,000원' ,image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png'},
            { id: 1813, name: '오니기리', name_en: 'Onigiri (Japanese Rice Ball)', price: '2,500원',image: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/department_logo/arumi.png' },
        ],
        account: '카카오뱅크 3333364206941 이성민',
        poster: [
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/arumi_1.png',
            'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/arumi_2.png',
        ],
        qr_img: 'https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/qrcode/arumi.jpeg',
    },
];
