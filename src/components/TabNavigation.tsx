
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, Bookmark, Compass } from "lucide-react";
import PostFeed from "./PostFeed";
import EnhancedPostComposer from "./EnhancedPostComposer";
import { useBookmarks } from "@/hooks/useBookmarks";
import EnhancedPostCard from "./EnhancedPostCard";

const TabNavigation = () => {
  const { bookmarks, isLoading: bookmarksLoading } = useBookmarks();

  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
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
      </TabsList>

      <TabsContent value="home" className="space-y-6">
        <EnhancedPostComposer />
        <PostFeed />
      </TabsContent>

      <TabsContent value="discover" className="space-y-6">
        <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Discover New Content</h3>
          <p className="text-gray-600">Explore trending posts and find new creators to follow!</p>
        </div>
        <PostFeed />
      </TabsContent>

      <TabsContent value="bookmarks" className="space-y-6">
        {bookmarksLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600">Save posts to read them later!</p>
          </div>
        ) : (
          <div>
            {bookmarks.map((bookmark) => {
              const post = {
                ...bookmark.posts,
                media_urls: Array.isArray(bookmark.posts.media_urls) ? bookmark.posts.media_urls : [],
                hashtags: bookmark.posts.hashtags || [],
              };
              return <EnhancedPostCard key={bookmark.id} post={post} />;
            })}
          </div>
        )}
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your Profile</h3>
          <p className="text-gray-600">Manage your profile and view your posts!</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TabNavigation;
