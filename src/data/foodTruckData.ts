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
    operatingTime: string;
    operatingDays: string;
    menu: MenuItem[];
    account: string;
    poster: string;
    qr_img?: string;
}

export const TRUCK_CATEGORIES = ["전체", "분식", "디저트", "식사"];

// 푸드트럭은 추후 공개: 비워 두면 푸드트럭 화면에 '추후 공개 예정'만 보인다 (다시 채우면 배치도·검색·목록이 그대로 돌아옴)
export const dummyTrucks: FoodTruckData[] = [];
