import React from 'react';
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  VolumeX,
  Volume2,
  Video,
  VideoOff,
} from 'lucide-react';

interface PlayerControlsProps {
  songTitle: string;
  artistName: string;
  albumName: string;
  albumArtUrl: string;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isShuffled: boolean;
  isRepeating: boolean;
  playbackSpeed: number;
  currentTime: number;
  duration: number;
  showVideo: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
  onSeek: (time: number) => void;
  onSpeedChange: (speed: number) => void;
  onVideoToggle: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  songTitle,
  artistName,
  albumName,
  albumArtUrl,
  isPlaying,
  isMuted,
  volume,
  isShuffled,
  isRepeating,
  playbackSpeed,
  currentTime,
  duration,
  showVideo,
  onPlayPause,
  onPrevious,
  onNext,
  onVolumeChange,
  onMute,
  onShuffleToggle,
  onRepeatToggle,
  onSeek,
  onSpeedChange,
  onVideoToggle,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value));
  };

  const iconSize = 18;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 bg-gradient-to-t from-black/90 to-transparent shadow-lg rounded text-white">
      {/* Info del track */}
      <div className="flex items-center space-x-4 mb-4">
        {albumArtUrl && (
          <img
            src={albumArtUrl}
            alt={`${albumName} cover`}
            className="w-16 h-16 rounded-lg object-cover shadow border border-white/20"
          />
        )}
        <div className="flex flex-col min-w-0">
          <h3 className="text-lg font-semibold truncate">{songTitle || 'Sin título'}</h3>
          <p className="text-purple-300 text-sm truncate">{artistName || 'Artista desconocido'}</p>
          <p className="text-gray-400 text-xs truncate">{albumName || 'Álbum desconocido'}</p>
        </div>
      </div>

      {/* Controles de reproducción */}
      <div className="flex items-center justify-center space-x-9 mb-2">
        <button
          onClick={onShuffleToggle}
          title="Shuffle"
          className={`hover:text-purple-400 ${isShuffled ? 'text-purple-500' : 'text-gray-400'}`}
          aria-label="Shuffle"
        >
          <Shuffle size={iconSize} />
        </button>
        <button onClick={onPrevious} title="Previous" className="hover:text-purple-400" aria-label="Previous">
          <SkipBack size={iconSize} />
        </button>
        <button
          onClick={onPlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
          className="text-2xl hover:text-purple-400"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
        </button>
        <button onClick={onNext} title="Next" className="hover:text-purple-400" aria-label="Next">
          <SkipForward size={iconSize} />
        </button>
        <button
          onClick={onRepeatToggle}
          title="Repeat"
          className={`hover:text-purple-400 ${isRepeating ? 'text-purple-500' : 'text-gray-400'}`}
          aria-label="Repeat"
        >
          <Repeat size={iconSize} />
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="flex items-center space-x-2 text-xs text-gray-300 mb-2">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeekChange}
          step={0.1}
          className="flex-1 accent-purple-500"
        />
        <span>{formatTime(duration)}</span>
      </div>

   
    </div>
  );
};
