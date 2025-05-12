
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  albumArt: string;
  torrentUrl?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  year: number;
  songs: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  coverArt: string;
  songs: Song[];
}

// Dummy songs for testing UI
export const dummySongs: Song[] = [
  {
    id: "1",
    title: "Starlight",
    artist: "Stellar Waves",
    album: "Cosmic Journey",
    duration: 187,
    albumArt: "https://via.placeholder.com/300/8B5CF6/FFFFFF?text=Cosmic+Journey"
  },
  {
    id: "2",
    title: "Ocean Breeze",
    artist: "Aqua Dreams",
    album: "Sea of Tranquility",
    duration: 224,
    albumArt: "https://via.placeholder.com/300/6E59A5/FFFFFF?text=Sea+of+Tranquility"
  },
  {
    id: "3",
    title: "Mountain High",
    artist: "Alpine Echo",
    album: "Summit",
    duration: 195,
    albumArt: "https://via.placeholder.com/300/D946EF/FFFFFF?text=Summit"
  },
  {
    id: "4",
    title: "Urban Jungle",
    artist: "City Beats",
    album: "Concrete Rhythms",
    duration: 231,
    albumArt: "https://via.placeholder.com/300/D6BCFA/FFFFFF?text=Concrete+Rhythms"
  },
  {
    id: "5",
    title: "Desert Wind",
    artist: "Sand Drifters",
    album: "Oasis",
    duration: 204,
    albumArt: "https://via.placeholder.com/300/8B5CF6/FFFFFF?text=Oasis"
  },
  {
    id: "6",
    title: "Electric Dreams",
    artist: "Neon Pulse",
    album: "Synthwave Nights",
    duration: 198,
    albumArt: "https://via.placeholder.com/300/6E59A5/FFFFFF?text=Synthwave+Nights"
  }
];

export const featuredAlbums: Album[] = [
  {
    id: "1",
    title: "Cosmic Journey",
    artist: "Stellar Waves",
    coverArt: "https://via.placeholder.com/300/8B5CF6/FFFFFF?text=Cosmic+Journey",
    year: 2024,
    songs: dummySongs.slice(0, 3)
  },
  {
    id: "2",
    title: "Sea of Tranquility",
    artist: "Aqua Dreams",
    coverArt: "https://via.placeholder.com/300/6E59A5/FFFFFF?text=Sea+of+Tranquility",
    year: 2023,
    songs: dummySongs.slice(1, 4)
  },
  {
    id: "3",
    title: "Summit",
    artist: "Alpine Echo",
    coverArt: "https://via.placeholder.com/300/D946EF/FFFFFF?text=Summit",
    year: 2024,
    songs: dummySongs.slice(2, 5)
  },
  {
    id: "4",
    title: "Concrete Rhythms",
    artist: "City Beats",
    coverArt: "https://via.placeholder.com/300/D6BCFA/FFFFFF?text=Concrete+Rhythms",
    year: 2022,
    songs: dummySongs.slice(3, 6)
  }
];

export const playlists: Playlist[] = [
  {
    id: "1",
    name: "Chill Vibes",
    coverArt: "https://via.placeholder.com/300/8B5CF6/FFFFFF?text=Chill+Vibes",
    songs: dummySongs.slice(0, 4)
  },
  {
    id: "2",
    name: "Workout Mix",
    coverArt: "https://via.placeholder.com/300/6E59A5/FFFFFF?text=Workout+Mix",
    songs: dummySongs.slice(2, 6)
  },
  {
    id: "3",
    name: "Focus Zone",
    coverArt: "https://via.placeholder.com/300/D946EF/FFFFFF?text=Focus+Zone",
    songs: dummySongs.slice(1, 5)
  }
];

export const recentlyPlayed = dummySongs.slice(0, 3);
