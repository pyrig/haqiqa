
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Post {
  id: string;
  content: string;
  is_anonymous: boolean;
  media_urls: string[];
  hashtags: string[];
  created_at: string;
  user_id: string;
  content_warning?: string;
  privacy_level?: string;
  profiles?: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useFeedPosts = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['feed-posts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get posts from followed users and own posts
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!inner (
            username,
            display_name,
            avatar_url
          )
        `)
        .or(`user_id.eq.${user.id},user_id.in.(select following_id from follows where follower_id = ${user.id})`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feed posts:', error);
        throw error;
      }

      return (data || []).map(post => ({
        ...post,
        media_urls: Array.isArray(post.media_urls) ? post.media_urls as string[] : [],
        hashtags: post.hashtags || [],
        profiles: post.profiles || null
      } as Post));
    },
  });

  return {
    posts,
    isLoading,
  };
};
