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

export const PERFORMANCE_DATE_TABS = ["5월 19일", "5월 20일"];
export const PERFORMANCE_DATE_TABS_EN = ["May 19", "May 20"];

export const performanceEvents: Record<string, PerformanceData[]> = {
    "5월 19일": [
        { id: 1, time: "17:20", title: "총학생회 행사", title_en: "student council event", description: "총학생회 행사", description_en: "student council event", type: "EVENT", stage: "메인무대", stage_en: "Main Stage", date: "5월 19일", date_en: "May 19", status: "SCHEDULED" },
        { id: 2, time: "17:50", title: "활주로", title_en: "kau_runway", description: "밴드동아리 활주로", description_en: "band club Runway", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "5월 19일", date_en: "May 19", status: "SCHEDULED", songs: ["Summer - The Volunteers", "Joke! - 새소년", "야경 - 터치드"] },
        { id: 3, time: "18:10", title: "올뮤", title_en: "All About Music", description: "밴드동아리 올뮤", description_en: "band club All About Music", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "5월 19일", date_en: "May 19", status: "SCHEDULED", songs: ["난춘 - 새소년", "맞네 - 루시", "당신을 위하여 - 더크로스"] },
        { id: 4, time: "18:30", title: "에어락", title_en: "Aerock", description: "밴드동아리 에어락", description_en: "band club Aerock", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "5월 19일", date_en: "May 19", status: "SCHEDULED", songs: ["괴수의 꽃노래", "녹아내려요", "흔들리는 시간속에"] },
        { id: 5, time: "18:50", title: "재징유", title_en: "Jazzing You", description: "밴드동아리 재징유", description_en: "sound check for the band", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "5월 19일", date_en: "May 19", status: "SCHEDULED", songs: ["Sir Duke - Stevie Wonder", "Rock with you - Michael Jackson", "Mel Tome - Antumn Leaves"] },
        { id: 6, time: "19:10", title: "우리부모", title_en: "Woo Boo", description: "밴드동아리 우리부모", description_en: "band club Jazzing You", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "5월 19일", date_en: "May 19", status: "SCHEDULED", songs: ["금붕어 - 한로로", "Enter Sandman - Metallica", "Last day - 터치드"] },
        { id: 7, time: "19:30", title: "줄울림", title_en: "Julullim", description: "밴드동아리 줄울림", description_en: "band club Woo Boo", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "5월 19일", date_en: "May 19", status: "SCHEDULED", songs: ["Smile boy", "Counting Stars", "기억을 걷는시간"] },
        { id: 8, time: "19:50", title: "밴드 사운드 체크", title_en: "sound check for the band", description: "밴드 사운드 체크", description_en: "band club Julullim", type: "BREAKTIME", stage: "메인무대", stage_en: "Main Stage", date: "5월 19일", date_en: "May 19", status: "SCHEDULED" },
        { id: 9, time: "20:30", title: "연예인 공연", title_en: "celebrity performance", description: "연예인 공연", description_en: "sound check for the band", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "5월 19일", date_en: "May 19", status: "SCHEDULED" },
    ],
    "5월 20일": [
        { id: 10, time: "17:30", title: "에어비트", title_en: "Air Beat", description: "에어비트 공연", description_en: "Air Beat Performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "5월 20일", date_en: "May 20", status: "SCHEDULED" },
        { id: 11, time: "18:00", title: "총학생회 행사", title_en: "Student Council Event", description: "총학생회 행사", description_en: "Student Council Event", type: "EVENT", stage: "메인무대", stage_en: "Main Stage", date: "5월 20일", date_en: "May 20", status: "SCHEDULED" },
        { id: 12, time: "19:40", title: "사운드 체크", title_en: "Sound Check", description: "사운드 체크", description_en: "Sound Check", type: "BREAKTIME", stage: "메인무대", stage_en: "Main Stage", date: "5월 20일", date_en: "May 20", status: "SCHEDULED" },
        { id: 13, time: "20:10", title: "연예인 4", title_en: "Celebrity 4", description: "연예인 공연", description_en: "Celebrity Performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "5월 20일", date_en: "May 20", status: "SCHEDULED" },
        { id: 14, time: "20:50", title: "연예인 5", title_en: "Celebrity 5", description: "연예인 공연", description_en: "Celebrity Performance", type: "PERFORMANCE", stage: "메인무대", stage_en: "Main Stage", date: "5월 20일", date_en: "May 20", status: "SCHEDULED" },
    ],
};
