
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Search, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

// Sample audio URLs (using royalty-free audio for demo)
const sampleAudioUrls = [
  "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
  "https://www.soundjay.com/misc/sounds/magic-chime-07.wav",
  "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
  "https://www.soundjay.com/misc/sounds/magic-chime-07.wav",
  "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav"
];

// Dummy data for streaming songs with audio URLs
const streamingSongs = [
  {
    id: "s1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    albumArt: "https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    genre: "Pop",
    duration: "3:20",
    audioUrl: sampleAudioUrls[0]
  },
  {
    id: "s2",
    title: "Shape of You",
    artist: "Ed Sheeran",
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    genre: "Pop",
    duration: "3:53",
    audioUrl: sampleAudioUrls[1]
  },
  {
    id: "s3",
    title: "Dance Monkey",
    artist: "Tones and I",
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    genre: "Pop",
    duration: "3:29",
    audioUrl: sampleAudioUrls[2]
  },
  {
    id: "s4",
    title: "Someone Like You",
    artist: "Adele",
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    genre: "Pop",
    duration: "4:45",
    audioUrl: sampleAudioUrls[3]
  },
  {
    id: "s5",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    genre: "Rock",
    duration: "5:55",
    audioUrl: sampleAudioUrls[4]
  },
  {
    id: "s6",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    albumArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    genre: "Rock",
    duration: "5:03",
    audioUrl: sampleAudioUrls[5]
  },
  {
    id: "s7",
    title: "Lose Yourself",
    artist: "Eminem",
    albumArt: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    genre: "Hip Hop",
    duration: "5:26",
    audioUrl: sampleAudioUrls[6]
  },
  {
    id: "s8",
    title: "In Da Club",
    artist: "50 Cent",
    albumArt: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    genre: "Hip Hop",
    duration: "3:13",
    audioUrl: sampleAudioUrls[7]
  }
];

// Genre options
const genres = ["All", "Pop", "Rock", "Hip Hop", "Electronic", "Classical", "Jazz", "Country"];

const Streaming: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { playSong } = useMusicPlayer();
  
  // Filter songs based on search term and selected genre
  const filteredSongs = streamingSongs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || song.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handlePlay = (song: typeof streamingSongs[0]) => {
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      albumArt: song.albumArt,
      audioUrl: song.audioUrl
    });
    
    toast.success(`Now playing: ${song.title} by ${song.artist}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Streaming</h1>
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 overflow-x-auto flex-wrap">
            {genres.map((genre) => (
              <TabsTrigger 
                key={genre} 
                value={genre.toLowerCase()}
                onClick={() => setSelectedGenre(genre)}
                className="whitespace-nowrap"
              >
                {genre}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => (
                  <Card key={song.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <img 
                        src={song.albumArt} 
                        alt={song.title} 
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-medium line-clamp-1">{song.title}</h3>
                        <p className="text-sm text-muted-foreground">{song.artist}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{song.duration}</span>
                          <Button 
                            onClick={() => handlePlay(song)} 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                          >
                            <Play className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Music className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No songs found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or browse a different genre
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {genres.slice(1).map((genre) => (
            <TabsContent key={genre} value={genre.toLowerCase()}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredSongs.length > 0 ? (
                  filteredSongs.filter(s => s.genre === genre || selectedGenre === "All").map((song) => (
                    <Card key={song.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <img 
                          src={song.albumArt} 
                          alt={song.title} 
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-medium line-clamp-1">{song.title}</h3>
                          <p className="text-sm text-muted-foreground">{song.artist}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{song.duration}</span>
                            <Button 
                              onClick={() => handlePlay(song)} 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                            >
                              <Play className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <Music className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No {genre} songs found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search or browse a different genre
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Streaming;
