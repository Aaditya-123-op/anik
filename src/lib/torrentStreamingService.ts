
import { toast } from 'sonner';
import WebTorrent from 'webtorrent';

interface StreamingSong {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  magnetUrl?: string;
  torrentUrl?: string;
}

interface StreamProgress {
  songId: string;
  progress: number;
  downloadSpeed: number;
  uploadSpeed: number;
  peers: number;
  status: 'connecting' | 'downloading' | 'ready' | 'streaming' | 'error';
  streamUrl?: string;
  error?: string;
}

class TorrentStreamingService {
  private client: WebTorrent.Instance;
  private streams: Map<string, StreamProgress> = new Map();
  private torrents: Map<string, WebTorrent.Torrent> = new Map();

  constructor() {
    this.client = new WebTorrent();
    console.log('TorrentStreamingService initialized');
  }

  // Start streaming a song via torrent
  public streamSong(song: StreamingSong): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!song.magnetUrl && !song.torrentUrl) {
        const error = `No torrent link available for "${song.title}"`;
        toast.error(error);
        reject(new Error(error));
        return;
      }

      // Check if already streaming
      const existing = this.streams.get(song.id);
      if (existing && existing.streamUrl) {
        resolve(existing.streamUrl);
        return;
      }

      // Initialize stream progress
      this.streams.set(song.id, {
        songId: song.id,
        progress: 0,
        downloadSpeed: 0,
        uploadSpeed: 0,
        peers: 0,
        status: 'connecting'
      });

      const magnetUri = song.magnetUrl || song.torrentUrl!;
      console.log(`Starting torrent stream for: ${song.title}`);

      const torrent = this.client.add(magnetUri, {
        announce: [
          'wss://tracker.btorrent.xyz',
          'wss://tracker.openwebtorrent.com'
        ]
      });

      this.torrents.set(song.id, torrent);

      torrent.on('ready', () => {
        console.log(`Torrent ready for: ${song.title}`);
        
        // Find the largest file (likely the audio file)
        const file = torrent.files.reduce((largest, file) => 
          file.length > largest.length ? file : largest
        );

        if (file) {
          const streamUrl = file.streamURL;
          
          this.streams.set(song.id, {
            songId: song.id,
            progress: 0,
            downloadSpeed: torrent.downloadSpeed,
            uploadSpeed: torrent.uploadSpeed,
            peers: torrent.numPeers,
            status: 'ready',
            streamUrl
          });

          toast.success(`Ready to stream: ${song.title}`);
          resolve(streamUrl);
        } else {
          const error = 'No audio file found in torrent';
          this.handleError(song.id, error);
          reject(new Error(error));
        }
      });

      torrent.on('download', () => {
        this.updateProgress(song.id, torrent);
      });

      torrent.on('upload', () => {
        this.updateProgress(song.id, torrent);
      });

      torrent.on('error', (err) => {
        console.error(`Torrent error for ${song.title}:`, err);
        this.handleError(song.id, err.message);
        reject(err);
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!this.streams.get(song.id)?.streamUrl) {
          this.handleError(song.id, 'Connection timeout');
          reject(new Error('Connection timeout'));
        }
      }, 30000);
    });
  }

  // Get streaming progress
  public getStreamProgress(songId: string): StreamProgress | undefined {
    return this.streams.get(songId);
  }

  // Get all streams
  public getAllStreams(): StreamProgress[] {
    return Array.from(this.streams.values());
  }

  // Stop streaming a song
  public stopStream(songId: string): void {
    const torrent = this.torrents.get(songId);
    if (torrent) {
      torrent.destroy();
      this.torrents.delete(songId);
    }
    this.streams.delete(songId);
    toast.info('Stream stopped');
  }

  // Update progress for a torrent
  private updateProgress(songId: string, torrent: WebTorrent.Torrent): void {
    const current = this.streams.get(songId);
    if (current) {
      this.streams.set(songId, {
        ...current,
        progress: Math.round(torrent.progress * 100),
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed: torrent.uploadSpeed,
        peers: torrent.numPeers,
        status: torrent.progress > 0.1 ? 'streaming' : 'downloading'
      });
    }
  }

  // Handle errors
  private handleError(songId: string, error: string): void {
    this.streams.set(songId, {
      songId,
      progress: 0,
      downloadSpeed: 0,
      uploadSpeed: 0,
      peers: 0,
      status: 'error',
      error
    });
    toast.error(`Streaming error: ${error}`);
  }

  // Cleanup all torrents
  public cleanup(): void {
    this.client.destroy();
    this.streams.clear();
    this.torrents.clear();
  }
}

// Export as singleton
export const torrentStreamingService = new TorrentStreamingService();
