"use client";
import { useState } from "react";

const GENRES = ["Ambient", "Classical", "Lo-fi", "Jazz", "Nature"];

export default function GenreChips({ onSelect }: { onSelect: (genre: string) => void }) {
  const [active, setActive] = useState("Ambient");

  return (
    <div className="flex gap-3 flex-wrap justify-center mt-4">
      {GENRES.map((g) => {
        const isActive = active === g;
        return (
          <button
            key={g}
            onClick={() => {
              setActive(g);
              onSelect(g.toLowerCase());
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
              backdrop-blur-md border
              ${isActive
                ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg border-transparent scale-105"
                : "bg-white/40 text-gray-700 border-gray-300 hover:bg-white/60 hover:scale-105"}`}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}
