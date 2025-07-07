
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Settings, Users, FileText, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import FeedPostCard from '@/components/FeedPostCard';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  full_name: string;
  bio: string;
  pronouns: string;
  avatar_url: string;
  created_at: string;
  theme_color: string;
}

interface Post {
  id: string;
  content: string;
  is_anonymous: boolean;
  hashtags: string[];
  created_at: string;
  media_urls?: string[];
  content_warning?: string;
  privacy_level?: string;
  user_id: string;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        setProfile(profileData);

        // Fetch user's posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', profileData.id)
          .eq('is_anonymous', false)
          .order('created_at', { ascending: false });

        if (postsError) {
          console.error('Error fetching posts:', postsError);
        } else {
          // Add profile data to each post
          const postsWithProfiles = (postsData || []).map(post => ({
            ...post,
            media_urls: Array.isArray(post.media_urls) ? post.media_urls as string[] : [],
            hashtags: post.hashtags || [],
            profiles: {
              username: profileData.username,
              display_name: profileData.display_name,
              avatar_url: profileData.avatar_url
            }
          } as Post));
          
          setPosts(postsWithProfiles);
          setPostsCount(postsWithProfiles.length);
        }

        // Check if current user is following this profile
        if (user && user.id !== profileData.id) {
          const { data: followData } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', profileData.id)
            .single();
          
          setIsFollowing(!!followData);
        }

        // Fetch followers count
        const { count: followersCountData } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profileData.id);

        setFollowersCount(followersCountData || 0);

        // Fetch following count
        const { count: followingCountData } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', profileData.id);

        setFollowingCount(followingCountData || 0);

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user]);

  const handleFollowToggle = async () => {
    if (!user || !profile) return;

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id);
        
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: profile.id
          });
        
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Profile Not Found</h1>
          </div>
        </header>
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
            <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">{profile.display_name || profile.username}</h1>
          </div>
          {isOwnProfile && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} />
              ) : null}
              <AvatarFallback className="bg-teal-100 text-teal-600 text-xl">
                {(profile.display_name || profile.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold">{profile.display_name || profile.username}</h2>
                  <p className="text-gray-500">@{profile.username}</p>
                  {profile.pronouns && (
                    <p className="text-gray-600 text-sm">👤 {profile.pronouns}</p>
                  )}
                </div>
                {!isOwnProfile && (
                  <Button 
                    onClick={handleFollowToggle}
                    className={isFollowing ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-teal-500 hover:bg-teal-600 text-white"}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
              
              {profile.bio && (
                <p className="text-gray-800 mb-3">{profile.bio}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">{postsCount}</span>
                  <span className="text-gray-500">Posts</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:underline">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{followingCount}</span>
                  <span className="text-gray-500">Following</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:underline">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{followersCount}</span>
                  <span className="text-gray-500">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">
                {isOwnProfile ? "Share your first post!" : "This user hasn't posted anything yet."}
              </p>
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <FeedPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
