export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background pt-24 pb-20">
      <div className="container max-w-screen-xl px-4 md:px-6">
        {/* Shimmer effect loading skeleton */}
        <div className="w-full h-48 bg-white/5 rounded-3xl animate-pulse mb-12 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-full h-64 bg-white/5 rounded-2xl animate-pulse border border-white/10 relative overflow-hidden">
               <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
