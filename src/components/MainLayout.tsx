
import React, { useState } from 'react';
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
import { Home, Search, Library, Download, Music } from 'lucide-react';
import MusicPlayer from './MusicPlayer';
import { Link } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="p-4 sm:p-6 flex items-center justify-between">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Tune Torrent</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {children}
          </div>
          <MusicPlayer />
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
    { title: "Downloads", icon: Download, path: "/downloads" }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 px-4">
        <Music className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg">TuneTorrent</span>
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
        TuneTorrent Stream &copy; 2025
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainLayout;
