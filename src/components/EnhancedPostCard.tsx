import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bookmark, Share, AlertTriangle, BookmarkCheck, Eye, EyeOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  content: string;
  is_anonymous: boolean;
  hashtags: string[];
  created_at: string;
  media_urls?: string[];
  content_warning?: string;
  privacy_level?: string;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface EnhancedPostCardProps {
  post: Post;
}

const EnhancedPostCard = ({ post }: EnhancedPostCardProps) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showContent, setShowContent] = useState(!post.content_warning);
  const { addBookmark, removeBookmark, checkIfBookmarked, isBookmarking } = useBookmarks();
  
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  
  const displayName = post.is_anonymous 
    ? 'Anonymous' 
    : post.profiles?.display_name || post.profiles?.username || 'User';
  
  const username = post.is_anonymous 
    ? '' 
    : `@${post.profiles?.username || 'user'}`;

  useEffect(() => {
    const checkBookmark = async () => {
      const bookmarked = await checkIfBookmarked(post.id);
      setIsBookmarked(bookmarked);
    };
    checkBookmark();
  }, [post.id, checkIfBookmarked]);

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmark(post.id);
      setIsBookmarked(false);
    } else {
      addBookmark(post.id);
      setIsBookmarked(true);
    }
  };

  const handleProfileClick = () => {
    if (!post.is_anonymous && post.profiles?.username) {
      navigate(`/profile/${post.profiles.username}`);
    }
  };

  const renderFormattedContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-teal-500 hover:underline" target="_blank">$1</a>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^1\. (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  };

  const renderContentWithHashtags = (content: string) => {
    const formattedContent = renderFormattedContent(content);
    return formattedContent.split(/(\s+)/).map((word, index) => {
      if (word.startsWith('#')) {
        return `<span key="${index}" class="text-teal-600 hover:text-teal-700 cursor-pointer">${word}</span>`;
      }
      return word;
    }).join('');
  };

  const getPrivacyIcon = () => {
    switch (post.privacy_level) {
      case 'followers':
        return <Eye className="w-3 h-3 text-gray-400" />;
      case 'private':
        return <EyeOff className="w-3 h-3 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className={`flex items-center gap-3 ${!post.is_anonymous ? 'cursor-pointer hover:opacity-80' : ''}`}
          onClick={handleProfileClick}
        >
          <Avatar className="w-10 h-10">
            {!post.is_anonymous && post.profiles?.avatar_url ? (
              <AvatarImage src={post.profiles.avatar_url} />
            ) : null}
            <AvatarFallback className={post.is_anonymous ? "bg-gray-100 text-gray-600" : "bg-teal-100 text-teal-600"}>
              {post.is_anonymous ? 'A' : displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">{displayName}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              {username} {username && '•'} {timeAgo.replace('about ', '')}
              {getPrivacyIcon()}
            </div>
          </div>
        </div>
      </div>

      {post.content_warning && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Content Warning: {post.content_warning}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowContent(!showContent)}
            className="text-amber-700 border-amber-300 hover:bg-amber-100"
          >
            {showContent ? 'Hide Content' : 'Show Content'}
          </Button>
        </div>
      )}
      
      {showContent && (
        <>
          <div 
            className="text-gray-800 mb-4 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: renderContentWithHashtags(post.content) }}
          />

          {post.media_urls && post.media_urls.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              {post.media_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Media ${index + 1}`}
                  className="rounded-md object-cover w-full h-48"
                />
              ))}
            </div>
          )}
          
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {post.hashtags.map((tag, index) => {
                const colors = [
                  'text-teal-600 bg-teal-50',
                  'text-blue-600 bg-blue-50',
                  'text-purple-600 bg-purple-50',
                  'text-green-600 bg-green-50',
                  'text-orange-600 bg-orange-50',
                  'text-red-600 bg-red-50'
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <Badge key={index} variant="secondary" className={`${colorClass} hover:opacity-80 cursor-pointer`}>
                    #{tag}
                  </Badge>
                );
              })}
            </div>
          )}
        </>
      )}
      
      <div className="flex items-center gap-4 text-gray-500">
        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-gray-700">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">Reply</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-1 hover:text-gray-700 ${isBookmarked ? 'text-teal-500' : ''}`}
          onClick={handleBookmarkToggle}
          disabled={isBookmarking}
        >
          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          <span className="text-sm">{isBookmarked ? 'Saved' : 'Save'}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-gray-700">
          <Share className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </Button>
      </div>
    </div>
  );
};

export default EnhancedPostCard;
