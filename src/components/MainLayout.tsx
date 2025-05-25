
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Home, Search, Library, Download, Music, LogIn, Share2 } from 'lucide-react';
import MusicPlayer from './MusicPlayer';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentSong } = useMusicPlayer();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="p-4 sm:p-6 flex items-center justify-between">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
              <span className="text-sm font-medium">Anik</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {children}
          </div>
          <MusicPlayer currentSong={currentSong} />
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const menuItems = [
    { title: "Home", icon: Home, path: "/" },
    { title: "Search", icon: Search, path: "/search" },
    { title: "Library", icon: Library, path: "/library" },
    { title: "Streaming", icon: Music, path: "/streaming" },
    { title: "Downloads", icon: Download, path: "/downloads" },
    { title: "Torrents", icon: Share2, path: "/torrents" }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 px-4">
        <Music className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">Anik</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Browse Music</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-2 text-xs text-center text-muted-foreground">
        Anik Stream &copy; 2025
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainLayout;
