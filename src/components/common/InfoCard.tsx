import type { ReactNode } from "react";

interface InfoRow {
  label: string;
  value: string;
}

interface InfoCardProps {
  rows: InfoRow[];
  // 푸드트럭처럼 제목·액션이 있는 강조 카드
  title?: string;
  titleAction?: ReactNode;
  highlight?: boolean;
}

const InfoCard = ({ rows, title, titleAction, highlight = false }: InfoCardProps) => {
  return (
    <section
      className={`rounded-[16px] border-2 border-ink p-5 text-ink drop-shadow-[5px_5px_0px_var(--color-ink)] ${
        highlight ? "bg-mustard" : "bg-paper"
      }`}
    >
      {title && (
        <div className="flex items-start justify-between gap-3 pb-4">
          <h2 className="font-display text-[30px] leading-[37.5px]">{title}</h2>
          {titleAction}
        </div>
      )}
      <dl className="flex flex-col gap-[6px] font-body-kr text-[16px] leading-6">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-4">
            <dt className={`shrink-0 font-bold ${title ? "w-20" : "w-24"}`}>{row.label}</dt>
            <dd className="whitespace-pre-line">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default InfoCard;
