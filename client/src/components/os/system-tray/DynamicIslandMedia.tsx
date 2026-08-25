import React from "react";
import { Play, Pause, SkipForward, Music, Disc } from "lucide-react";
import { useSpotify } from "@/lib/spotify-context";
import { useOS } from "@/lib/os-context";
import { motion, AnimatePresence } from "framer-motion";

export function DynamicIslandMedia() {
  const { currentSong, isPlaying, togglePlay, nextSong } = useSpotify();
  const { launchApp } = useOS();
  const [isHovered, setIsHovered] = React.useState(false);

  // If no song is loaded or available, show a sleek idle OS status indicator
  if (!currentSong) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/40 text-xs text-zinc-600 dark:text-zinc-400 select-none shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-semibold tracking-tight text-zinc-800 dark:text-zinc-300">Portfolio OS</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-950/95 border border-zinc-200 dark:border-zinc-700/50 shadow-xs text-zinc-900 dark:text-zinc-100 select-none transition-all duration-200 hover:border-emerald-500/50 hover:shadow-emerald-500/10 cursor-pointer"
      onClick={() => launchApp("spotify")}
      title="Click to open X-Audio"
    >
      {/* Spinning Disc or Cover */}
      <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
        {currentSong.coverUrl ? (
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className={`w-full h-full object-cover rounded-full ${isPlaying ? "animate-spin" : ""}`}
            style={{ animationDuration: "6s" }}
          />
        ) : (
          <Disc className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
        )}
      </div>

      {/* Song Info Marquee / Title */}
      <div className="flex flex-col max-w-[110px] md:max-w-[170px] overflow-hidden leading-tight">
        <span className="text-[11px] font-semibold truncate text-zinc-900 dark:text-zinc-100">
          {currentSong.title}
        </span>
        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 truncate">
          {currentSong.artist || "X-Audio"}
        </span>
      </div>

      {/* Audio Visualizer Waves (Bouncing bars when playing) */}
      <div className="flex items-end gap-[2px] h-3.5 px-1">
        {[0.6, 1.2, 0.4, 0.9, 0.7].map((height, i) => (
          <motion.span
            key={i}
            className="w-[2.5px] rounded-full bg-emerald-500 dark:bg-emerald-400"
            animate={
              isPlaying
                ? {
                    height: ["3px", "14px", "4px", "12px", "5px"],
                  }
                : { height: "3px" }
            }
            transition={{
              duration: 0.6 + i * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Quick Play/Next Controls on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-1 pl-1 border-l border-zinc-200 dark:border-zinc-700/60 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={togglePlay}
              className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            </button>
            <button
              onClick={nextSong}
              className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-3 h-3 fill-current" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
