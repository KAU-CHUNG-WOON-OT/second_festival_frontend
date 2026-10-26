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

// 연예인 공연은 공개 전까지 공연 정보에서 숨김. 공개할 때 true로 (홈 'Artist Line-up' 카드는 따로 항상 보임)
export const SHOW_CELEBRITY = true;

// 2026 가을축제 타임테이블 (무대 세팅 시간은 뺌)
const allPerformanceEvents: PerformanceData[] = [
    { id: 1, time: "16:00", title: "총학생회 행사", title_en: "Student Council Event", description: "총학생회 행사", description_en: "Student Council event", type: "EVENT", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 2, time: "16:20", title: "광대와 끼", title_en: "Gwangdae wa Kki", description: "동아리 공연", description_en: "Club performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 3, time: "16:40", title: "알피네", title_en: "Alpine", description: "동아리 공연", description_en: "Club performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 4, time: "17:00", title: "랩플레인", title_en: "Rapplane", description: "동아리 공연", description_en: "Club performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 5, time: "17:20", title: "도스", title_en: "DOS", description: "동아리 공연", description_en: "Club performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 6, time: "17:50", title: "줄울림", title_en: "Julullim", description: "동아리 공연", description_en: "Club performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 7, time: "18:10", title: "올뮤", title_en: "All About Music", description: "동아리 공연", description_en: "Club performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 8, time: "18:30", title: "에어락", title_en: "Aerock", description: "동아리 공연", description_en: "Club performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 9, time: "18:50", title: "우리부모", title_en: "Woo Boo", description: "동아리 공연", description_en: "Club performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 10, time: "19:10", title: "재징유", title_en: "Jazzing You", description: "동아리 공연", description_en: "Club performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 11, time: "19:30", title: "활주로", title_en: "Runway", description: "동아리 공연", description_en: "Club performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 12, time: "20:00", title: "연예인 공연", title_en: "Celebrity Performance", description: "연예인 공연", description_en: "Celebrity performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED", celebrity: true },
];

export const performanceEvents: PerformanceData[] = allPerformanceEvents.filter(
    (event) => SHOW_CELEBRITY || !event.celebrity,
);
