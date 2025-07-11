
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface CreatePostData {
  content: string;
  is_anonymous?: boolean;
  media_urls?: string[];
  privacy_level?: 'public' | 'followers' | 'private';
  content_warning?: string;
}

const POSTS_PER_PAGE = 10;

export const usePosts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam * POSTS_PER_PAGE, (pageParam + 1) * POSTS_PER_PAGE - 1);

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
      
      // Fetch profiles separately to avoid join issues
      const postsWithProfiles = await Promise.all(
        (data || []).map(async (post) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url')
            .eq('id', post.user_id)
            .single();

          return {
            ...post,
            media_urls: Array.isArray(post.media_urls) ? post.media_urls as string[] : [],
            hashtags: post.hashtags || [],
            profiles: profile || null
          } as Post;
        })
      );

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

  const createPostMutation = useMutation({
    mutationFn: async (postData: CreatePostData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('posts')
        .insert({
          ...postData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post created!",
        description: "Your post has been shared successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating post:', error);
    },
  });

  return {
    posts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    createPost: createPostMutation.mutate,
    isCreating: createPostMutation.isPending,
  };
};
