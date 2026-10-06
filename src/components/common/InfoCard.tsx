interface InfoRow {
  label: string;
  value: string;
}

interface InfoCardProps {
  rows: InfoRow[];
}

const InfoCard = ({ rows }: InfoCardProps) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40">
      {rows.map((row, idx) => (
        <div
          key={row.label}
          className={`flex items-start py-2 ${idx < rows.length - 1 ? "border-b border-gray-200/40" : ""}`}
        >
          <span className="text-[12px] font-semibold text-[#8a94a6] w-20 flex-shrink-0">{row.label}:</span>
          <span className="text-[13px] font-medium text-[#2B3A5C] whitespace-pre-line">{row.value}</span>
        </div>
      ))}
    </div>
  );
};

export default InfoCard;