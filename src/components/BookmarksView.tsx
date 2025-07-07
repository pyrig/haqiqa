
import { useBookmarks } from '@/hooks/useBookmarks';
import FeedPostCard from '@/components/FeedPostCard';

const BookmarksView = () => {
  const { bookmarks, isLoading } = useBookmarks();

  if (isLoading) {
    return (
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
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
        <p className="text-gray-600">Save posts to read them later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookmarks.map((bookmark) => {
        // Transform the bookmark data to match Post interface
        const post = {
          ...bookmark.posts,
          media_urls: Array.isArray(bookmark.posts.media_urls) 
            ? bookmark.posts.media_urls as string[] 
            : [],
          hashtags: bookmark.posts.hashtags || [],
          profiles: bookmark.posts.profiles ? {
            username: bookmark.posts.profiles.username || '',
            display_name: bookmark.posts.profiles.display_name || '',
            avatar_url: bookmark.posts.profiles.avatar_url || ''
          } : null
        };
        
        return (
          <FeedPostCard key={bookmark.id} post={post} />
        );
      })}
    </div>
  );
};

export default BookmarksView;
