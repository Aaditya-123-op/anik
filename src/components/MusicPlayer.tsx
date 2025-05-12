
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { dummySongs } from '@/lib/dummyData';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState(dummySongs[0]);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.2;
        });
      }, 200);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading "${currentSong.title}" via torrent`,
    });
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  // Calculate time based on progress
  const totalTime = 3 * 60; // 3 minutes in seconds
  const currentTime = (progress / 100) * totalTime;

  return (
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
            <div className="song-progress flex-1">
              <div className="song-progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="w-8">{formatTime(totalTime)}</span>
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
  );
};

export default MusicPlayer;
