
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Play, Search as SearchIcon } from 'lucide-react';
import { dummySongs, Song } from '@/lib/dummyData';
import { toast } from 'sonner';
import { torrentService } from '@/lib/torrentService';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

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
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const handleDownload = (song: Song) => {
    toast.success(`Starting download for "${song.title}"`);
    torrentService.downloadSong({
      ...song,
      torrentUrl: `magnet:?mocklink&${song.id}`
    });
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-6">Find Music</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>
        
        <div className="space-y-4">
          {searchResults.length === 0 && searchQuery && !isSearching && (
            <div className="text-center py-8 text-muted-foreground">
              No results found for "{searchQuery}"
            </div>
          )}
          
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-8">
              <SearchIcon className="h-8 w-8 text-muted-foreground animate-pulse mb-2" />
              <p>Searching...</p>
            </div>
          )}
          
          {searchResults.map((song) => (
            <div 
              key={song.id} 
              className="flex items-center gap-3 bg-card p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <img 
                src={song.albumArt} 
                alt={song.title} 
                className="h-12 w-12 rounded object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium line-clamp-1">{song.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {song.artist} • {song.album}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full text-primary">
                  <Play size={18} />
                </Button>
                <Button 
                  onClick={() => handleDownload(song)}
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full">
                  <Download size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Search;
