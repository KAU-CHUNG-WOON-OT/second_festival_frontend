const TruckCardSkeleton = () => {
  return (
    <div
      className="bg-white/55 backdrop-blur-sm border border-white/45 rounded-2xl px-4 py-3.5 flex items-center gap-3.5 animate-pulse
        shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="w-11 h-11 rounded-xl bg-white/60 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-3.5 w-1/2 rounded-full bg-white/60 mb-2" />
        <div className="h-2.5 w-3/4 rounded-full bg-white/50" />
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-4 rounded-full bg-white/55" />
      </div>
    </div>
  );
};

export default TruckCardSkeleton;
