
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Compass, Bookmark, User, Settings } from 'lucide-react';
import PostFeed from '@/components/PostFeed';
import DiscoverTab from '@/components/DiscoverTab';
import Bookmarks from '@/pages/Bookmarks';
import ProfileTab from '@/components/ProfileTab';
import SettingsTab from '@/components/SettingsTab';

const TabNavigation = () => {
  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-6">
        <TabsTrigger value="home" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </TabsTrigger>
        <TabsTrigger value="discover" className="flex items-center gap-2">
          <Compass className="w-4 h-4" />
          <span className="hidden sm:inline">Discover</span>
        </TabsTrigger>
        <TabsTrigger value="bookmarks" className="flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          <span className="hidden sm:inline">Bookmarks</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="home" className="mt-0">
        <PostFeed />
      </TabsContent>

      <TabsContent value="discover" className="mt-0">
        <DiscoverTab />
      </TabsContent>

      <TabsContent value="bookmarks" className="mt-0">
        <Bookmarks />
      </TabsContent>

      <TabsContent value="profile" className="mt-0">
        <ProfileTab />
      </TabsContent>

      <TabsContent value="settings" className="mt-0">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default TabNavigation;
