-- Clean up duplicate policies and fix RLS issues
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;

-- Recreate clean policies for messages
CREATE POLICY "Users can send messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

-- Fix conversation_participants to allow adding other users to conversations
DROP POLICY IF EXISTS "Users can insert their own participations" ON public.conversation_participants;

CREATE POLICY "Users can manage conversation participants" 
ON public.conversation_participants 
FOR INSERT 
WITH CHECK (
  -- Can add yourself
  auth.uid() = user_id 
  OR 
  -- Can add others if you're already in the conversation (for creating new conversations)
  EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = conversation_participants.conversation_id 
    AND cp.user_id = auth.uid()
  )
  OR
  -- Allow if this is part of creating a new conversation (no existing participants yet)
  NOT EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = conversation_participants.conversation_id
  )
);