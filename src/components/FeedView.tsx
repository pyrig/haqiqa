
import { useFeedPosts } from '@/hooks/useFeedPosts';
import FeedPostCard from './FeedPostCard';

const FeedView = () => {
  const { posts, isLoading } = useFeedPosts();

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

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your feed is empty</h3>
        <p className="text-gray-600">Follow some users or create your first post to see content here!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <FeedPostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default FeedView;
