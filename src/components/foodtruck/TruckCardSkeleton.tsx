const TruckCardSkeleton = () => {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-[16px] border-2 border-ink/30 bg-paper px-4 py-[14px]">
      <div className="size-11 shrink-0 rounded-[8px] bg-ink/10" />
      <div className="min-w-0 flex-1">
        <div className="mb-2 h-4 w-1/2 rounded-full bg-ink/10" />
        <div className="h-3 w-3/4 rounded-full bg-ink/10" />
      </div>
    </div>
  );
};

export default TruckCardSkeleton;
