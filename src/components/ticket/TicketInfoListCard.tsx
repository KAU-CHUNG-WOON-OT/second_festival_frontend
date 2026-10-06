import { FiInfo } from 'react-icons/fi';

interface TicketInfoListCardProps {
  title: string;
  items: readonly string[];
}

interface TicketInfoListItemProps {
  item: string;
}

const TicketInfoListItem = ({ item }: TicketInfoListItemProps) => {
  return (
    <li className="flex items-start gap-[8px] text-[14px] leading-[20px] text-[#314158]">
      <span className="text-[14px] font-bold leading-[20px] text-[#615fff]" aria-hidden>
        •
      </span>
      <span>{item}</span>
    </li>
  );
};

const TicketInfoListCard = ({ title, items }: TicketInfoListCardProps) => {
  return (
    <section className="rounded-[24px] border border-[rgba(226,232,240,0.5)] bg-[rgba(255,255,255,0.7)] px-[25px] pt-[25px] pb-[24px]">
      <div className="mb-[16px] flex items-center gap-[8px]">
        <FiInfo className="size-[20px] text-[#615fff]" />
        <h2 className="text-[18px] font-bold leading-[27px] tracking-[-0.4395px] text-[#1d293d]">
          {title}
        </h2>
      </div>

      <ul className="flex flex-col gap-[8px]">
        {items.map((item, index) => (
          <TicketInfoListItem key={`${title}-${index}`} item={item} />
        ))}
      </ul>
    </section>
  );
};

export default TicketInfoListCard;
