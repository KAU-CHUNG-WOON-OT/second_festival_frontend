export interface TimetableEvent {
    id: number;
    time: string;
    title: string;
    title_en: string;
    description: string;
    description_en: string;
    type: "EVENT";
    stage: string;
    stage_en: string;
    date: string;
    date_en: string;
    status: "SCHEDULED" | "ONGOING" | "DONE";
    songs?: string[];
}

export const DATE_TABS = ["5월 18일", "5월 19일", "5월 20일"];
export const DATE_TABS_EN = ["May 18", "May 19", "May 20"];

export const timetableEvents: Record<string, TimetableEvent[]> = {
    "5월 18일": [
        { id: 1, time: "10:00~16:00", title: "마당사업(학과)", title_en: "activity booth(department)", description: "학과가 운영하는 마당사업", description_en: "activity booth run by the department", type: "EVENT", stage: "대운동장", stage_en: "main sports field", date: "5월 18일", date_en: "May 18", status: "SCHEDULED" },
        { id: 2, time: "10:00~16:00", title: "DDC 진로 공감 한마당 행사", title_en: "DDC Career Exploration Fair", description: "DDC 진로 공감 한마당 행사", description_en: "DDC Career Exploration Fair", type: "EVENT", stage: "대운동장", stage_en: "main sports field", date: "5월 18일", date_en: "May 18", status: "SCHEDULED" },
        { id: 3, time: "18:00~21:50", title: "주점(학과)", title_en: "bar(department)", description: "학과가 운영하는 주점", description_en: "bars run by departments", type: "EVENT", stage: "학생회관(앞/뒤/옆)", stage_en: "student council building(front/back/side)", date: "5월 18일", date_en: "May 18", status: "SCHEDULED" },
        { id: 4, time: "22:00", title: "종료", title_en: "end", description: "종료", description_en: "end", type: "EVENT", stage: "-", stage_en: "-", date: "5월 18일", date_en: "May 18", status: "SCHEDULED" },
    ],
    "5월 19일": [
        { id: 5, time: "10:00~16:00", title: "마당사업(동아리)", title_en: "activity booth(school club)", description: "동아리가 운영하는 마당사업", description_en: "activity booth run by school clubs", type: "EVENT", stage: "학생회관 앞", stage_en: "in front of the student council building", date: "5월 19일", date_en: "May 19", status: "SCHEDULED" },
        { id: 6, time: "10:00~16:00", title: "제휴업체 부스", title_en: "booths of affiliated companies", description: "제휴업체 부스", description_en: "booths of affiliated companies", type: "EVENT", stage: "캠퍼스 일대", stage_en: "around the campus", date: "5월 19일", date_en: "May 19", status: "SCHEDULED" },
        { id: 7, time: "17:00~22:30", title: "무대 공연", title_en: "stage performance", description: "무대 공연", description_en: "stage performance", type: "EVENT", stage: "대운동장", stage_en: "main sports field", date: "5월 19일", date_en: "May 19", status: "SCHEDULED" },
        { id: 8, time: "18:00~21:50", title: "주점(푸드트럭)", title_en: "bar(food truck)", description: "푸드트럭 기반 주점", description_en: "food truck based bar", type: "EVENT", stage: "대운동장", stage_en: "main sports field", date: "5월 19일", date_en: "May 19", status: "SCHEDULED" },
        { id: 9, time: "22:30", title: "종료", title_en: "end", description: "종료", description_en: "end", type: "EVENT", stage: "-", stage_en: "-", date: "5월 19일", date_en: "May 19", status: "SCHEDULED" },
    ],
    "5월 20일": [
        { id: 10, time: "10:00~16:00", title: "마당사업(학과)", title_en: "activity booth(department)", description: "학과가 운영하는 마당사업", description_en: "activity booth run by the department", type: "EVENT", stage: "학생회관 앞", stage_en: "in front of the student council building", date: "5월 20일", date_en: "May 20", status: "SCHEDULED" },
        { id: 11, time: "10:00~16:00", title: "제휴업체 부스", title_en: "booth of an affiliated company", description: "제휴업체 부스", description_en: "booth of an affiliated company", type: "EVENT", stage: "캠퍼스 일대", stage_en: "around the campus", date: "5월 20일", date_en: "May 20", status: "SCHEDULED" },
        { id: 12, time: "17:00~21:50", title: "무대 공연", title_en: "stage performance", description: "무대 공연", description_en: "stage performance", type: "EVENT", stage: "대운동장", stage_en: "main sports field", date: "5월 20일", date_en: "May 20", status: "SCHEDULED" },
        { id: 13, time: "18:00~21:50", title: "주점(학과)", title_en: "bar(department)", description: "학과가 운영하는 주점", description_en: "bar run by department", type: "EVENT", stage: "대운동장", stage_en: "main sports field", date: "5월 20일", date_en: "May 20", status: "SCHEDULED" },
        { id: 14, time: "22:00", title: "종료", title_en: "end", description: "종료", description_en: "end", type: "EVENT", stage: "-", stage_en: "-", date: "5월 20일", date_en: "May 20", status: "SCHEDULED" },
    ],
};