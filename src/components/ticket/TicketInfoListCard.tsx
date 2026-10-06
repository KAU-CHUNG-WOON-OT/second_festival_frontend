interface TicketInfoListCardProps {
  title: string;
  items: readonly string[];
}

interface TicketInfoListItemProps {
  item: string;
}

const TicketInfoListItem = ({ item }: TicketInfoListItemProps) => {
  return (
    <li className="flex items-start gap-3 font-body-kr text-[16px] leading-6">
      <span className="mt-2 size-[6px] shrink-0 rounded-full bg-rust" aria-hidden />
      <span>{item}</span>
    </li>
  );
};

const TicketInfoListCard = ({ title, items }: TicketInfoListCardProps) => {
  return (
    <section className="rounded-[24px] border-2 border-ink bg-paper p-6 text-ink drop-shadow-[5px_5px_0px_var(--color-ink)]">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full border border-ink font-display text-[14px] leading-5">
          !
        </span>
        <h2 className="font-display text-[20px] leading-7">{title}</h2>
      </div>

      <ul className="flex flex-col gap-[10px] pt-4">
        {items.map((item, index) => (
          <TicketInfoListItem key={`${title}-${index}`} item={item} />
        ))}
      </ul>
    </section>
  );
};

export default TicketInfoListCard;
