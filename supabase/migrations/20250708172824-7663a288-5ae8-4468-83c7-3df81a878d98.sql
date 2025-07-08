-- Fix infinite recursion by removing problematic policies
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to conversations" ON public.conversation_participants;

-- Keep only the simple, non-recursive policies
-- These are already created from the previous migration:
-- "Users can view their own participations" 
-- "Users can insert their own participations"

-- Also simplify messages policies to avoid any potential recursion
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;

-- Recreate a simpler messages policy without subquery to conversation_participants
CREATE POLICY "Users can send messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);