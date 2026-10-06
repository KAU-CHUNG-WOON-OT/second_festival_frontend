import type { MenuItem } from "../components/common/MenuList";

export interface FoodTruckData {
    id: number;
    name: string;
    category: string;

    description: string;
    description_en: string;
    logo_img: string;
    tags: string[];
    tags_en: string[];
    likes: number;
    operatingTime: string;
    operatingDays: string;
    menu: MenuItem[];
    account: string;
    poster: string;
    qr_img?: string;
}

export const TRUCK_CATEGORIES = ["전체", "분식", "디저트", "식사"];

export const dummyTrucks: FoodTruckData[] = [
    {
        id: 301, name: "인사이더", category: "분식",         description: "타코야끼와 소떡소떡", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_1.png", tags: ["#타코야끼", "#소떡소떡"], tags_en: ["#Takokayki(OctopusBalls)", "#Sotteok(SausageAndRiceCakeSkewers)"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 3101, name: "타코야끼", name_en: "Takokayki(octopus balls)", price: "5,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_1.png" },
            { id: 3102, name: "소떡소떡", name_en: "Sotteok(sausage and rice cake skewers)", price: "5,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_2.png" },

        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_1.png",
    },
    {
        id: 302, name: "인생컴퍼니", category: "분식",         description: "닭꼬치와 염통꼬치", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_2.png", tags: ["#닭꼬치", "#염통꼬치"], tags_en: ["#churros", "#IceCream"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 3201, name: "닭꼬치", name_en: "chicken skewers", price: "5,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_34.png" },
            { id: 3202, name: "염통꼬치", name_en: "heart skewers", price: "5,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_34.png" },

        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_2.png",
    },
    {
        id: 303, name: "선물 트럭", category: "식사",         description: "불향 가득한 삼겹살말이", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_3.png", tags: ["#삼겹살말이"], tags_en: ["#GrilledPorkBellyRolls"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 3301, name: "삼겹팽이말이", name_en: "grilled pork belly & enoki mushroom rolls", price: "5,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_5.png" },
            { id: 3302, name: "삼겹김치말이", name_en: "grilled pork belly & kimchi rolls", price: "5,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_6.png" },

        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_3.png",
    },
    {
        id: 304, name: "미스터 팔봉이쿡", category: "분식",         description: "겉바속촉 닭강정", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_4.png", tags: ["#닭강정"], tags_en: ["#Sweet&Spicy FriedChicken"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 3401, name: "후라이드 닭강정", name_en: "fried chicken", price: "5,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_7.png" },
            { id: 3402, name: "양념 닭강정", name_en: "sweet & spicy fried chicken", price: "5,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_8.png" },

        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_4.png",
    },
    {
        id: 305, name: "인생초밥", category: "식사",         description: "한조각씩 수제로 최고의 맛집", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_5.png", tags: ["#초밥"], tags_en: ["#sushi"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 3501, name: "소고기직화초밥(10p)", name_en: "grilled beef sushi(10p)", price: "10,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_9.png" },
            { id: 3502, name: "핫칠리치즈새우초밥(10p)", name_en: "hot chilli cheese shrimp sushi(10p)", price: "10,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_1011.png" },
            { id: 3503, name: "크림치즈새우초밥(10p)", name_en: "cream cheese shrimp sushi(10p)", price: "10,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_1011.png" },

        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_5.png",
    },
    {
        id: 306, name: "미식 유랑단", category: "식사",         description: "팟타이", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_6.png", tags: ["#팟타이"], tags_en: ["#PadThai"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 3601, name: "팟타이", name_en: "Pad Thai", price: "10,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_12.png" },
        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_6.png",
    },
    {
        id: 307, name: "흥하리푸드", category: "식사",         description: "크림새우와 칠리새우", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_7.png", tags: ["#새우"], tags_en: ["#shrimp"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 3701, name: "크림새우", name_en: "shrimp with cream sauce", price: "10,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_13.png" },
            { id: 3702, name: "칠리새우", name_en: "shrimp with chilli sauce", price: "10,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_14.png" },

        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_7.png",
    },
    {
        id: 308, name: "파라다이스", category: "분식",         description: "떡튀순", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_8.png", tags: ["#떡튀순"], tags_en: ["#SpicyRiceCake&Deep-FriedFood&Sundae"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 3801, name: "떡튀순", name_en: "spicy rice cake & deep-fried food & sundae", price: "10,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_15.png" },
            { id: 3802, name: "콜팝", name_en: "cola & chicken nuggets", price: "6,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_16.png" },

        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_8.png",
    },
    {
        id: 309, name: "헬로우", category: "디저트",         description: "크레페", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_9.png", tags: ["#크레페"], tags_en: ["#crepe"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 3901, name: "크레페", name_en: "crepe", price: "7,000원 ~ 8,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_17.png" },
        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_9.png",
    },
    {
        id: 310, name: "오레오", category: "디저트",         description: "오레오츄러스와 아이스크림", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_10.png", tags: ["#츄러스", "#아이스크림"], tags_en: ["#churros", "#IceCream"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 31001, name: "오레오츄러스", name_en: "blank", price: "4,500원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_18.png" },
            { id: 31002, name: "아이스크림츄러스", name_en: "blank", price: "6,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_19.png" },

        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_10.png",
    },
    {
        id: 311, name: "홀리몰리", category: "식사",         description: "소고기/새우 야끼소바", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_11.png", tags: ["#야끼소바"], tags_en: ["yakisoba(Japanese stir-fried noodles)"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 31101, name: "소고기야끼소바", name_en: "beef yakisoba(Japanese stir-fried beef noodles)", price: "12,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_20.png" },
            { id: 31102, name: "새우야끼소바", name_en: "shrimp yakisoba(Japanese stir-fried shrimp noodles)", price: "12,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_21.png" },

        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_11.png",
    },
    {
        id: 312, name: "온더라디오", category: "디저트",         description: "음료", description_en: "blank",
        logo_img: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_12.png", tags: ["#커피", "#음료"], tags_en: ["#coffee", "#beverages"],
        likes: 12, operatingTime: "12:00 ~ 22:00", operatingDays: "Day 1, Day 2, Day 3",
        menu: [
            { id: 31201, name: "아메리카노", name_en: "americano", price: "4,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_22.png" },
            { id: 31202, name: "라떼", name_en: "latte", price: "4,500원 ~ 5,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_22.png" },
            { id: 31203, name: "에이드", name_en: "ade", price: "5,000원", image: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth_menu/truck_22.png" },
        ],
        account: "카카오뱅크 3333-12-3456789 김맛짱", poster: "https://cjddns-s3.s3.ap-northeast-2.amazonaws.com/booth/truck_12.png",
    },
];