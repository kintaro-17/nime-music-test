import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Track, PlayerState } from './types/music';
import { tracks } from './data/tracks';
import { TrackList } from './components/TrackList';
import { PlayerControls } from './components/PlayerControls';
import { LyricsDisplay } from './components/LyricsDisplay';
import { VideoBackground } from './components/VideoBackground';
import { CurrentTrackInfo } from './components/CurrentTrackInfo';
import { MediaPlayer } from './components/MediaPlayer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isShuffled: false,
    isRepeating: false,
    playbackSpeed: 1,
    showVideo: true,
  });
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTrackSelect = (track: Track) => {
    const index = tracks.findIndex(t => t.id === track.id);
    setCurrentTrackIndex(index);
    setPlayerState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
    }));
    setShowPlayer(true);
  };

  const handlePlayPause = () => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  };

  const handleNext = () => {
    let nextIndex;
    if (playerState.isShuffled) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    setCurrentTrackIndex(nextIndex);
    setPlayerState(prev => ({
      ...prev,
      currentTrack: tracks[nextIndex],
      currentTime: 0,
      isPlaying: true,
    }));
  };

  const handlePrevious = () => {
    let prevIndex;
    if (playerState.isShuffled) {
      prevIndex = Math.floor(Math.random() * tracks.length);
    } else {
      prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    }
    setCurrentTrackIndex(prevIndex);
    setPlayerState(prev => ({
      ...prev,
      currentTrack: tracks[prevIndex],
      currentTime: 0,
      isPlaying: true,
    }));
  };

  const handleVolumeChange = (volume: number) => {
    setPlayerState(prev => ({
      ...prev,
      volume,
      isMuted: volume === 0,
    }));
  };

  const handleMute = () => {
    setPlayerState(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  };

  const handleShuffleToggle = () => {
    setPlayerState(prev => ({
      ...prev,
      isShuffled: !prev.isShuffled,
    }));
  };

  const handleRepeatToggle = () => {
    setPlayerState(prev => ({
      ...prev,
      isRepeating: !prev.isRepeating,
    }));
  };

  const handleSeek = (time: number) => {
    setPlayerState(prev => ({
      ...prev,
      currentTime: time,
    }));
    
    // Sync both audio and video
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlayerState(prev => ({
      ...prev,
      playbackSpeed: speed,
    }));
  };

  const handleVideoToggle = () => {
    setPlayerState(prev => ({
      ...prev,
      showVideo: !prev.showVideo,
    }));
  };

  const handleTimeUpdate = (time: number) => {
    setPlayerState(prev => ({
      ...prev,
      currentTime: time,
    }));
  };

  const handleDurationChange = (duration: number) => {
    setPlayerState(prev => ({
      ...prev,
      duration,
    }));
  };

const handleEnded = () => {
  if (playerState.isRepeating) {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Reproducción fallida al repetir:', error);
        });
      }
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.error('Error al reproducir video al repetir:', error);
      });
    }

    setPlayerState(prev => ({
      ...prev,
      currentTime: 0,
      isPlaying: true, // <- Asegura estado "reproduciendo"
    }));
  } else {
    handleNext();
  }
};
  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onVolumeUp: () => handleVolumeChange(Math.min(1, playerState.volume + 0.1)),
    onVolumeDown: () => handleVolumeChange(Math.max(0, playerState.volume - 0.1)),
    onMute: handleMute,
  });

 




  if (!showPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black-5 to-purple-900 px-7 sm:px-8 lg:px-9">



        
        <div className="container mx-auto max-w-7xl">
          <TrackList
            tracks={tracks}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
            onTrackSelect={handleTrackSelect}
            onPlayPause={handlePlayPause}
          />
        </div>



        <MediaPlayer
          track={playerState.currentTrack}
          isPlaying={playerState.isPlaying}
          currentTime={playerState.currentTime}
          duration={playerState.duration}
          volume={playerState.isMuted ? 0 : playerState.volume}
          playbackSpeed={playerState.playbackSpeed}
          showVideo={playerState.showVideo}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onEnded={handleEnded}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <VideoBackground
        track={playerState.currentTrack}
        isPlaying={playerState.isPlaying}
        currentTime={playerState.currentTime}
        showVideo={playerState.showVideo}
        volume={playerState.isMuted ? 0 : playerState.volume}
        playbackSpeed={playerState.playbackSpeed}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Back Button */}
        <button
          onClick={() => setShowPlayer(false)}
          className="absolute top-5 left-4 sm:top-6 sm:left-6 p-3 sm:p-3 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-all duration-300 z-20"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-end items-center p-4 sm:p-6">
          <div className="w-full max-w-6xl flex flex-col h-full">
           
            
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 flex-1 min-h-0">
              {/* Lyrics Panel */}
              <div className="flex-1 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl  shadow-2xl overflow-hidden">
                <LyricsDisplay
                  track={playerState.currentTrack}
                  currentTime={playerState.currentTime}
                />
              </div>
            </div>


            
          </div>
        </div>

        {/* Player Controls */}
        <div className="pb-safe">
       <PlayerControls
  songTitle={playerState.currentTrack?.title || ''}
  artistName={playerState.currentTrack?.artist || ''}
  albumName={playerState.currentTrack?.album || ''}
  albumArtUrl={playerState.currentTrack?.albumArtUrl || ''}
  isPlaying={playerState.isPlaying}
  isMuted={playerState.isMuted}
  volume={playerState.volume}
  isShuffled={playerState.isShuffled}
  isRepeating={playerState.isRepeating}
  playbackSpeed={playerState.playbackSpeed}
  currentTime={playerState.currentTime}
  duration={playerState.duration}
  showVideo={playerState.showVideo}
  onPlayPause={handlePlayPause}
  onPrevious={handlePrevious}
  onNext={handleNext}
  onVolumeChange={handleVolumeChange}
  onMute={handleMute}
  onShuffleToggle={handleShuffleToggle}
  onRepeatToggle={handleRepeatToggle}
  onSeek={handleSeek}
  onSpeedChange={handleSpeedChange}
  onVideoToggle={handleVideoToggle}
/>
        </div>
      </div>

      {/* Hidden Media Player for Audio */}
      <MediaPlayer
        track={playerState.currentTrack}
        isPlaying={playerState.isPlaying}
        currentTime={playerState.currentTime}
        duration={playerState.duration}
        volume={playerState.isMuted ? 0 : playerState.volume}
        playbackSpeed={playerState.playbackSpeed}
        showVideo={playerState.showVideo}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
      />
    </div>
  );
}

export default App;