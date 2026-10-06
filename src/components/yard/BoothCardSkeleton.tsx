const BoothCardSkeleton = () => {
  return (
    <div className="flex h-[159px] animate-pulse flex-col items-center gap-2 rounded-[16px] border-2 border-ink/30 bg-paper px-3 py-6">
      <div className="h-12 w-[68px] rounded-[8px] bg-ink/10" />
      <div className="h-4 w-2/3 rounded-full bg-ink/10" />
      <div className="h-3 w-1/2 rounded-full bg-ink/10" />
    </div>
  );
};

export default BoothCardSkeleton;
