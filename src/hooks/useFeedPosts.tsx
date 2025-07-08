
import { useInfiniteQuery } from '@tanstack/react-query';
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

const POSTS_PER_PAGE = 10;

export const useFeedPosts = () => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['feed-posts'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          posts: [],
          hasMore: false,
        };
      }

      // First get followed user IDs
      const { data: follows, error: followsError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (followsError) {
        console.error('Error fetching follows:', followsError);
        throw followsError;
      }

      const followedIds = follows?.map(f => f.following_id) || [];
      const allUserIds = [user.id, ...followedIds];

      // Get posts from followed users and own posts with pagination
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .in('user_id', allUserIds)
        .order('created_at', { ascending: false })
        .range(pageParam * POSTS_PER_PAGE, (pageParam + 1) * POSTS_PER_PAGE - 1);

      if (postsError) {
        console.error('Error fetching feed posts:', postsError);
        throw postsError;
      }

      if (!postsData || postsData.length === 0) {
        return {
          posts: [],
          hasMore: false,
        };
      }

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
      const postsWithProfiles = postsData.map(post => ({
        ...post,
        media_urls: Array.isArray(post.media_urls) ? post.media_urls as string[] : [],
        hashtags: post.hashtags || [],
        profiles: profilesMap.get(post.user_id) || null
      } as Post));

      return {
        posts: postsWithProfiles,
        hasMore: postsWithProfiles.length === POSTS_PER_PAGE,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  // Flatten all pages into a single array
  const posts = data?.pages.flatMap(page => page.posts) || [];

  return {
    posts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
};
