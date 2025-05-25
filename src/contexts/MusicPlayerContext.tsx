
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PlayableSong } from '@/components/MusicPlayer';
import { torrentStreamingService } from '@/lib/torrentStreamingService';
import { toast } from 'sonner';

interface MusicPlayerContextType {
  currentSong: PlayableSong | null;
  isPlaying: boolean;
  isStreaming: boolean;
  streamProgress: number;
  playSong: (song: PlayableSong) => void;
  streamSong: (song: PlayableSong & { magnetUrl?: string }) => Promise<void>;
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
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamProgress, setStreamProgress] = useState(0);

  const playSong = (song: PlayableSong) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setIsStreaming(false);
  };

  const streamSong = async (song: PlayableSong & { magnetUrl?: string }) => {
    try {
      setIsStreaming(true);
      setCurrentSong(song);
      
      toast.info(`Starting torrent stream for ${song.title}...`);
      
      const streamUrl = await torrentStreamingService.streamSong({
        id: song.id,
        title: song.title,
        artist: song.artist,
        albumArt: song.albumArt,
        magnetUrl: song.magnetUrl
      });

      // Update the song with the stream URL
      const streamingSong = { ...song, audioUrl: streamUrl };
      setCurrentSong(streamingSong);
      setIsPlaying(true);
      
      // Monitor stream progress
      const progressInterval = setInterval(() => {
        const progress = torrentStreamingService.getStreamProgress(song.id);
        if (progress) {
          setStreamProgress(progress.progress);
          if (progress.status === 'error') {
            clearInterval(progressInterval);
            setIsStreaming(false);
          }
        }
      }, 1000);

      // Clear interval after 5 minutes
      setTimeout(() => clearInterval(progressInterval), 300000);
      
    } catch (error) {
      console.error('Streaming error:', error);
      setIsStreaming(false);
      toast.error('Failed to start stream');
    }
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  return (
    <MusicPlayerContext.Provider value={{
      currentSong,
      isPlaying,
      isStreaming,
      streamProgress,
      playSong,
      streamSong,
      pauseSong,
      setIsPlaying
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
