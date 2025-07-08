import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useReplies } from '@/hooks/useReplies';
import { supabase } from '@/integrations/supabase/client';

interface ReplyComposerProps {
  postId: string;
  onReplyPosted?: () => void;
}

interface Profile {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

const ReplyComposer = ({ postId, onReplyPosted }: ReplyComposerProps) => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { user } = useAuth();
  const { createReply, isCreating } = useReplies(postId);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('username, display_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      setProfile(data);
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createReply({
      post_id: postId,
      content: content.trim(),
      is_anonymous: isAnonymous,
    });

    setContent('');
    onReplyPosted?.();
  };

  if (!user) return null;

  const displayName = profile?.display_name || profile?.username || 'User';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          {!isAnonymous && profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} />
          ) : null}
          <AvatarFallback className={isAnonymous ? "bg-gray-100 text-gray-600" : "bg-teal-100 text-teal-600"}>
            {isAnonymous ? 'A' : displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a reply..."
            className="min-h-[80px] resize-none"
            disabled={isCreating}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="anonymous-reply"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
            disabled={isCreating}
          />
          <Label htmlFor="anonymous-reply" className="text-sm text-gray-600">
            Reply anonymously
          </Label>
        </div>
        
        <Button 
          type="submit" 
          disabled={!content.trim() || isCreating}
          size="sm"
        >
          {isCreating ? 'Posting...' : 'Reply'}
        </Button>
      </div>
    </form>
  );
};

export default ReplyComposer;