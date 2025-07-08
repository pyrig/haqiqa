
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, RotateCcw, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Replies from './Replies';
import ReplyComposer from './ReplyComposer';
import { useReplies } from '@/hooks/useReplies';

interface Post {
  id: string;
  content: string;
  is_anonymous: boolean;
  hashtags: string[];
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showQuickReply, setShowQuickReply] = useState(false);
  const { replies } = useReplies(post.id);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  const handleQuickReplyPosted = () => {
    setShowQuickReply(false);
  };
  
  const displayName = post.is_anonymous 
    ? 'Anonymous' 
    : post.profiles?.display_name || post.profiles?.username || 'User';
  
  const username = post.is_anonymous 
    ? '' 
    : `@${post.profiles?.username || 'user'}`;

  const renderContentWithHashtags = (content: string) => {
    return content.split(/(\s+)/).map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <span key={index} className="text-teal-600 hover:text-teal-700 cursor-pointer">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-10 h-10">
          {!post.is_anonymous && post.profiles?.avatar_url ? (
            <AvatarImage src={post.profiles.avatar_url} />
          ) : null}
          <AvatarFallback className={post.is_anonymous ? "bg-gray-100 text-gray-600" : "bg-teal-100 text-teal-600"}>
            {post.is_anonymous ? 'A' : displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{displayName}</div>
          <div className="text-sm text-gray-500">
            {username} {username && '•'} {timeAgo.replace('about ', '')}
          </div>
        </div>
      </div>
      
      <div className="text-gray-800 mb-4 whitespace-pre-wrap">
        {renderContentWithHashtags(post.content)}
      </div>
      
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
      
      <div className="flex items-center gap-4 text-gray-500">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 hover:text-gray-700"
          onClick={() => setShowQuickReply(!showQuickReply)}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">Quick Reply</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 hover:text-gray-700"
          onClick={() => setShowReplies(!showReplies)}
        >
          <span className="text-sm">View Replies ({replies.length})</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-gray-700">
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Save</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-gray-700">
          <Share className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </Button>
      </div>

      {/* Quick Reply Composer */}
      {showQuickReply && (
        <div className="border-t pt-4 mt-4">
          <ReplyComposer postId={post.id} onReplyPosted={handleQuickReplyPosted} />
        </div>
      )}

      {/* Show first 2 replies preview */}
      {replies.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <div className="space-y-3">
            {replies.slice(0, 2).map((reply) => {
              const timeAgo = formatDistanceToNow(new Date(reply.created_at), { addSuffix: true });
              const displayName = reply.is_anonymous 
                ? 'Anonymous' 
                : reply.profiles?.display_name || reply.profiles?.username || 'User';
              const username = reply.is_anonymous 
                ? '' 
                : `@${reply.profiles?.username || 'user'}`;

              return (
                <div key={reply.id} className="flex gap-3">
                  <Avatar className="w-6 h-6">
                    {!reply.is_anonymous && reply.profiles?.avatar_url ? (
                      <AvatarImage src={reply.profiles.avatar_url} />
                    ) : null}
                    <AvatarFallback className={reply.is_anonymous ? "bg-gray-100 text-gray-600 text-xs" : "bg-teal-100 text-teal-600 text-xs"}>
                      {reply.is_anonymous ? 'A' : displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-xs">{displayName}</span>
                      {username && (
                        <span className="text-gray-500 text-xs">{username}</span>
                      )}
                      <span className="text-gray-500 text-xs">•</span>
                      <span className="text-gray-500 text-xs">{timeAgo.replace('about ', '')}</span>
                    </div>
                    <div className="text-gray-800 text-xs">
                      {reply.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {replies.length > 2 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3 text-teal-600 hover:text-teal-700 text-xs p-0 h-auto"
              onClick={() => setShowReplies(true)}
            >
              Show all {replies.length} replies
            </Button>
          )}
        </div>
      )}

      <Replies 
        postId={post.id} 
        isOpen={showReplies} 
        onToggle={() => setShowReplies(!showReplies)} 
      />
    </div>
  );
};

export default PostCard;
