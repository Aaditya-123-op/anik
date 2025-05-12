
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dummySongs, featuredAlbums, playlists } from '@/lib/dummyData';
import { Play, Download } from 'lucide-react';
import { toast } from 'sonner';

const Library: React.FC = () => {
  const handlePlay = () => {
    toast.success("Playing track");
  };
  
  const handleDownload = () => {
    toast.success("Download started");
  };
  
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Your Library</h1>
      
      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="songs">Songs</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>
        
        {/* Songs Tab */}
        <TabsContent value="songs">
          <div className="bg-card rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-secondary">
                <tr className="text-left">
                  <th className="px-4 py-3 text-sm w-12">#</th>
                  <th className="px-4 py-3 text-sm">Title</th>
                  <th className="px-4 py-3 text-sm hidden sm:table-cell">Artist</th>
                  <th className="px-4 py-3 text-sm hidden md:table-cell">Album</th>
                  <th className="px-4 py-3 text-sm w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {dummySongs.map((song, index) => (
                  <tr 
                    key={song.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img 
                        src={song.albumArt} 
                        alt={song.title} 
                        className="h-10 w-10 rounded object-cover hidden sm:block"
                      />
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {song.artist}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {song.artist}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {song.album}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          onClick={handlePlay}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8">
                          <Play size={16} />
                        </Button>
                        <Button 
                          onClick={handleDownload}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8">
                          <Download size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        {/* Albums Tab */}
        <TabsContent value="albums">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {featuredAlbums.map((album) => (
              <div key={album.id} className="text-center">
                <img 
                  src={album.coverArt} 
                  alt={album.title} 
                  className="album-image w-full aspect-square rounded-md object-cover mb-3"
                />
                <h3 className="font-medium line-clamp-1">{album.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{album.artist}</p>
                <Button 
                  onClick={handlePlay} 
                  variant="secondary" 
                  size="sm" 
                  className="w-full">
                  <Play size={14} className="mr-1" /> Play
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Playlists Tab */}
        <TabsContent value="playlists">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="bg-card rounded-lg overflow-hidden border">
                <img 
                  src={playlist.coverArt} 
                  alt={playlist.name} 
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-1">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {playlist.songs.length} songs
                  </p>
                  <Button 
                    onClick={handlePlay} 
                    variant="outline" 
                    size="sm" 
                    className="w-full">
                    <Play size={14} className="mr-1" /> Play All
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Library;
