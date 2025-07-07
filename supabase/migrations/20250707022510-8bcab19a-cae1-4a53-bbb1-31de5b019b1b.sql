
-- Add foreign key relationship between posts and profiles tables
ALTER TABLE public.posts 
ADD CONSTRAINT posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update the posts table to use proper foreign key reference
-- This will allow Supabase to automatically join posts with profiles
