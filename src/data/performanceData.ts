export interface PerformanceData {
    id: number;
    time: string;
    title: string;
    title_en: string;
    description: string;
    description_en: string;
    type: "EVENT" | "PERFORMANCE" | "BREAKTIME";
    stage: string;
    stage_en: string;
    date: string;
    date_en: string;
    status: "SCHEDULED" | "ONGOING" | "DONE";
    songs?: string[];
    // 연예인 공연: SHOW_CELEBRITY가 false면 목록에서 숨긴다
    celebrity?: boolean;
}

// 연예인 라인업 공개 전까지 숨김 (홈 'Artist Line-up' 카드, 공연 정보의 연예인 공연). 공개할 때 true로
export const SHOW_CELEBRITY = false;

const allPerformanceEvents: PerformanceData[] = [
    { id: 1, time: "17:20", title: "총학생회 행사", title_en: "Student Council Event", description: "총학생회 행사", description_en: "Student Council event", type: "EVENT", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 2, time: "17:50", title: "활주로", title_en: "활주로", description: "밴드동아리 활주로", description_en: "Band club 활주로", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 3, time: "18:10", title: "올뮤", title_en: "올뮤", description: "밴드동아리 올뮤", description_en: "Band club 올뮤", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 4, time: "18:30", title: "에어락", title_en: "에어락", description: "밴드동아리 에어락", description_en: "Band club 에어락", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 5, time: "19:10", title: "재징유", title_en: "재징유", description: "밴드동아리 재징유", description_en: "Band club 재징유", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 6, time: "19:30", title: "우리부모", title_en: "우리부모", description: "밴드동아리 우리부모", description_en: "Band club 우리부모", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 7, time: "19:50", title: "줄울림", title_en: "줄울림", description: "밴드동아리 줄울림", description_en: "Band club 줄울림", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 8, time: "20:30", title: "연예인 공연", title_en: "Celebrity Performance", description: "연예인 공연", description_en: "Celebrity performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED", celebrity: true },
];

export const performanceEvents: PerformanceData[] = allPerformanceEvents.filter(
    (event) => SHOW_CELEBRITY || !event.celebrity,
);
