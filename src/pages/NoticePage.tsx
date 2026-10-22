import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RetroPageHeader from "../components/common/RetroPageHeader";
import RetroPageTitle from "../components/common/RetroPageTitle";
import NoticeItem from "../components/notice/NoticeItem";
import NoticeModal from "../components/notice/NoticeModal";
import { dummyNotices } from "../data/noticeData";
import type { NoticeData } from "../data/noticeData";

const NoticePage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  // 홈 공지 띠에서 ?id=로 들어오면 해당 공지를 바로 연다
  const [selectedNotice, setSelectedNotice] = useState<NoticeData | null>(
    () => dummyNotices.find((n) => String(n.id) === searchParams.get("id")) ?? null,
  );

  const sortedNotices = [...dummyNotices].sort((a, b) => b.date.localeCompare(a.date));
  const newNotices = sortedNotices.filter((n) => n.isNew);
  const otherNotices = sortedNotices.filter((n) => !n.isNew);

  const closeNotice = () => {
    setSelectedNotice(null);
    if (searchParams.has("id")) setSearchParams({}, { replace: true });
  };

  return (
    <div className="flex flex-col px-5 pb-16 pt-5 text-ink">
      <RetroPageHeader />

      <RetroPageTitle title={t("nav.notice")} />

      {newNotices.length > 0 && (
        <>
          <p className="pt-6 font-typewriter text-[12px] font-bold leading-4 tracking-[3.6px] text-paper/80">NEW</p>
          <div className="flex flex-col gap-4 pt-3">
            {newNotices.map((notice) => (
              <NoticeItem
                key={notice.id}
                notice={notice}
                compact
                onClick={() => setSelectedNotice(notice)}
              />
            ))}
          </div>
          <div className="mt-6 border-t-2 border-paper/40" />
        </>
      )}

      <div className="flex flex-col gap-4 pt-6">
        {otherNotices.map((notice) => (
          <NoticeItem key={notice.id} notice={notice} onClick={() => setSelectedNotice(notice)} />
        ))}
      </div>

      <NoticeModal notice={selectedNotice} onClose={closeNotice} />
    </div>
  );
};

export default NoticePage;
