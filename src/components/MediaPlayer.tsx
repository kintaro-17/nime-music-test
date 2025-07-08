import React, { useRef, useEffect, useState } from 'react';
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
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (!track || !audio) return;

    let audioReady = false;
    let videoReady = !track.videoBgSrc; // si no hay video

    const checkReady = () => {
      if (audioReady && videoReady) {
        setMediaReady(true);
      }
    };

    const handleAudioCanPlay = () => {
      audioReady = true;
      checkReady();
    };

    const handleVideoCanPlay = () => {
      videoReady = true;
      checkReady();
    };

    audio.addEventListener('canplaythrough', handleAudioCanPlay);
    if (video) {
      video.addEventListener('canplaythrough', handleVideoCanPlay);
    }

    return () => {
      audio.removeEventListener('canplaythrough', handleAudioCanPlay);
      if (video) {
        video.removeEventListener('canplaythrough', handleVideoCanPlay);
      }
    };
  }, [track]);

  // control de play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !mediaReady) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, mediaReady]);

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

  // Reset mediaReady y cargar medios
  useEffect(() => {
    setMediaReady(false);
    const audio = audioRef.current;
    const video = videoRef.current;

    if (track && audio) {
      audio.load();
      if (video && track.videoBgSrc) {
        video.load();
      }
    }
  }, [track]);

  useEffect(() => {
    const media = audioRef.current;
    if (media) {
      media.volume = volume;
    }
  }, [volume, track]);

  useEffect(() => {
    const media = audioRef.current;
    if (media) {
      media.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, track]);

  if (!track) return null;

  return (
    <div className="hidden">
      <audio ref={audioRef} src={track.audioSrc} preload="auto" />
      {track.videoBgSrc && (
        <video
          ref={videoRef}
          src={track.videoBgSrc}
          preload="auto"
          muted={!showVideo}
        />
      )}
    </div>
  );
};
