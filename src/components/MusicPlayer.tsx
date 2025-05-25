
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { dummySongs } from '@/lib/dummyData';

export interface PlayableSong {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl?: string;
  duration?: number;
}

interface MusicPlayerProps {
  currentSong?: PlayableSong;
  onSongChange?: (song: PlayableSong) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentSong: propCurrentSong, 
  onSongChange 
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<PlayableSong>(
    propCurrentSong || {
      ...dummySongs[0],
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    }
  );
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Update current song when prop changes
  useEffect(() => {
    if (propCurrentSong && propCurrentSong.id !== currentSong.id) {
      setCurrentSong(propCurrentSong);
      setProgress(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [propCurrentSong, currentSong.id]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      const total = audio.duration;
      setCurrentTime(current);
      setProgress(total > 0 ? (current / total) * 100 : 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      toast({
        title: "Playback Error",
        description: "Unable to play this track. It might not be available.",
        variant: "destructive"
      });
    }
  };

  const handleProgressClick = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    
    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setProgress(value[0]);
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading "${currentSong.title}" via torrent`,
    });
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        preload="metadata"
      />
      
      <div className="border-t bg-card p-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={currentSong.albumArt} 
              alt={currentSong.title} 
              className="h-12 w-12 rounded-md object-cover"
            />
            <div className="text-sm">
              <p className="font-medium line-clamp-1">{currentSong.title}</p>
              <p className="text-muted-foreground text-xs">{currentSong.artist}</p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center space-y-1 flex-1 max-w-md px-4">
            <div className="player-controls flex items-center justify-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8">
                <SkipBack size={18} />
              </Button>
              <Button 
                onClick={togglePlayPause} 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} className="ml-0.5" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8">
                <SkipForward size={18} />
              </Button>
            </div>
            <div className="w-full flex items-center space-x-2 text-xs">
              <span className="w-8 text-right">{formatTime(currentTime)}</span>
              <Slider 
                value={[progress]} 
                max={100} 
                step={0.1} 
                onValueChange={handleProgressClick}
                className="flex-1"
              />
              <span className="w-8">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2">
              <Volume2 size={18} className="text-muted-foreground" />
              <Slider 
                value={[volume]} 
                max={100} 
                step={1} 
                onValueChange={(value) => setVolume(value[0])} 
                className="w-20"
              />
            </div>
            <Button 
              onClick={handleDownload}
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-primary">
              <Download size={18} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
