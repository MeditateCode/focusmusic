export default function SongCard({
  title,
  artist,
  cover,
}: {
  title: string;
  artist: string;
  cover: string;
}) {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-4 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/40">
      <img
        src={cover}
        alt={title}
        className="w-full h-44 object-cover rounded-2xl mb-4 shadow-md"
      />
      <h3 className="text-gray-900 font-semibold truncate text-lg">{title}</h3>
      <p className="text-gray-500 text-sm">{artist}</p>
    </div>
  );
}
