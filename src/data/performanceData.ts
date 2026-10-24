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
}

export const performanceEvents: PerformanceData[] = [
    { id: 1, time: "17:20", title: "총학생회 행사", title_en: "Student Council Event", description: "총학생회 행사", description_en: "Student Council event", type: "EVENT", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 2, time: "17:50", title: "활주로", title_en: "Runway", description: "밴드동아리 활주로", description_en: "Band club Runway", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 3, time: "18:10", title: "올뮤", title_en: "All About Music", description: "밴드동아리 올뮤", description_en: "Band club All About Music", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 4, time: "18:30", title: "에어락", title_en: "Aerock", description: "밴드동아리 에어락", description_en: "Band club Aerock", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 5, time: "19:10", title: "재징유", title_en: "Jazzing You", description: "밴드동아리 재징유", description_en: "Band club Jazzing You", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 6, time: "19:30", title: "우리부모", title_en: "Woo Boo", description: "밴드동아리 우리부모", description_en: "Band club Woo Boo", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 7, time: "19:50", title: "줄울림", title_en: "Julullim", description: "밴드동아리 줄울림", description_en: "Band club Julullim", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 8, time: "20:30", title: "연예인 공연", title_en: "Celebrity Performance", description: "연예인 공연", description_en: "Celebrity performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
];
