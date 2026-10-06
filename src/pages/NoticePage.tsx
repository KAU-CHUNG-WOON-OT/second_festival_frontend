import { useState } from "react";
import DayHeader from "../components/common/DayHeader";
import NoticeItem from "../components/notice/NoticeItem";
import NoticeModal from "../components/notice/NoticeModal";
import { dummyNotices } from "../data/noticeData";
import type { NoticeData } from "../data/noticeData";

const NoticePage = () => {
  const [selectedNotice, setSelectedNotice] = useState<NoticeData | null>(null);

  const sortByDateDesc = (a: NoticeData, b: NoticeData) => b.date.localeCompare(a.date);

  const importantNotices = dummyNotices
    .filter((n) => n.isImportant)
    .sort(sortByDateDesc);
  const newNotices = dummyNotices
    .filter((n) => !n.isImportant && n.isNew)
    .sort(sortByDateDesc);
  const oldNotices = dummyNotices
    .filter((n) => !n.isImportant && !n.isNew)
    .sort(sortByDateDesc);

  return (
    <div className="flex flex-1 flex-col pb-5 overflow-y-auto">
      <div className="px-6">
        <DayHeader
          selectedDay={-1}
          onSelectDay={() => {}}
          showDayTabs={false}
          title="공지사항"
        />
      </div>

      <div className="flex flex-col gap-2.5 px-6">
        {importantNotices.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-[12px] font-bold text-[#ffd8c3] whitespace-nowrap">중요</p>
              <div className="flex-1 h-px bg-white/20" />
            </div>
            {importantNotices.map((notice) => (
              <NoticeItem
                key={notice.id}
                notice={notice}
                onClick={() => setSelectedNotice(notice)}
              />
            ))}
          </>
        )}

        {newNotices.length > 0 && (
          <>
            <div className="flex items-center gap-3 mt-3 mb-1">
              <p className="text-[12px] font-bold text-white/60 whitespace-nowrap">New</p>
              <div className="flex-1 h-px bg-white/20" />
            </div>
            {newNotices.map((notice) => (
              <NoticeItem
                key={notice.id}
                notice={notice}
                onClick={() => setSelectedNotice(notice)}
              />
            ))}
          </>
        )}

        {oldNotices.length > 0 && (
          <>
            <div className="flex items-center gap-3 mt-3 mb-1">
              <p className="text-[12px] font-bold text-white/60 whitespace-nowrap">전체</p>
              <div className="flex-1 h-px bg-white/20" />
            </div>
            {oldNotices.map((notice) => (
              <NoticeItem
                key={notice.id}
                notice={notice}
                onClick={() => setSelectedNotice(notice)}
              />
            ))}
          </>
        )}
      </div>

      <NoticeModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />
    </div>
  );
};

export default NoticePage;