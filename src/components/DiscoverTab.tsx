
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Hash } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import EnhancedPostCard from '@/components/EnhancedPostCard';

const DiscoverTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { posts, isLoading } = usePosts();

  // Sample trending tags - in a real app, these would come from your backend
  const trendingTags = [
    { tag: 'photography', count: 245, color: 'text-blue-600 bg-blue-50' },
    { tag: 'design', count: 189, color: 'text-purple-600 bg-purple-50' },
    { tag: 'technology', count: 156, color: 'text-green-600 bg-green-50' },
    { tag: 'travel', count: 134, color: 'text-orange-600 bg-orange-50' },
    { tag: 'food', count: 98, color: 'text-red-600 bg-red-50' },
    { tag: 'music', count: 87, color: 'text-teal-600 bg-teal-50' },
  ];

  // Filter posts based on search query or selected tag
  const filteredPosts = posts.filter(post => {
    if (selectedTag) {
      return post.hashtags?.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());
    }
    if (searchQuery) {
      return post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.hashtags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search posts and hashtags..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedTag(null);
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Trending Tags */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Trending Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((item) => (
            <Button
              key={item.tag}
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTag(item.tag);
                setSearchQuery('');
              }}
              className={`${item.color} hover:opacity-80 p-2 h-auto`}
            >
              <Hash className="w-3 h-3 mr-1" />
              {item.tag}
              <span className="ml-2 text-xs opacity-70">({item.count})</span>
            </Button>
          ))}
        </div>
        {selectedTag && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTag(null)}
            className="mt-3"
          >
            Clear filter
          </Button>
        )}
      </div>

      {/* Search Results or All Posts */}
      <div>
        {(searchQuery || selectedTag) && (
          <div className="bg-white rounded-lg p-4 shadow-sm border mb-4">
            <p className="text-sm text-gray-600">
              {selectedTag 
                ? `Posts tagged with #${selectedTag} (${filteredPosts.length})`
                : `Search results for "${searchQuery}" (${filteredPosts.length})`
              }
            </p>
          </div>
        )}
        
        {isLoading ? (
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
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">
              {selectedTag 
                ? `No posts found with #${selectedTag} tag.`
                : searchQuery 
                ? `No posts match "${searchQuery}".`
                : "No posts available."}
            </p>
          </div>
        ) : (
          <div>
            {filteredPosts.map((post) => (
              <EnhancedPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverTab;
