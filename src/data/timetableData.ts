export interface TimetableEvent {
    id: number;
    time: string;
    title: string;
    title_en: string;
    description: string;
    description_en: string;
    type: "EVENT" | "CLUB";
    stage: string;
    stage_en: string;
    date: string;
    date_en: string;
    status: "SCHEDULED" | "ONGOING" | "DONE";
    songs?: string[];
}

export const DATE_TABS_EN = ["May 18", "May 19", "May 20"];

export const FESTIVAL_DATE = "2026-10-28";
export const FESTIVAL_DATE_LABEL = "10.28 WED";

// TODO: 피그마 시안의 예시 데이터. 실제 일정이 나오면 교체
export const timetableEvents: TimetableEvent[] = [
    { id: 1, time: "11:00", title: "총학생회", title_en: "Student Council", description: "개막식", description_en: "Opening ceremony", type: "EVENT", stage: "메인무대", stage_en: "Main stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 2, time: "12:00", title: "밴드 동아리 SKYLINE", title_en: "Band club SKYLINE", description: "동아리 공연", description_en: "Club performance", type: "CLUB", stage: "메인무대", stage_en: "Main stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 3, time: "14:00", title: "댄스 공연", title_en: "Dance performance", description: "댄스동아리 WINGS", description_en: "Dance club WINGS", type: "CLUB", stage: "특설무대", stage_en: "Special stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
    { id: 4, time: "19:30", title: "불꽃 피날레", title_en: "Fireworks finale", description: "폐막", description_en: "Closing", type: "EVENT", stage: "메인무대", stage_en: "Main stage", date: "10월 28일", date_en: "Oct 28", status: "SCHEDULED" },
];

// 다음 순서가 시작되면 이전 순서는 DONE. 마지막 순서는 축제 날이 지나면 DONE
export const isEventDone = (index: number, now: Date = new Date()): boolean => {
    const next = timetableEvents[index + 1];
    const end = next
        ? new Date(`${FESTIVAL_DATE}T${next.time}:00`)
        : new Date(`${FESTIVAL_DATE}T23:59:59`);
    return now >= end;
};
