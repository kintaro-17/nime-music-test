export interface LyricLine {
  time: number;
  text: string;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  albumArtUrl: string;
  audioSrc: string;
  videoBgSrc?: string;
  lyrics: LyricLine[];
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  isRepeating: boolean;
  playbackSpeed: number;
  showVideo: boolean;
}