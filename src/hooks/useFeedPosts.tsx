
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
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.in.(select following_id from follows where follower_id = ${user.id})`)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching feed posts:', postsError);
        throw postsError;
      }

      if (!postsData || postsData.length === 0) return [];

      // Get all unique user IDs from posts
      const userIds = [...new Set(postsData.map(post => post.user_id))];
      
      // Fetch profiles for all users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Create a map of profiles by user ID
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Combine posts with profile data
      return postsData.map(post => ({
        ...post,
        media_urls: Array.isArray(post.media_urls) ? post.media_urls as string[] : [],
        hashtags: post.hashtags || [],
        profiles: profilesMap.get(post.user_id) || null
      } as Post));
    },
  });

  return {
    posts,
    isLoading,
  };
};
