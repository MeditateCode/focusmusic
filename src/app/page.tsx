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
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  // Fetch songs
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/jamendo?genre=${genre}&page=${page}&limit=12`
        );
        const data = await res.json();
        if (page === 1) {
          setSongs(data.results);
          setCurrentIndex(null); // reset when genre changes
        } else {
          setSongs((prev) => [...prev, ...data.results]);
        }
      } catch (err) {
        if (page === 1) setSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [genre, page]);

  // Change genre
  const handleGenreChange = (g: string) => {
    setGenre(g);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-gray-900 px-4 py-2 relative">
      {/* Header */}
      <header className="text-center mb-1">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
          🎵 Focus Music
        </h1>
        <p className="text-gray-500 text-xs mt-1">
          Stay focused with curated tracks
        </p>
      </header>

      {/* Genre Selector */}
      <div className="flex justify-center mb-4">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-sm px-4 py-2">
          <GenreChips onSelect={handleGenreChange} />
        </div>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading && page === 1
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : songs.length > 0
          ? songs.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
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

      {/* Load More */}
      {songs.length > 0 && (
        <div className="flex justify-end mt-6 mb-24">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg shadow-md text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Mini Player */}
      {currentIndex !== null && (
        <div
          className="fixed bottom-1 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[500px] z-50"
        >
          <MiniPlayer
            song={songs[currentIndex]} // ✅ just pass current song
            onNext={() =>
              setCurrentIndex((prev) =>
                prev !== null && prev < songs.length - 1 ? prev + 1 : 0
              )
            }
            onPrev={() =>
              setCurrentIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : songs.length - 1
              )
            }
          />
        </div>
      )}
    </main>
  );
}
