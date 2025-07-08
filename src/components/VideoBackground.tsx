import React, { useRef, useEffect, useState } from 'react';
import { Track } from '../types/music';

interface VideoBackgroundProps {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  showVideo: boolean;
  volume: number;
  playbackSpeed: number;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onEnded: () => void;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  track,
  isPlaying,
  currentTime,
  showVideo,
  volume,
  playbackSpeed,
  onTimeUpdate,
  onDurationChange,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Cuando cambia el track o el video carga metadata, actualizar duración
  useEffect(() => {
    if (!videoRef.current) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(videoRef.current?.duration || 0);
      onDurationChange(videoRef.current?.duration || 0);
    };

    const handleTimeUpdate = () => {
      onTimeUpdate(videoRef.current?.currentTime || 0);
    };

    const handleEnded = () => {
      onEnded();
    };

    const video = videoRef.current;

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [track, onTimeUpdate, onDurationChange, onEnded]);

  // Sincronizar video al currentTime del audio (adelantar o retroceder)
  useEffect(() => {
    if (!videoRef.current || !showVideo) return;

    const video = videoRef.current;

    // Si el tiempo actual del audio es mayor que la duración del video,
    // no tratar de buscar en video (queda mostrando imagen estática)
    if (videoDuration === 0) return;

    if (currentTime <= videoDuration && Math.abs(video.currentTime - currentTime) > 0.3) {
      video.currentTime = currentTime;
    }
  }, [currentTime, showVideo, videoDuration]);

  // Reproducir / pausar video según isPlaying y showVideo
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (showVideo && isPlaying && currentTime <= videoDuration) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, showVideo, currentTime, videoDuration]);

  // Ajustar volumen y velocidad
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, playbackSpeed]);

  // Mostrar imagen estática si:
  // - No hay video
  // - showVideo es falso
  // - currentTime > duración video (es decir, música más larga)
  if (!track?.videoBgSrc || !showVideo || currentTime > videoDuration) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-violet-900/20">
        {/* Imagen o patrón para llenar espacio */}
        <div
          className="absolute inset-0 bg-[url('/path/to/your/image.jpg')] bg-cover bg-center opacity-70"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>
    );
  }

  // Mostrar video sincronizado
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        src={track.videoBgSrc}
        className="absolute inset-0 w-full h-full object-cover"
        preload="metadata"
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/50 "></div>
    </div>
  );
};
