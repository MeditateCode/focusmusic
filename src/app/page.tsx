"use client";
import { useState, useEffect } from "react";
import GenreChips from "@/components/GenreChips";
import SongCard from "@/components/SongCard";
import SkeletonCard from "@/components/SkeletonCard";
import MiniPlayer from "@/components/MiniPlayer";

export default function Page() {
  const [genre, setGenre] = useState("ambient");
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jamendo?genre=${genre}&page=1&limit=12`);
        const data = await res.json();
        setSongs(data.results);
      } catch (err) {
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [genre]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-gray-900 p-8 relative">
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
          🎵 Focus Music
        </h1>
        <p className="text-gray-500 text-sm mt-2">Stay focused with curated tracks</p>
      </header>

      {/* Genre Selector */}
      <div className="flex justify-center mb-10">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm px-6 py-3">
          <GenreChips onSelect={(g) => setGenre(g)} />
        </div>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : songs.length > 0
          ? songs.map((s) => (
              <div
                key={s.id}
                onClick={() => setCurrentSong(s)}
                className="hover:scale-[1.03] transition-transform cursor-pointer"
              >
                <SongCard title={s.title} artist={s.artist} cover={s.cover} />
              </div>
            ))
          : (
            <p className="text-gray-400 col-span-full text-center italic">
              No tracks found.
            </p>
          )}
      </div>

      {/* Mini Player */}
      {currentSong && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[500px] z-50">
          <MiniPlayer song={currentSong} />
        </div>
      )}
    </main>
  );
}
