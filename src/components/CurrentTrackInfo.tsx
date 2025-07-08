import React from 'react';
import { Track } from '../types/music';

interface CurrentTrackInfoProps {
  track: Track | null;
}

export const CurrentTrackInfo: React.FC<CurrentTrackInfoProps> = ({ track }) => {
  if (!track) return null;

  return (
    <div className="flex flex-row sm:flex-row items-center space-x-3 sm:space-x-5 p-3 sm:p-5 bg-black/60 backdrop-blur-md rounded-lg sm:rounded-xl mb-3 sm:mb-5 shadow-md transition-all duration-300">
      {/* Album Art */}
      <div className="relative">
        <img
          src={track.albumArtUrl}
          alt={`${track.album} cover`}
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover shadow border border-white/10"
        />
        <div className="absolute inset-0 rounded-lg bg-purple-500/10 blur-sm opacity-30 pointer-events-none" />
      </div>

      

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base sm:text-lg font-semibold text-white truncate">{track.title}</h2>
        <p className="text-purple-300 text-sm truncate">{track.artist}</p>
        <p className="text-gray-400 text-xs sm:text-sm truncate">{track.album}</p>
      </div>
    </div>
  );
};
