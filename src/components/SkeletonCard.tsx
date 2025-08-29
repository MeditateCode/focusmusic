export default function SkeletonCard() {
  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 w-60 shadow-sm animate-pulse">
      {/* Cover placeholder */}
      <div className="w-full h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl mb-3"></div>

      {/* Title placeholder */}
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 mb-2"></div>

      {/* Artist placeholder */}
      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"></div>
    </div>
  );
}
