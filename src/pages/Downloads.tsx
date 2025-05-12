
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pause, Play, X } from 'lucide-react';
import { dummySongs } from '@/lib/dummyData';
import { torrentService } from '@/lib/torrentService';

const Downloads: React.FC = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  
  // Poll for download updates
  useEffect(() => {
    const interval = setInterval(() => {
      const currentDownloads = torrentService.getAllDownloads();
      
      // Attach song info to each download
      const downloadsWithInfo = currentDownloads.map(download => {
        const song = dummySongs.find(s => s.id === download.songId);
        return {
          ...download,
          songInfo: song
        };
      });
      
      setDownloads(downloadsWithInfo);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleCancelDownload = (songId: string) => {
    torrentService.cancelDownload(songId);
  };
  
  // Handle empty state
  if (downloads.length === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-full py-16">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-muted-foreground" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">No Downloads</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Your downloads will appear here. Start downloading music by browsing the app.
          </p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Downloads</h1>
        
        <div className="space-y-4">
          {downloads.map((download) => (
            <div 
              key={download.songId} 
              className="bg-card border rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src={download.songInfo?.albumArt} 
                  alt={download.songInfo?.title} 
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{download.songInfo?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {download.songInfo?.artist}
                  </p>
                </div>
                <div className="flex gap-2">
                  {download.status === 'downloading' ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pause size={16} />
                    </Button>
                  ) : download.status === 'completed' ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500">
                      <Play size={16} />
                    </Button>
                  ) : null}
                  
                  {download.status !== 'completed' && (
                    <Button 
                      onClick={() => handleCancelDownload(download.songId)}
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:text-destructive">
                      <X size={16} />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>
                    {download.status === 'downloading' 
                      ? 'Downloading...' 
                      : download.status === 'completed'
                      ? 'Completed'
                      : download.status === 'error'
                      ? `Error: ${download.error}`
                      : 'Queued'}
                  </span>
                  <span>{Math.round(download.progress)}%</span>
                </div>
                <Progress 
                  value={download.progress} 
                  className={
                    download.status === 'completed' 
                      ? 'bg-secondary'
                      : download.status === 'error'
                      ? 'bg-red-900/20'
                      : 'bg-secondary'
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Downloads;
