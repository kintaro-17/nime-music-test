import React, { useState, useMemo } from 'react';
import { Play, Pause, Search } from 'lucide-react';
import { Track } from '../types/music';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
  onPlayPause: () => void;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onPlayPause,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) =>
      `${track.title} ${track.artist}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tracks]);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4">
      {/* Header & Search */}
      <div className="mb-4">
        <h1 className="text-base sm:text-lg font-semibold text-white mb-2">Canciones</h1>
        <div className="relative text-sm">
          <input
            type="text"
            placeholder="Buscar por título o artista..."
            className="w-full pl-8 pr-3 py-[6px] rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Track List/Grid */}
      <div className="space-y-1 lg:space-y-0 lg:grid lg:grid-cols-5 xl:grid-cols-10 gap-2">
        {filteredTracks.map((track) => {
          const isActive = currentTrack?.id === track.id;

          return (
            <div
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className={`group relative flex lg:block items-center gap-3 top-1 p-2 rounded-md cursor-pointer transition 
                ${isActive ? 'ring-2 ring-purple-500/40' : 'hover:ring-1 hover:ring-white/10'}
                bg-white/5 hover:bg-white/10 backdrop-blur-sm`}
            >
              {/* Album Art */}
              <div className="relative shrink-0 w-20 h-20 lg:w-full lg:aspect-square overflow-hidden rounded-md">
                <img
                  src={track.albumArtUrl}
                  alt={track.album}
                  className="w-full h-full object-cover group-hover:scale-100 transition-transform duration-200"
                />
                {isActive && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayPause();
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white" />
                    )}
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1 lg:mt-2 lg:text-center overflow-hidden">
                <h3 className={`text-xs font-medium truncate ${isActive ? 'text-purple-300' : 'text-white'}`}>
                  {track.title}
                </h3>
                <p className="text-[11px] text-gray-400 truncate">{track.artist}</p>
              </div>
            </div>
          );
        })}
        {filteredTracks.length === 0 && (
          <p className="text-sm text-gray-400 col-span-full text-center py-4">
            No se encontraron canciones.
          </p>
        )}
      </div>
    </div>
  );
};
