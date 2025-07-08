import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onMute: () => void;
}

export const useKeyboardShortcuts = ({
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeUp,
  onVolumeDown,
  onMute,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          onPlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrevious();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onVolumeUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onVolumeDown();
          break;
        case 'm':
          e.preventDefault();
          onMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayPause, onNext, onPrevious, onVolumeUp, onVolumeDown, onMute]);
};