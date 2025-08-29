"use client";
import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Heart,
  ChevronDown,
} from "lucide-react";

export default function MiniPlayer({
  song,
  onNext,
  onPrev,
}: {
  song: any;
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || isNaN(audioRef.current.duration)) return;
    const newTime =
      (parseFloat(e.target.value) / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Load song whenever it changes
  useEffect(() => {
    if (audioRef.current && song) {
      const url = song.audio || song.audiodownload || song.src;
      audioRef.current.src = url;
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [song]);

  // Handle when song ends
  useEffect(() => {
    if (!audioRef.current) return;
    const handleEnded = () => {
      if (shuffle && onNext) {
        onNext();
      } else if (onNext) {
        onNext();
      }
    };

    const audioEl = audioRef.current;
    audioEl.addEventListener("ended", handleEnded);
    return () => {
      audioEl.removeEventListener("ended", handleEnded);
    };
  }, [shuffle, onNext]);

  if (!song) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[520px]
      bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
      text-white shadow-2xl rounded-xl border border-white/20
      transition-all duration-300 overflow-hidden
      ${expanded ? "h-40 p-3" : "h-16 px-3 py-2"}`}  // ⬅️ reduced height
      onClick={() => !expanded && setExpanded(true)}
    >
      {/* Compact Bar */}
      {!expanded && (
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <img
              src={song.image || song.cover}
              alt={song.name || song.title}
              className="w-10 h-10 rounded-md object-cover"
            />
            <div>
              <p className="text-sm font-semibold truncate">
                {song.name || song.title}
              </p>
              <p className="text-xs text-gray-200 truncate">
                {song.artist_name || song.artist}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Expanded Player */}
      {expanded && (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-3">
              <img
                src={song.image || song.cover}
                alt={song.name || song.title}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div>
                <p className="text-sm font-semibold truncate">
                  {song.name || song.title}
                </p>
                <p className="text-xs text-gray-200 truncate">
                  {song.artist_name || song.artist}
                </p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-white/80 hover:text-white"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-gray-200">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={isNaN(progress) ? 0 : progress}
              onChange={onSeek}
              className="flex-1 h-1 appearance-none cursor-pointer bg-gray-300/40 rounded-full accent-white"
            />
            <span className="text-[10px] text-gray-200">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-5 mt-2"> 
            {/* ⬅️ slightly less gap & margin */}
            <button
              onClick={() => setFavorite(!favorite)}
              className={`hover:scale-110 transition ${
                favorite ? "text-red-400" : "text-white"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${favorite ? "fill-red-400" : "fill-none"}`}
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev?.();
              }}
              className="hover:scale-110 transition"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full 
              bg-white text-indigo-600 shadow-lg hover:scale-110 active:scale-95 transition"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext?.();
              }}
              className="hover:scale-110 transition"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShuffle(!shuffle);
              }}
              className={`hover:scale-110 transition ${
                shuffle ? "text-yellow-300" : "text-white"
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} />
    </div>
  );
}
