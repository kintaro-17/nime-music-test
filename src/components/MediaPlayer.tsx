import React, { useRef, useEffect } from 'react';
import { Track } from '../types/music';

interface MediaPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
  showVideo: boolean;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onEnded: () => void;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  volume,
  playbackSpeed,
  showVideo,
  onTimeUpdate,
  onDurationChange,
  onEnded,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const seekingRef = useRef(false);

  useEffect(() => {
    const media = audioRef.current;
    if (!media) return;

    const handleTimeUpdate = () => {
      if (!seekingRef.current) {
        onTimeUpdate(media.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      onDurationChange(media.duration);
    };

    const handleEnded = () => {
      onEnded();
    };

    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('loadedmetadata', handleLoadedMetadata);
    media.addEventListener('ended', handleEnded);

    return () => {
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media.removeEventListener('ended', handleEnded);
    };
  }, [track, onTimeUpdate, onDurationChange, onEnded]);

  useEffect(() => {
    const media = audioRef.current;
    if (!media) return;

    if (Math.abs(media.currentTime - currentTime) > 0.5) {
      seekingRef.current = true;
      media.currentTime = currentTime;

      const timeout = setTimeout(() => {
        seekingRef.current = false;
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [currentTime]);

  // Cargar la pista y reproducir automáticamente al cambiar de track
  useEffect(() => {
    const media = audioRef.current;
    if (!media) return;

    if (track) {
      media.load();
      media.play().catch(console.error); // Auto play al cambiar pista
    }
  }, [track]);

  // Controlar play/pause sin reiniciar
  useEffect(() => {
    const media = audioRef.current;
    if (!media) return;

    if (isPlaying) {
      media.play().catch(console.error);
    } else {
      media.pause();
    }
  }, [isPlaying]);

  // Ajuste volumen
  useEffect(() => {
    const media = audioRef.current;
    if (media) {
      media.volume = volume;
    }
  }, [volume, track]);

  // Ajuste velocidad
  useEffect(() => {
    const media = audioRef.current;
    if (media) {
      media.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, track]);

  if (!track) return null;

  return (
    <div className="hidden">
      <audio
        ref={audioRef}
        src={track.audioSrc}
        preload="metadata"
      />
      {track.videoBgSrc && (
        <video
          ref={videoRef}
          src={track.videoBgSrc}
          preload="metadata"
          muted={!showVideo}
        />
      )}
    </div>
  );
};
