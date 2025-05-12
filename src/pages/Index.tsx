
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Play } from 'lucide-react';
import { featuredAlbums, dummySongs, playlists, recentlyPlayed } from '@/lib/dummyData';
import { toast } from 'sonner';
import { torrentService } from '@/lib/torrentService';

const Index: React.FC = () => {
  const handlePlay = () => {
    // In a real app, this would play the selected track
    toast("Playing track", {
      description: "Music playback would start here"
    });
  };

  const handleDownload = (songId: string, songTitle: string) => {
    // In a real app, this would initiate a torrent download
    toast("Torrent download initiated", {
      description: `Starting download for "${songTitle}"`
    });
    
    torrentService.downloadSong({
      ...dummySongs.find(song => song.id === songId)!,
      torrentUrl: `magnet:?mocklink&${songId}`
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-music-dark to-music p-6 md:p-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Discover & Download Music</h1>
              <p className="text-sm md:text-base text-gray-200 max-w-md">
                Stream your favorite tracks and download them via torrent directly in the app
              </p>
            </div>
            <Button className="bg-white text-music hover:bg-gray-100">
              Explore Library
            </Button>
          </div>
          <div className="absolute bottom-0 right-0 opacity-10">
            <svg className="w-64 h-64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
              <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </section>

        {/* Recently Played */}
        <section>
          <h2 className="text-xl font-bold mb-4">Recently Played</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyPlayed.map((song) => (
              <Card key={song.id} className="bg-card border-border overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={song.albumArt} 
                    alt={song.title} 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-1">{song.title}</h3>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                    <div className="flex mt-3 gap-2">
                      <Button 
                        onClick={handlePlay}
                        variant="secondary" 
                        size="sm" 
                        className="flex-1">
                        <Play size={16} className="mr-1" /> Play
                      </Button>
                      <Button 
                        onClick={() => handleDownload(song.id, song.title)}
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8">
                        <Download size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Albums */}
        <section>
          <h2 className="text-xl font-bold mb-4">Featured Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredAlbums.map((album) => (
              <div key={album.id} className="text-center">
                <img 
                  src={album.coverArt} 
                  alt={album.title} 
                  className="album-image w-full aspect-square rounded-md object-cover mb-2"
                />
                <h3 className="font-medium line-clamp-1">{album.title}</h3>
                <p className="text-sm text-muted-foreground">{album.artist}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Playlists */}
        <section>
          <h2 className="text-xl font-bold mb-4">Popular Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="bg-card border-border overflow-hidden">
                <CardContent className="p-4">
                  <img 
                    src={playlist.coverArt} 
                    alt={playlist.name} 
                    className="w-full aspect-square rounded-md object-cover mb-3"
                  />
                  <h3 className="font-medium">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {playlist.songs.length} songs
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
