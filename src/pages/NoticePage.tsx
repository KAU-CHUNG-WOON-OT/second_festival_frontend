import { useState } from "react";
import { useTranslation } from "react-i18next";
import RetroPageHeader from "../components/common/RetroPageHeader";
import NoticeItem from "../components/notice/NoticeItem";
import NoticeModal from "../components/notice/NoticeModal";
import { dummyNotices } from "../data/noticeData";
import type { NoticeData } from "../data/noticeData";
import { FESTIVAL_DATE_LABEL } from "../data/timetableData";

const NoticePage = () => {
  const { t } = useTranslation();
  const [selectedNotice, setSelectedNotice] = useState<NoticeData | null>(null);

  const sortedNotices = [...dummyNotices].sort((a, b) => b.date.localeCompare(a.date));
  const newNotices = sortedNotices.filter((n) => n.isNew);

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader title={t("nav.notice")} />

      <p className="pt-8 font-typewriter text-[12px] leading-4 tracking-[3.6px] text-rust">
        활주로 · {FESTIVAL_DATE_LABEL}
      </p>
      <h2 className="font-display text-[48px] leading-[60px]">{t("nav.notice")}</h2>

      {newNotices.length > 0 && (
        <>
          <p className="pt-6 font-condensed text-[24px] font-light leading-8 tracking-[0.6px]">New</p>
          <div className="flex flex-col gap-4 pt-2">
            {newNotices.map((notice) => (
              <NoticeItem
                key={notice.id}
                notice={notice}
                compact
                onClick={() => setSelectedNotice(notice)}
              />
            ))}
          </div>
          <div className="mt-6 border-t-2 border-ink" />
        </>
      )}

      <div className="flex flex-col gap-4 pt-6">
        {sortedNotices.map((notice) => (
          <NoticeItem key={notice.id} notice={notice} onClick={() => setSelectedNotice(notice)} />
        ))}
      </div>

      <NoticeModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
    </div>
  );
};

export default NoticePage;
