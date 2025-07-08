import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Conversation {
  id: string;
  updated_at: string;
  other_participant?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
}

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        // Get conversations where user is a participant
        const { data: participantData, error: participantError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id);

        if (participantError) throw participantError;

        if (participantData && participantData.length > 0) {
          const conversationIds = participantData.map(p => p.conversation_id);

          // Get conversation details with other participants
          const { data: conversationsData, error: conversationsError } = await supabase
            .from('conversations')
            .select('*')
            .in('id', conversationIds)
            .order('updated_at', { ascending: false });

          if (conversationsError) throw conversationsError;

          // For each conversation, get the other participant and last message
          const conversationsWithDetails = await Promise.all(
            conversationsData.map(async (conversation): Promise<Conversation> => {
              // Get other participant
              const { data: otherParticipant } = await supabase
                .from('conversation_participants')
                .select('user_id')
                .eq('conversation_id', conversation.id)
                .neq('user_id', user.id)
                .maybeSingle();

              if (otherParticipant) {
                // Get participant profile
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('id, username, display_name, avatar_url')
                  .eq('id', otherParticipant.user_id)
                  .maybeSingle();

                // Get last message
                const { data: lastMessage } = await supabase
                  .from('messages')
                  .select('content, created_at, sender_id')
                  .eq('conversation_id', conversation.id)
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .maybeSingle();

                return {
                  ...conversation,
                  other_participant: profile || undefined,
                  last_message: lastMessage || undefined
                };
              }

              return {
                ...conversation,
                other_participant: undefined,
                last_message: undefined
              };
            })
          );

          setConversations(conversationsWithDetails.filter(c => c.other_participant));
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <img 
            src="/lovable-uploads/24441693-0248-4339-9e32-08a834c45d4e.png" 
            alt="Postsy Logo" 
            className="h-6 sm:h-8"
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:w-80 bg-white">
          <div className="p-4">
            <div className="rounded-lg overflow-hidden mb-4 bg-teal-500">
              <div className="p-6 text-white text-center">
                <h2 className="text-xl font-medium mb-2">Messages</h2>
                <p className="text-teal-100 text-sm">
                  Stay connected with your conversations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white lg:ml-0">
          <div className="p-4">
            <div className="lg:hidden mb-4">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Messages</h1>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search conversations..." 
                  className="pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="space-y-3">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div 
                    key={conversation.id} 
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-teal-300"
                    onClick={() => {
                      // TODO: Navigate to individual conversation
                      console.log('Open conversation:', conversation.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        {conversation.other_participant?.avatar_url ? (
                          <AvatarImage src={conversation.other_participant.avatar_url} />
                        ) : null}
                        <AvatarFallback className="bg-teal-100 text-teal-600">
                          {(conversation.other_participant?.display_name || conversation.other_participant?.username || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversation.other_participant?.display_name || conversation.other_participant?.username}
                          </h3>
                          {conversation.last_message && (
                            <span className="text-xs text-gray-500">
                              {new Date(conversation.last_message.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.last_message ? (
                            <>
                              {conversation.last_message.sender_id === user?.id ? 'You: ' : ''}
                              {conversation.last_message.content}
                            </>
                          ) : (
                            'No messages yet'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
                  <div className="text-teal-300 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600">Start a conversation by messaging someone from their profile!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;