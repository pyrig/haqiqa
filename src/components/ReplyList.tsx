import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useReplies } from '@/hooks/useReplies';

interface Reply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  profiles?: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface ReplyListProps {
  postId: string;
}

const ReplyList = ({ postId }: ReplyListProps) => {
  const { replies, isLoading } = useReplies(postId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No replies yet. Be the first to reply!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => {
        const timeAgo = formatDistanceToNow(new Date(reply.created_at), { addSuffix: true });
        const displayName = reply.is_anonymous 
          ? 'Anonymous' 
          : reply.profiles?.display_name || reply.profiles?.username || 'User';
        const username = reply.is_anonymous 
          ? '' 
          : `@${reply.profiles?.username || 'user'}`;

        return (
          <div key={reply.id} className="flex gap-3">
            <Avatar className="w-8 h-8">
              {!reply.is_anonymous && reply.profiles?.avatar_url ? (
                <AvatarImage src={reply.profiles.avatar_url} />
              ) : null}
              <AvatarFallback className={reply.is_anonymous ? "bg-gray-100 text-gray-600" : "bg-teal-100 text-teal-600"}>
                {reply.is_anonymous ? 'A' : displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{displayName}</span>
                {username && (
                  <span className="text-gray-500 text-sm">{username}</span>
                )}
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-500 text-sm">{timeAgo.replace('about ', '')}</span>
              </div>
              <div className="text-gray-800 text-sm whitespace-pre-wrap">
                {reply.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReplyList;