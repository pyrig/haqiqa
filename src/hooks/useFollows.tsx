
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFollows = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const followUserMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
      queryClient.invalidateQueries({ queryKey: ['suggested-users'] });
      toast({
        title: "Following!",
        description: "You are now following this user.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
        variant: "destructive",
      });
      console.error('Error following user:', error);
    },
  });

  const unfollowUserMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
      queryClient.invalidateQueries({ queryKey: ['suggested-users'] });
      toast({
        title: "Unfollowed",
        description: "You are no longer following this user.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to unfollow user. Please try again.",
        variant: "destructive",
      });
      console.error('Error unfollowing user:', error);
    },
  });

  const checkIfFollowing = async (targetUserId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .maybeSingle();

    if (error) {
      console.error('Error checking follow status:', error);
      return false;
    }

    return !!data;
  };

  const { data: suggestedUsers = [], isLoading: isLoadingSuggested } = useQuery({
    queryKey: ['suggested-users'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get users that the current user is not following
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .neq('id', user.id)
        .limit(10);

      if (error) throw error;

      // Filter out users we're already following
      const suggestions = [];
      for (const profile of data || []) {
        const isFollowing = await checkIfFollowing(profile.id);
        if (!isFollowing) {
          suggestions.push(profile);
        }
      }

      return suggestions.slice(0, 5);
    },
  });

  return {
    followUser: followUserMutation.mutate,
    unfollowUser: unfollowUserMutation.mutate,
    checkIfFollowing,
    suggestedUsers,
    isLoadingSuggested,
    isFollowing: followUserMutation.isPending,
    isUnfollowing: unfollowUserMutation.isPending,
  };
};
