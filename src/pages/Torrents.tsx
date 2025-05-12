
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Download, Music, Search as SearchIcon, Info } from 'lucide-react';
import { dummySongs, Song } from '@/lib/dummyData';
import { toast } from 'sonner';
import { torrentService } from '@/lib/torrentService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Torrents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("discover");

  const popularTorrents = dummySongs.map(song => ({
    ...song,
    seeders: Math.floor(Math.random() * 1000) + 50,
    leechers: Math.floor(Math.random() * 100) + 5,
    size: `${(Math.random() * 10 + 2).toFixed(1)} MB`,
    quality: Math.random() > 0.5 ? "320 kbps" : "FLAC"
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // Filter songs that match the query
      const filtered = dummySongs.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const results = filtered.map(song => ({
        ...song,
        seeders: Math.floor(Math.random() * 1000) + 50,
        leechers: Math.floor(Math.random() * 100) + 5,
        size: `${(Math.random() * 10 + 2).toFixed(1)} MB`,
        quality: Math.random() > 0.5 ? "320 kbps" : "FLAC"
      }));
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleDownload = (song: Song) => {
    toast.success(`Starting torrent download for "${song.title}"`);
    torrentService.downloadSong({
      ...song,
      torrentUrl: `magnet:?mocklink&${song.id}`
    });
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Music Torrents</h1>
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search torrents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </div>
        
        <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="search">Search Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularTorrents.map((torrent) => (
                <TorrentCard key={torrent.id} torrent={torrent} onDownload={handleDownload} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            {isSearching && (
              <div className="flex flex-col items-center justify-center py-8">
                <SearchIcon className="h-8 w-8 text-muted-foreground animate-pulse mb-2" />
                <p>Searching torrents...</p>
              </div>
            )}
            
            {activeTab === "search" && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? `No torrents found for "${searchQuery}"` : "Search for music torrents above"}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((torrent) => (
                <TorrentCard key={torrent.id} torrent={torrent} onDownload={handleDownload} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

interface TorrentCardProps {
  torrent: Song & {
    seeders?: number;
    leechers?: number;
    size?: string;
    quality?: string;
  };
  onDownload: (song: Song) => void;
}

const TorrentCard: React.FC<TorrentCardProps> = ({ torrent, onDownload }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <img 
            src={torrent.albumArt} 
            alt={torrent.title} 
            className="h-16 w-16 rounded object-cover"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium line-clamp-1">{torrent.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {torrent.artist} • {torrent.album}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      <span>{torrent.seeders}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Seeders</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Badge variant="outline" className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                <span>{torrent.size}</span>
              </Badge>
              
              <Badge className="bg-primary/20 hover:bg-primary/30 text-primary">
                {torrent.quality}
              </Badge>
            </div>
          </div>
          
          <Button 
            onClick={() => onDownload(torrent)}
            variant="secondary" 
            size="sm"
            className="h-8 flex gap-1 items-center">
            <Download size={16} />
            <span>Download</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Torrents;
