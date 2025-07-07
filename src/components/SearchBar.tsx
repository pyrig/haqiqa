
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  type: 'user' | 'hashtag';
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
}

interface SearchBarProps {
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
}

const SearchBar = ({ onResultSelect, placeholder = "Search users and hashtags..." }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch(query.trim());
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search users
      if (!searchQuery.startsWith('#')) {
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url')
          .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
          .limit(5);

        if (usersError) throw usersError;

        users?.forEach(user => {
          searchResults.push({
            type: 'user',
            id: user.id,
            title: user.display_name || user.username || 'Unknown User',
            subtitle: user.username ? `@${user.username}` : undefined,
            avatar: user.avatar_url || undefined,
          });
        });
      }

      // Search hashtags
      const hashtagQuery = searchQuery.startsWith('#') ? searchQuery.slice(1) : searchQuery;
      const { data: posts, error: hashtagError } = await supabase
        .from('posts')
        .select('hashtags')
        .contains('hashtags', [hashtagQuery.toLowerCase()])
        .limit(10);

      if (hashtagError) throw hashtagError;

      const uniqueHashtags = new Set<string>();
      posts?.forEach(post => {
        post.hashtags?.forEach((tag: string) => {
          if (tag.toLowerCase().includes(hashtagQuery.toLowerCase())) {
            uniqueHashtags.add(tag);
          }
        });
      });

      Array.from(uniqueHashtags).slice(0, 5).forEach(hashtag => {
        searchResults.push({
          type: 'hashtag',
          id: hashtag,
          title: `#${hashtag}`,
          subtitle: 'Hashtag',
        });
      });

      setResults(searchResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Unable to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setShowResults(false);
    onResultSelect?.(result);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
          onFocus={() => query.trim().length > 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={clearSearch}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50 mt-1">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
              onClick={() => handleResultClick(result)}
            >
              {result.avatar ? (
                <img
                  src={result.avatar}
                  alt={result.title}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                  result.type === 'user' ? 'bg-teal-500' : 'bg-purple-500'
                }`}>
                  {result.type === 'user' ? result.title.charAt(0).toUpperCase() : '#'}
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">{result.title}</div>
                {result.subtitle && (
                  <div className="text-sm text-gray-500">{result.subtitle}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
