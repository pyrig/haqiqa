import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface CreateReplyData {
  post_id: string;
  content: string;
  is_anonymous?: boolean;
}

export const useReplies = (postId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: replies = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['replies', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('replies')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching replies:', error);
        throw error;
      }

      // Fetch profiles separately to avoid join issues
      const repliesWithProfiles = await Promise.all(
        (data || []).map(async (reply) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url')
            .eq('id', reply.user_id)
            .single();

          return {
            ...reply,
            profiles: profile || null
          } as Reply;
        })
      );

      return repliesWithProfiles;
    },
    enabled: !!postId,
  });

  const createReplyMutation = useMutation({
    mutationFn: async (replyData: CreateReplyData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('replies')
        .insert({
          ...replyData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch profile separately
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, display_name, avatar_url')
        .eq('id', user.id)
        .single();

      return {
        ...data,
        profiles: profile || null
      } as Reply;
    },
    onSuccess: (newReply) => {
      queryClient.setQueryData(['replies', postId], (oldReplies: Reply[] = []) => [
        ...oldReplies,
        newReply
      ]);
      toast({
        title: "Reply posted!",
        description: "Your reply has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating reply:', error);
    },
  });

  return {
    replies,
    isLoading,
    error,
    createReply: createReplyMutation.mutate,
    isCreating: createReplyMutation.isPending,
  };
};