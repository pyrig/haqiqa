
-- Add a foreign key relationship between posts and profiles tables
ALTER TABLE public.posts 
ADD CONSTRAINT posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Create an index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);

-- Create an index for better performance on follows lookups
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);
