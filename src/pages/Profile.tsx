
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreHorizontal, Heart, Repeat, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import MessageButton from '@/components/MessageButton';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  website?: string;
  avatar_url: string;
  banner_url?: string;
  created_at: string;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: Profile;
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  profiles?: Profile;
}

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('postsys');
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

        // Fetch counts
        const { count: postsCountData } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profileData.id);

        setPostsCount(postsCountData || 0);

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

  const fetchPosts = async () => {
    if (!profile) return;
    setPostsLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, content, created_at, user_id')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) throw postsError;

      if (postsData && postsData.length > 0) {
        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profiles: profile
        }));

        setPosts(postsWithProfiles);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchReplies = async () => {
    if (!profile) return;
    setPostsLoading(true);
    try {
      const { data: repliesData, error: repliesError } = await supabase
        .from('replies')
        .select('id, content, created_at, user_id, post_id')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (repliesError) throw repliesError;

      if (repliesData && repliesData.length > 0) {
        const repliesWithProfiles = repliesData.map(reply => ({
          ...reply,
          profiles: profile
        }));

        setReplies(repliesWithProfiles);
      } else {
        setReplies([]);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  // Fetch posts/replies when filter changes
  useEffect(() => {
    if (profile) {
      if (activeFilter === 'postsys') {
        fetchPosts();
      } else {
        fetchReplies();
      }
    }
  }, [profile, activeFilter]);

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

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== postId));
      setPostsCount(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      const { error } = await supabase
        .from('replies')
        .delete()
        .eq('id', replyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setReplies(replies.filter(reply => reply.id !== replyId));
    } catch (error) {
      console.error('Error deleting reply:', error);
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
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Header */}
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
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden lg:block lg:w-80 bg-white">
          <div className="p-4">
            {/* Profile Card */}
            <div className="rounded-lg overflow-hidden mb-4 bg-teal-500">
              <div className="p-6 text-white text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white/20">
                  <Avatar className="w-full h-full">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-teal-600 text-white text-2xl">
                      {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <h2 className="text-xl font-medium mb-1">
                  {profile.display_name || profile.username}
                </h2>
                
                <p className="text-teal-100 text-sm mb-2">
                  @{profile.username}
                </p>
                
                <p className="text-teal-100 text-sm mb-2">
                  {profile.bio || "No bio yet"}
                </p>
                
                {profile.website && (
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-100 text-sm mb-4 inline-block hover:text-white underline"
                  >
                    🔗 {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                
                <div className="mb-6"></div>
                
                {!isOwnProfile && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-lg font-medium"
                      onClick={handleFollowToggle}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <div className="bg-white/10 rounded-lg p-2">
                      <MessageButton
                        recipientId={profile.id}
                        recipientName={profile.display_name || profile.username}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-bold text-teal-600">{postsCount}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Following</span>
                  <span className="font-bold text-teal-600">{followingCount}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Followers</span>
                  <span className="font-bold text-teal-600">{followersCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          {/* Mobile Profile Header */}
          <div className="lg:hidden">
            {/* Banner */}
            {profile.banner_url ? (
              <div className="h-32 sm:h-40 bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400 relative">
                <img 
                  src={profile.banner_url} 
                  alt="Profile banner" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-32 sm:h-40 bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400"></div>
            )}
            
            {/* Mobile Profile Info */}
            <div className="px-4 py-4 relative">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white -mt-8 relative z-10 bg-white">
                  <Avatar className="w-full h-full">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-teal-100 text-teal-600 text-xl">
                      {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 pt-2">
                  <h1 className="text-xl font-bold text-gray-900">
                    {profile.display_name || profile.username}
                  </h1>
                  <p className="text-gray-500">@{profile.username}</p>
                </div>
                {!isOwnProfile && (
                  <div className="flex gap-2">
                    <Button 
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                      className={isFollowing 
                        ? "text-gray-600 border-gray-300" 
                        : "bg-teal-500 hover:bg-teal-600 text-white"
                      }
                      onClick={handleFollowToggle}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <MessageButton
                      recipientId={profile.id}
                      recipientName={profile.display_name || profile.username}
                    />
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 mb-2">
                {profile.bio || 'No bio yet'}
              </p>
              
              {profile.website && (
                <a 
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 text-sm mb-4 inline-block hover:text-teal-700 underline"
                >
                  🔗 {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{postsCount}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{followingCount}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{followersCount}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Banner */}
          <div className="hidden lg:block">
            {/* Banner */}
            {profile.banner_url ? (
              <div className="h-48 bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400 relative">
                <img 
                  src={profile.banner_url} 
                  alt="Profile banner" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400"></div>
            )}
          </div>
          
          {/* Filter Bar */}
          <div className="p-4 flex gap-2 bg-white border-b border-gray-200 overflow-x-auto">
            <Button 
              size="sm"
              variant={activeFilter === 'postsys' ? 'default' : 'outline'}
              className={activeFilter === 'postsys' 
                ? "bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 h-auto text-sm font-medium whitespace-nowrap" 
                : "text-gray-600 border-gray-300 hover:bg-gray-50 px-3 py-1 h-auto text-sm whitespace-nowrap"
              }
              onClick={() => setActiveFilter('postsys')}
            >
              Postsys
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'replies' ? 'default' : 'outline'}
              className={activeFilter === 'replies' 
                ? "bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 h-auto text-sm font-medium whitespace-nowrap" 
                : "text-gray-600 border-gray-300 hover:bg-gray-50 px-3 py-1 h-auto text-sm whitespace-nowrap"
              }
              onClick={() => setActiveFilter('replies')}
            >
              Replies
            </Button>
          </div>

          {/* Content Feed */}
          <div className="bg-white">
            {postsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : activeFilter === 'postsys' ? (
              posts.length > 0 ? (
                posts.map((post, index) => (
                  <div key={post.id} className={`px-4 sm:px-6 py-4 ${index < posts.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Avatar>
                          {post.profiles?.avatar_url ? (
                            <AvatarImage src={post.profiles.avatar_url} />
                          ) : null}
                          <AvatarFallback className="bg-teal-100 text-teal-600">
                            {(post.profiles?.display_name || post.profiles?.username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm mb-3">
                          <span className="font-medium text-gray-900">
                            {post.profiles?.display_name || post.profiles?.username || 'User'}
                          </span>
                          <span className="text-gray-500">
                            @{post.profiles?.username || 'user'}
                          </span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          <MoreHorizontal className="w-5 h-5 text-gray-400 ml-auto" />
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-gray-800 mb-4 text-base">{post.content}</p>
                          <p className="text-gray-500 text-sm">0 comments</p>
                        </div>

                        <div className="flex items-center gap-3 justify-end">
                          {isOwnProfile && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-400 hover:text-red-500 p-1"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-teal-500 p-1">
                            <Repeat className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No posts yet</p>
                </div>
              )
            ) : (
              replies.length > 0 ? (
                replies.map((reply, index) => (
                  <div key={reply.id} className={`px-6 py-4 ${index < replies.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Avatar>
                          {reply.profiles?.avatar_url ? (
                            <AvatarImage src={reply.profiles.avatar_url} />
                          ) : null}
                          <AvatarFallback className="bg-teal-100 text-teal-600">
                            {(reply.profiles?.display_name || reply.profiles?.username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm mb-3">
                          <span className="font-medium text-gray-900">
                            {reply.profiles?.display_name || reply.profiles?.username || 'User'}
                          </span>
                          <span className="text-gray-500">
                            @{reply.profiles?.username || 'user'}
                          </span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">
                            {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-gray-500">· Reply</span>
                          <MoreHorizontal className="w-5 h-5 text-gray-400 ml-auto" />
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-gray-800 mb-4 text-base">{reply.content}</p>
                        </div>

                        <div className="flex items-center gap-3 justify-end">
                          {isOwnProfile && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-400 hover:text-red-500 p-1"
                              onClick={() => handleDeleteReply(reply.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-teal-500 p-1">
                            <Repeat className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No replies yet</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
