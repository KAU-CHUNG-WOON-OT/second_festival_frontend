import type { MenuItem } from "../components/common/MenuList";
import palbongImage from "../assets/foodtruck/palbong.jpeg";
import seonmulImage from "../assets/foodtruck/seonmul.jpeg";
import taekineImage from "../assets/foodtruck/taekine.jpeg";
import geeksImage from "../assets/foodtruck/geeks.jpeg";
import misikImage from "../assets/foodtruck/misik.jpeg";
import insaengImage from "../assets/foodtruck/insaeng.jpeg";
import oreoImage from "../assets/foodtruck/oreo.jpeg";
import songhwaImage from "../assets/foodtruck/songhwa.jpeg";
import palbongFriedImage from "../assets/foodtruck/menu/palbong_fried.jpeg";
import palbongYangnyeomImage from "../assets/foodtruck/menu/palbong_yangnyeom.jpeg";
import seonmulSkewerImage from "../assets/foodtruck/menu/seonmul_skewer.jpeg";
import taekineYakisobaImage from "../assets/foodtruck/menu/taekine_yakisoba.jpeg";
import geeksCheeseImage from "../assets/foodtruck/menu/geeks_cheese.jpeg";
import geeksPepperoniImage from "../assets/foodtruck/menu/geeks_pepperoni.jpeg";
import geeksBulgogiImage from "../assets/foodtruck/menu/geeks_bulgogi.jpeg";
import misikPadthaiImage from "../assets/foodtruck/menu/misik_padthai.jpeg";
import insaengBeefImage from "../assets/foodtruck/menu/insaeng_beef.jpeg";
import insaengShrimpImage from "../assets/foodtruck/menu/insaeng_shrimp.jpeg";
import oreoChurrosImage from "../assets/foodtruck/menu/oreo_churros.jpeg";
import oreoIcecreamImage from "../assets/foodtruck/menu/oreo_icecream.jpeg";

export interface FoodTruckData {
    id: number;
    name: string;
    category: string;

    description: string;
    description_en: string;
    logo_img: string;
    tags: string[];
    tags_en: string[];
    operatingTime: string;
    operatingDays: string;
    menu: MenuItem[];
    account: string;
    poster: string;
    qr_img?: string;
}

export const TRUCK_CATEGORIES = ["전체", "분식", "디저트", "식사"];

