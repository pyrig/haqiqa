
-- Create posts table with anonymous posting support
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  media_urls JSONB DEFAULT '[]'::jsonb,
  hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
  content_warning TEXT,
  privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'followers', 'private')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create follows table for user connections
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users NOT NULL,
  following_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Create bookmarks table for saved posts
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create replies table for post conversations
CREATE TABLE public.replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security policies for posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Users can view public posts and posts from users they follow
CREATE POLICY "Users can view accessible posts" 
  ON public.posts 
  FOR SELECT 
  USING (
    privacy_level = 'public' OR 
    user_id = auth.uid() OR 
    (privacy_level = 'followers' AND EXISTS (
      SELECT 1 FROM public.follows 
      WHERE follower_id = auth.uid() AND following_id = user_id
    ))
  );

-- Users can create their own posts
CREATE POLICY "Users can create posts" 
  ON public.posts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" 
  ON public.posts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" 
  ON public.posts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS for follows table
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view follows" 
  ON public.follows 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create follows" 
  ON public.follows 
  FOR INSERT 
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete follows" 
  ON public.follows 
  FOR DELETE 
  USING (auth.uid() = follower_id);

-- Add RLS for bookmarks table
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookmarks" 
  ON public.bookmarks 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add RLS for replies table
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view replies" 
  ON public.replies 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create replies" 
  ON public.replies 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own replies" 
  ON public.replies 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own replies" 
  ON public.replies 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Update profiles table to include additional fields for social features
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#14b8a6';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;

-- Create function to extract hashtags from content
CREATE OR REPLACE FUNCTION extract_hashtags(content TEXT)
RETURNS TEXT[]
LANGUAGE plpgsql
AS $$
DECLARE
  hashtag_pattern TEXT := '#\w+';
  hashtags TEXT[];
BEGIN
  SELECT array_agg(LOWER(substring(match FROM 2))) 
  INTO hashtags
  FROM regexp_split_to_table(content, '\s+') AS match
  WHERE match ~ hashtag_pattern;
  
  RETURN COALESCE(hashtags, ARRAY[]::TEXT[]);
END;
$$;

-- Create trigger to automatically extract hashtags when inserting/updating posts
CREATE OR REPLACE FUNCTION update_post_hashtags()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.hashtags := extract_hashtags(NEW.content);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER posts_hashtags_trigger
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_post_hashtags();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hashtags ON public.posts USING GIN(hashtags);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_replies_post ON public.replies(post_id);
