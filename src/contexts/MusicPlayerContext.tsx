
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PlayableSong } from '@/components/MusicPlayer';

interface MusicPlayerContextType {
  currentSong: PlayableSong | null;
  isPlaying: boolean;
  playSong: (song: PlayableSong) => void;
  pauseSong: () => void;
  setIsPlaying: (playing: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export const MusicPlayerProvider: React.FC<MusicPlayerProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<PlayableSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song: PlayableSong) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  return (
    <MusicPlayerContext.Provider value={{
      currentSong,
      isPlaying,
      playSong,
      pauseSong,
      setIsPlaying
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
