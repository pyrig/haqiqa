
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

export const useDiscoveryPosts = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['discovery-posts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles!inner (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('privacy_level', 'public')
        .order('created_at', { ascending: false });

      // If user is logged in, exclude their own posts and posts from followed users
      if (user) {
        const { data: follows } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);
        
        const followedIds = follows?.map(f => f.following_id) || [];
        const excludeIds = [user.id, ...followedIds];
        
        query = query.not('user_id', 'in', `(${excludeIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching discovery posts:', error);
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
