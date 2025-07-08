-- Fix infinite recursion in conversation_participants policies
-- Drop existing policies that are causing recursion
DROP POLICY IF EXISTS "Users can view their own conversation participations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can insert their own conversation participations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can update their own conversation participations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can delete their own conversation participations" ON public.conversation_participants;

-- Drop existing policies for conversations
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON public.conversations;
DROP POLICY IF EXISTS "Users can insert conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update conversations they participate in" ON public.conversations;

-- Drop existing policies for messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.messages;

-- Create simple, non-recursive policies for conversation_participants
CREATE POLICY "Users can view their own participations" 
ON public.conversation_participants 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own participations" 
ON public.conversation_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create simple policies for conversations
CREATE POLICY "Users can view all conversations" 
ON public.conversations 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update conversations" 
ON public.conversations 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create simple policies for messages
CREATE POLICY "Users can view all messages" 
ON public.messages 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" 
ON public.messages 
FOR DELETE 
USING (auth.uid() = sender_id);