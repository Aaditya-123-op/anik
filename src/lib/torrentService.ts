
import { toast } from 'sonner';
import { Song } from './dummyData';

// This is a mock implementation of a torrent service
// In a real application, you would use a torrent library like WebTorrent

interface DownloadProgress {
  songId: string;
  progress: number;
  status: 'queued' | 'downloading' | 'completed' | 'error';
  error?: string;
}

class TorrentService {
  private downloads: Map<string, DownloadProgress> = new Map();
  
  // Start downloading a song via torrent
  public downloadSong(song: Song): void {
    if (!song.torrentUrl) {
      toast.error(`No torrent link available for "${song.title}"`);
      return;
    }
    
    // Check if already downloading
    if (this.downloads.has(song.id)) {
      toast.info(`"${song.title}" is already in your download queue`);
      return;
    }
    
    // Add to downloads map
    this.downloads.set(song.id, {
      songId: song.id,
      progress: 0,
      status: 'queued',
    });
    
    toast.success(`Added "${song.title}" to download queue`);
    
    // Simulate download progress
    this.simulateDownloadProgress(song.id);
  }
  
  // Get the progress of a download
  public getDownloadProgress(songId: string): DownloadProgress | undefined {
    return this.downloads.get(songId);
  }
  
  // Get all current downloads
  public getAllDownloads(): DownloadProgress[] {
    return Array.from(this.downloads.values());
  }
  
  // Cancel a download
  public cancelDownload(songId: string): void {
    if (this.downloads.has(songId)) {
      this.downloads.delete(songId);
      toast.info("Download canceled");
    }
  }
  
  // Mock implementation to simulate download progress
  private simulateDownloadProgress(songId: string): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      
      if (progress >= 100) {
        progress = 100;
        this.downloads.set(songId, {
          songId,
          progress,
          status: 'completed',
        });
        toast.success("Download completed!");
        clearInterval(interval);
      } else {
        this.downloads.set(songId, {
          songId,
          progress,
          status: 'downloading',
        });
      }
      
      // Randomly simulate error (10% chance)
      if (Math.random() < 0.02 && progress < 90) {
        this.downloads.set(songId, {
          songId,
          progress,
          status: 'error',
          error: 'Connection lost',
        });
        toast.error("Download error: Connection lost");
        clearInterval(interval);
      }
    }, 500);
  }
}

// Export as singleton
export const torrentService = new TorrentService();
