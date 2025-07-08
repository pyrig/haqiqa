import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface MessageButtonProps {
  recipientId: string;
  recipientName: string;
}

const MessageButton = ({ recipientId, recipientName }: MessageButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!user || !message.trim() || recipientId === user.id) return;

    setSending(true);
    try {
      // First, check if conversation already exists
      const { data: existingParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      let conversationId: string | null = null;

      if (existingParticipants && existingParticipants.length > 0) {
        // Check if any of these conversations also includes the recipient
        for (const participant of existingParticipants) {
          const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', participant.conversation_id)
            .eq('user_id', recipientId)
            .single();

          if (otherParticipant) {
            conversationId = participant.conversation_id;
            break;
          }
        }
      }

      // If no existing conversation, create a new one
      if (!conversationId) {
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({})
          .select('id')
          .single();

        if (conversationError) throw conversationError;
        conversationId = newConversation.id;

        // Add both users as participants
        const { error: participantsError } = await supabase
          .from('conversation_participants')
          .insert([
            { conversation_id: conversationId, user_id: user.id },
            { conversation_id: conversationId, user_id: recipientId }
          ]);

        if (participantsError) throw participantsError;
      }

      // Send the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: message.trim()
        });

      if (messageError) throw messageError;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${recipientName}`,
      });

      setMessage('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  // Don't show message button for own profile
  if (!user || recipientId === user.id) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm"
          className="bg-teal-500 hover:bg-teal-600 text-white"
        >
          <Mail className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send message to {recipientName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-24"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {message.length}/500 characters
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={sendMessage} 
                disabled={!message.trim() || sending}
                className="flex items-center gap-2"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageButton;