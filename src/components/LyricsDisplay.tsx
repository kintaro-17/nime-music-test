import React, { useEffect, useRef } from 'react';
import { Track, LyricLine } from '../types/music';

interface LyricsDisplayProps {
  track: Track | null;
  currentTime: number;
  onSeek: (time: number) => void;
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ track, currentTime, onSeek }) => {
  const lyricsRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);

  const getCurrentLyricIndex = () => {
    if (!track?.lyrics) return -1;
    for (let i = track.lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= track.lyrics[i].time) {
        return i;
      }
    }
    return -1;
  };

  const currentLyricIndex = getCurrentLyricIndex();

  useEffect(() => {
    if (activeLyricRef.current && lyricsRef.current) {
      const container = lyricsRef.current;
      const activeElement = activeLyricRef.current;

      const containerHeight = container.clientHeight;
      const elementTop = activeElement.offsetTop;
      const elementHeight = activeElement.clientHeight;

      // Centrar el elemento activo en la vista
      const scrollTop = elementTop - containerHeight / 2 + elementHeight / 2;
      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }, [currentLyricIndex]);

  if (!track?.lyrics) {
    return (
      <div className="h-full flex items-center justify-center text-center text-gray-400">
        <p>No tiene letra</p>
      </div>
    );
  }

  return (
    <div className="relative h-[300px] md:h-[400px] w-full bg-black/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-3 justify-center items-center text-center py-2 border-b  border-white/10 bg-black/20">
        <h3 className="text-white text-sm font-semibold">Lyrics</h3>
      </div>

      {/* Lyrics content */}
      <div
        ref={lyricsRef}
        className="overflow-y-auto h-full px-3 py-4 space-y-2 scrollbar-thin scrollbar-thumb-purple-500/40 scrollbar-track-transparent"
        style={{ height: 'calc(100% - 50px)' }}
      >
        {track.lyrics.map((line: LyricLine, index: number) => {
          const isActive = index === currentLyricIndex;
          const isPast = index < currentLyricIndex;

          return (
            <div
              key={index}
              ref={isActive ? activeLyricRef : null}
              className={`text-center text-sm rounded-md px-2 py-1 cursor-pointer transition-all duration-300 ease-in-out
                ${isActive
                  ? 'text-white font-bold bg-gradient-to-r from-purple-600/40 to-violet-600/80 shadow'
                  : isPast
                  ? 'text-gray-400 opacity-70 hover:opacity-90'
                  : 'text-gray-500 opacity-50 hover:opacity-80'}`}
              onClick={() => onSeek(line.time)}
            >
              {line.text}
            </div>
          );
        })}

        {/* Espaciador final para scroll */}
        <div className="h-12" />
      </div>

     
    </div>
  );
};
