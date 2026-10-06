const PubCardSkeleton = () => {
  return (
    <div
      className="rounded-2xl p-2.5 flex flex-col items-center justify-center text-center aspect-square animate-pulse"
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(180,190,210,0.5)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="mb-2 w-20 h-20 rounded-xl bg-white/60" />
      <div className="h-3 w-2/3 rounded-full bg-white/60 mb-1.5" />
      <div className="h-2.5 w-1/2 rounded-full bg-white/50" />
    </div>
  );
};

export default PubCardSkeleton;
