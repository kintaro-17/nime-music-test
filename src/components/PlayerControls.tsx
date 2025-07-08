import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat
} from 'lucide-react';

interface PlayerControlsProps {
  songTitle: string;
  artistName: string;
  isPlaying: boolean;
  isShuffled: boolean;
  isRepeating: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
  onSeek: (time: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  songTitle,
  artistName,
  isPlaying,
  isShuffled,
  isRepeating,
  currentTime,
  duration,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffleToggle,
  onRepeatToggle,
  onSeek,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Formatear tiempo en mm:ss
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Seek al hacer click o drag en barra
  const seekFromPosition = (clientX: number) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.min(Math.max(percent, 0), 1);
    onSeek(percent * duration);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    seekFromPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    seekFromPosition(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      seekFromPosition(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      seekFromPosition(e.touches[0].clientX);
    }
  };

  const stopDragging = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', stopDragging);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging]);

  return (
    <div className="max-w-md  mx-auto p-5 bg-black/60 backdrop-blur-md rounded-lg  text-white-900">
    
      {/* Barra de progreso */}
      <div
        ref={progressBarRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative h-2 bg-violet-900 rounded-full cursor-pointer"
        aria-label="Progress bar"
      >
        <div
          className="absolute top-0 left-0 h-2 bg-gray-400 rounded-full transition-all"
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        />


        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red rounded-full shadow-md"
          style={{ left: `${(currentTime / duration) * 100 || 0}%`, transform: 'translate(-50%, -50%)' }}
        />


      </div>

      {/* Tiempos */}
      <div className="flex justify-between text-xs text-white mt-1 mb-4 select-none">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controles */}
      <div className="flex justify-between items-center">
        {/* Shuffle */}
        <button
          onClick={onShuffleToggle}
          aria-label="Shuffle"
          className={`p-2 rounded-full transition-colors ${
            isShuffled ? 'bg-violet-800 text-white' : 'text-white hover:bg-violet-900'
          }`}
        >
          <Shuffle size={18} />
        </button>

        {/* Previous */}
        <button
          onClick={onPrevious}
          aria-label="Previous"
          className="p-2 rounded-full text-white hover:bg-violet-800"
        >
          <SkipBack size={18} />
        </button>

        {/* Play / Pause */}
        <button
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="bg-violet-800 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-violet-900"
          style={{ width: 56, height: 56 }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          aria-label="Next"
          className="p-2 rounded-full text-white hover:bg-violet-900"
        >
          <SkipForward size={18} />
        </button>

        {/* Repeat */}
        <button
          onClick={onRepeatToggle}
          aria-label="Repeat"
          className={`p-2 rounded-full transition-colors ${
            isRepeating ? 'bg-violet-800 text-white' : 'text-white hover:bg-violet-900'
          }`}
        >
          <Repeat size={18} />
        </button>
      </div>

      {/* Estilos responsivos para móvil */}
      <style jsx>{`
        @media (max-width: 640px) {
          div[aria-label='Progress bar'] {
            height: 4px;
          }
          div[aria-label='Progress bar'] > div:first-child {
            height: 4px;
          }
          div[aria-label='Progress bar'] > div:last-child {
            width: 24px !important;
            height: 24px !important;
          }
          .flex.justify-between.items-center {
            justify-content: space-around;
          }
          button[aria-label='Shuffle'],
          button[aria-label='Repeat'] {
            padding: 1rem !important;
          }
          button[aria-label='Previous'],
          button[aria-label='Next'] {
            padding: 1rem !important;
          }
          button[aria-label='Play'],
          button[aria-label='Pause'] {
            width: 72px !important;
            height: 72px !important;
          }
        }
      `}</style>
    </div>
  );
};
