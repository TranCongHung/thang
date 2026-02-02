import React, { useRef, useState, useEffect } from 'react';
import { Volume2, Play, Square, Pause, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc?: string;
  onPlayRequest?: () => void;
  isLoading?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset state when audioSrc changes
    setError(false);
    setIsPlaying(false);
    
    // Create audio object if source exists
    if (audioSrc) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = (e) => {
          console.warn("Audio playback failed (file might be missing):", audioSrc);
          setError(true);
          setIsPlaying(false);
      };
    } else {
        audioRef.current = null;
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current || !audioSrc) {
        return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
            console.error("Playback error:", err);
            setError(true);
            setIsPlaying(false);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  if (!audioSrc) return null;

  if (error) {
      return (
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 cursor-not-allowed">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">Chưa có thuyết minh</span>
        </div>
      );
  }

  return (
    <div className="inline-block">
      <button
        onClick={togglePlay}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors shadow-md ${
            isPlaying 
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
            : 'bg-military-600 hover:bg-military-700 text-white'
        }`}
      >
        {isPlaying ? <Square size={18} fill="currentColor" /> : <Volume2 size={18} />}
        <span className="text-sm font-medium">
            {isPlaying ? 'Dừng thuyết minh' : 'Nghe thuyết minh'}
        </span>
      </button>
    </div>
  );
};

export default AudioPlayer;