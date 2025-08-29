"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export default function MiniPlayer({ song }: { song: any }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // percentage 0–100
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((err) => {
                console.warn("Play error:", err);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const onTimeUpdate = () => {
        if (!audioRef.current || isNaN(audioRef.current.duration)) return;
        const percent =
            (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percent || 0);
    };

    const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current || isNaN(audioRef.current.duration)) return;
        const newTime =
            (parseFloat(e.target.value) / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setProgress(parseFloat(e.target.value));
    };

    useEffect(() => {
        if (audioRef.current && song) {
            audioRef.current.src = song.src;
            setProgress(0);

            audioRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch((err) => {
                    console.warn("Autoplay blocked or interrupted:", err);
                    setIsPlaying(false);
                });
        }
    }, [song]);

    if (!song) return null;

    return (
        <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[520px] 
  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
  text-white shadow-2xl rounded-2xl 
  flex items-center gap-4 px-5 py-3 animate-fadeIn border border-white/20"
        >


            {/* Cover Art */}
            <img
                src={song.cover}
                alt={song.title}
                className="w-14 h-14 rounded-xl object-cover shadow-md"
            />

            {/* Song Info + Progress */}
            <div className="flex-1">
                <p className="text-sm font-semibold truncate">{song.title}</p>
                <p className="text-xs text-gray-600 truncate">{song.artist}</p>

                {/* Custom progress bar */}
                <div className="relative mt-2">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={isNaN(progress) ? 0 : progress}
                        onChange={onSeek}
                        className="w-full h-1 appearance-none cursor-pointer bg-gray-300/50 rounded-full accent-indigo-500"
                    />
                    <div
                        className="absolute top-0 left-0 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 pointer-events-none"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center">
                {isPlaying ? (
                    <button
                        onClick={togglePlay}
                        className="w-11 h-11 flex items-center justify-center rounded-full 
              bg-white text-indigo-600 shadow-lg hover:scale-105 active:scale-95 
              transition relative overflow-hidden"
                    >
                        <Pause className="w-6 h-6" />
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 opacity-20" />
                    </button>
                ) : (
                    <button
                        onClick={togglePlay}
                        className="w-11 h-11 flex items-center justify-center rounded-full 
              bg-white text-indigo-600 shadow-lg hover:scale-105 active:scale-95 
              transition relative overflow-hidden"
                    >
                        <Play className="w-6 h-6" />
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 opacity-20" />
                    </button>
                )}
            </div>

            <audio ref={audioRef} onTimeUpdate={onTimeUpdate} />
        </div>
    );
}