// 2026 가을축제 푸드트럭 리스트 (F&B 담당 ㈜인사이더컴퍼니 자료). 대표 사진은 트럭 전체가 나온 사진
// TODO: 운영 시간은 자료에 없어 지난 축제 값 그대로 둠
export const dummyTrucks: FoodTruckData[] = [
    {
        id: 301, name: "미스터 팔봉이쿡", category: "분식",         description: "겉바속촉 닭강정 (사이즈업 400g)", description_en: "Crispy sweet & spicy fried chicken (size-up 400g)",
        logo_img: palbongImage, tags: ["#닭강정"], tags_en: ["#Dakgangjeong(Sweet&SpicyFriedChicken)"],
        operatingTime: "12:00 ~ 22:00", operatingDays: "10월 28일",
        menu: [
            { id: 3101, name: "후라이드 닭강정 + 슈프림소스", name_en: "fried chicken + supreme sauce", price: "12,000원", image: palbongFriedImage },
            { id: 3102, name: "양념 닭강정 + 치폴레소스", name_en: "sweet & spicy fried chicken + chipotle sauce", price: "12,000원", image: palbongYangnyeomImage },
        ],
        account: "", poster: palbongImage,
    },
    {
        id: 302, name: "선물 트럭", category: "분식",         description: "직화닭꼬치", description_en: "Flame-grilled chicken skewers",
        logo_img: seonmulImage, tags: ["#닭꼬치"], tags_en: ["#ChickenSkewers"],
        operatingTime: "12:00 ~ 22:00", operatingDays: "10월 28일",
        menu: [
            { id: 3201, name: "직화닭꼬치 (트러플 소금맛)", name_en: "grilled chicken skewer (truffle salt)", price: "5,000원", image: seonmulSkewerImage },
            { id: 3202, name: "직화닭꼬치 (매운소스)", name_en: "grilled chicken skewer (spicy sauce)", price: "5,000원", image: seonmulSkewerImage },
            { id: 3203, name: "직화닭꼬치 (데리야끼소스)", name_en: "grilled chicken skewer (teriyaki sauce)", price: "5,000원", image: seonmulSkewerImage },
        ],
        account: "", poster: seonmulImage,
    },
    {
        id: 303, name: "택이네", category: "식사",         description: "철판의 힘, 야끼소바와 소바빵", description_en: "Teppan-grilled yakisoba and yakisoba bread",
        logo_img: taekineImage, tags: ["#야끼소바", "#소바빵"], tags_en: ["#Yakisoba", "#YakisobaBread"],
        operatingTime: "12:00 ~ 22:00", operatingDays: "10월 28일",
        menu: [
            { id: 3301, name: "야끼소바", name_en: "yakisoba(Japanese stir-fried noodles)", price: "10,000원", image: taekineYakisobaImage },
            { id: 3302, name: "소바빵", name_en: "yakisoba bread", price: "7,000원" },
        ],
        account: "", poster: taekineImage,
    },
    {
        id: 304, name: "긱스푸드", category: "식사",         description: "수제 반죽에 토핑 듬뿍 담은 피자", description_en: "Handmade dough pizza loaded with toppings",
        logo_img: geeksImage, tags: ["#피자"], tags_en: ["#pizza"],
        operatingTime: "12:00 ~ 22:00", operatingDays: "10월 28일",
        menu: [
            { id: 3401, name: "치즈피자", name_en: "cheese pizza", price: "13,000원", image: geeksCheeseImage },
            { id: 3402, name: "페퍼로니피자", name_en: "pepperoni pizza", price: "15,000원", image: geeksPepperoniImage },
            { id: 3403, name: "연탄불고기피자", name_en: "charcoal bulgogi pizza", price: "17,000원", image: geeksBulgogiImage },
        ],
        account: "", poster: geeksImage,
    },
    {
        id: 305, name: "미식유랑단", category: "식사",         description: "팟타이", description_en: "Pad Thai",
        logo_img: misikImage, tags: ["#팟타이"], tags_en: ["#PadThai"],
        operatingTime: "12:00 ~ 22:00", operatingDays: "10월 28일",
        menu: [
            { id: 3501, name: "팟타이", name_en: "Pad Thai", price: "10,000원", image: misikPadthaiImage },
        ],
        account: "", poster: misikImage,
    },
    {
        id: 306, name: "인생초밥", category: "식사",         description: "한조각씩 수제로 최고의 맛집", description_en: "Handmade sushi, one piece at a time",
        logo_img: insaengImage, tags: ["#초밥"], tags_en: ["#sushi"],
        operatingTime: "12:00 ~ 22:00", operatingDays: "10월 28일",
        menu: [
            { id: 3601, name: "소고기 직화초밥(10p)", name_en: "grilled beef sushi(10p)", price: "10,000원", image: insaengBeefImage },
            { id: 3602, name: "핫칠리치즈새우초밥(10p)", name_en: "hot chilli cheese shrimp sushi(10p)", price: "10,000원", image: insaengShrimpImage },
            { id: 3603, name: "크림치즈새우초밥(10p)", name_en: "cream cheese shrimp sushi(10p)", price: "10,000원", image: insaengShrimpImage },
        ],
        account: "", poster: insaengImage,
    },
    {
        id: 307, name: "오레오", category: "디저트",         description: "오레오츄러스와 아이스크림", description_en: "Oreo churros and ice cream",
        logo_img: oreoImage, tags: ["#츄러스", "#아이스크림"], tags_en: ["#churros", "#IceCream"],
        operatingTime: "12:00 ~ 22:00", operatingDays: "10월 28일",
        menu: [
            { id: 3701, name: "오레오츄러스", name_en: "Oreo churros", price: "4,500원", image: oreoChurrosImage },
            { id: 3702, name: "아이스크림츄러스", name_en: "ice cream churros", price: "6,000원", image: oreoIcecreamImage },
        ],
        account: "", poster: oreoImage,
    },
    {
        id: 308, name: "송화식품", category: "분식",         description: "엄마손 분식 전문 차량", description_en: "Homestyle Korean street food",
        logo_img: songhwaImage, tags: ["#떡볶이", "#순대", "#튀김"], tags_en: ["#Tteokbokki", "#Sundae", "#Twigim(Deep-FriedFood)"],
        operatingTime: "12:00 ~ 22:00", operatingDays: "10월 28일",
        menu: [
            { id: 3801, name: "국물떡볶이", name_en: "soupy tteokbokki", price: "5,000원" },
            { id: 3802, name: "떡순범벅", name_en: "tteokbokki & sundae mix", price: "8,000원" },
            { id: 3803, name: "순대", name_en: "sundae(Korean blood sausage)", price: "5,000원" },
            { id: 3804, name: "모듬순대 (간포함)", name_en: "assorted sundae (with liver)", price: "7,000원" },
            { id: 3805, name: "반반스페셜", name_en: "half & half special", price: "10,000원" },
            { id: 3806, name: "떡튀순", name_en: "tteokbokki & deep-fried food & sundae", price: "12,000원" },
        ],
        account: "", poster: songhwaImage,
    },
];
