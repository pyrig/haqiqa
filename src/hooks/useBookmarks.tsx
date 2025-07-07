
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBookmarks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          posts!inner (
            *,
            profiles!inner (
              username,
              display_name,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookmarks:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const addBookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          post_id: postId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast({
        title: "Bookmarked!",
        description: "Post saved to your bookmarks.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to bookmark post. Please try again.",
        variant: "destructive",
      });
      console.error('Error adding bookmark:', error);
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast({
        title: "Removed",
        description: "Post removed from bookmarks.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove bookmark. Please try again.",
        variant: "destructive",
      });
      console.error('Error removing bookmark:', error);
    },
  });

  const checkIfBookmarked = async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }

    return !!data;
  };

  return {
    bookmarks,
    isLoading,
    addBookmark: addBookmarkMutation.mutate,
    removeBookmark: removeBookmarkMutation.mutate,
    checkIfBookmarked,
    isBookmarking: addBookmarkMutation.isPending || removeBookmarkMutation.isPending,
  };
};
