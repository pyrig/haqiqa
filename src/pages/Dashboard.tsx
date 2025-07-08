import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ChevronDown,
  Trash2,
  Edit3,
  Heart,
  Bug,
  Repeat,
  MoreHorizontal,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import EnhancedPostComposer from "@/components/EnhancedPostComposer";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: Profile;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [postsCount, setPostsCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('following');
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchFollowing();
      fetchFollowers();
      fetchPostsCount();
    }
  }, [user]);

  const fetchFollowing = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id)
        .limit(5);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, bio')
          .in('id', data.map(f => f.following_id));
        
        if (profileError) throw profileError;
        setFollowing(profiles || []);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const fetchFollowers = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', user.id)
        .limit(5);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, bio')
          .in('id', data.map(f => f.follower_id));
        
        if (profileError) throw profileError;
        setFollowers(profiles || []);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchPostsCount = async () => {
    if (!user) return;
    try {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) throw error;
      setPostsCount(count || 0);
    } catch (error) {
      console.error('Error fetching posts count:', error);
    }
  };

  const fetchFollowingPosts = async () => {
    if (!user) return;
    setPostsLoading(true);
    try {
      // Get list of people user follows
      const { data: followsData, error: followsError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (followsError) throw followsError;

      // Create array of user IDs to fetch posts from (following + own posts)
      const userIds = followsData ? followsData.map(f => f.following_id) : [];
      userIds.push(user.id); // Add user's own ID

      // Get posts from those people + user's own posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, content, created_at, user_id')
        .in('user_id', userIds)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) throw postsError;

      // Get profiles for post authors
      if (postsData && postsData.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, bio')
          .in('id', postsData.map(p => p.user_id));

        if (profilesError) throw profilesError;

        // Combine posts with profiles
        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profiles: profilesData?.find(p => p.id === post.user_id)
        }));

        setPosts(postsWithProfiles);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching following posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchHotPosts = async () => {
    setPostsLoading(true);
    try {
      // Get recent posts ordered by creation date (hot posts)
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, content, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) throw postsError;

      // Get profiles for post authors
      if (postsData && postsData.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, bio')
          .in('id', postsData.map(p => p.user_id));

        if (profilesError) throw profilesError;

        // Combine posts with profiles
        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profiles: profilesData?.find(p => p.id === post.user_id)
        }));

        setPosts(postsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching hot posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  // Fetch posts when filter changes
  useEffect(() => {
    if (user) {
      if (activeFilter === 'following') {
        fetchFollowingPosts();
      } else {
        fetchHotPosts();
      }
    }
  }, [user, activeFilter]);

  // Add focus event listener to refetch profile when returning to dashboard
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        const fetchProfile = async () => {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (error) {
              console.error('Error fetching profile:', error);
              return;
            }

            if (data) {
              setProfile(data);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };
        fetchProfile();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user?.id); // Extra safety check

      if (error) throw error;

      // Remove the post from local state
      setPosts(posts.filter(post => post.id !== postId));
      
      // Update posts count
      setPostsCount(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Refresh functions
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh all data
      await Promise.all([
        fetchProfile(),
        fetchFollowing(),
        fetchFollowers(), 
        fetchPostsCount(),
        activeFilter === 'following' ? fetchFollowingPosts() : fetchHotPosts()
      ]);
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  };

  // Touch event handlers for pull-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const pullDistance = Math.max(0, touchY - touchStartY);
    
    // Only trigger pull-to-refresh if we're at the top of the page
    if (window.scrollY === 0 && pullDistance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(pullDistance, 80));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 50) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
    setTouchStartY(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/24441693-0248-4339-9e32-08a834c45d4e.png" 
            alt="Postsy Logo" 
            className="h-8"
          />
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <SearchBar placeholder="Search users and hashtags..." />
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-gray-700 hover:bg-gray-100 px-3 py-1 h-auto">
                {profile?.display_name || profile?.username || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'user'}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate(`/profile/${profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0]}`)}>
                Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1 h-auto text-sm">
                post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <EnhancedPostComposer onPostCreated={() => setIsPostDialogOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>

          <span className="text-gray-700 text-sm cursor-pointer hover:text-gray-900" onClick={handleLogout}>
            sign out
          </span>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white">
          <div className="p-4">
            {/* Profile Card */}
            <div className="rounded-lg overflow-hidden mb-4 bg-teal-500">
              <div className="p-6 text-white text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white/20">
                  <Avatar className="w-full h-full">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-teal-600 text-white text-2xl">
                      {(profile?.display_name || profile?.username || user?.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <h2 className="text-xl font-medium mb-1">
                  {profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'User'}
                </h2>
                
                <p className="text-teal-100 text-sm mb-2">
                  @{profile?.username || user?.email?.split('@')[0] || 'user'}
                </p>
                
                <div className="flex items-center justify-center gap-1 text-teal-100 text-sm mb-2">
                  <span>👤</span>
                  <span>they/them</span>
                </div>
                
                <p className="text-teal-100 text-sm mb-6">
                  {profile?.bio || 'sharing thoughts & creativity'}
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 rounded-lg font-medium"
                  onClick={() => navigate('/settings')}
                >
                  Edit profile
                </Button>
              </div>
            </div>
            
            {/* Following Section */}
            <div className="mb-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Following</h3>
              <div className="space-y-2">
                {following.length > 0 ? (
                  following.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        {user.avatar_url ? (
                          <AvatarImage src={user.avatar_url} />
                        ) : null}
                        <AvatarFallback className="bg-teal-100 text-teal-600 text-xs">
                          {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">
                        {user.display_name || user.username}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No following yet</p>
                )}
              </div>
            </div>

            {/* Followers Section */}
            <div className="mb-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Followers</h3>
              <div className="space-y-2">
                {followers.length > 0 ? (
                  followers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        {user.avatar_url ? (
                          <AvatarImage src={user.avatar_url} />
                        ) : null}
                        <AvatarFallback className="bg-teal-100 text-teal-600 text-xs">
                          {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">
                        {user.display_name || user.username}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No followers yet</p>
                )}
              </div>
            </div>

            {/* Posts Count Section */}
            <div className="mb-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Posts</h3>
              <p className="text-2xl font-bold text-teal-600">{postsCount}</p>
            </div>
            
            {/* Report Bug Button */}
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 rounded-lg font-medium py-2 bg-teal-50 border-teal-200 text-teal-600 hover:bg-teal-100"
            >
              <Bug className="w-4 h-4" />
              report a bug
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div 
          className="flex-1 bg-white relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Pull to refresh indicator */}
          {pullDistance > 0 && (
            <div 
              className="absolute top-0 left-0 right-0 flex items-center justify-center bg-teal-50 border-b border-teal-200 z-10 transition-all duration-200"
              style={{ height: `${pullDistance}px` }}
            >
              <div className="flex items-center gap-2 text-teal-600">
                <RefreshCw className={`w-4 h-4 ${pullDistance > 50 ? 'animate-spin' : ''}`} />
                <span className="text-sm">
                  {pullDistance > 50 ? 'Release to refresh' : 'Pull to refresh'}
                </span>
              </div>
            </div>
          )}

          {/* Refreshing indicator */}
          {isRefreshing && (
            <div className="absolute top-0 left-0 right-0 flex items-center justify-center bg-teal-50 border-b border-teal-200 py-2 z-10">
              <div className="flex items-center gap-2 text-teal-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Refreshing...</span>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="p-4 flex gap-2 bg-white border-b border-gray-200" style={{ marginTop: isRefreshing ? '40px' : '0' }}>
            <Button 
              size="sm"
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50 px-2 py-1 h-auto text-sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'following' ? 'default' : 'outline'}
              className={activeFilter === 'following' 
                ? "bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 h-auto text-sm font-medium" 
                : "text-gray-600 border-gray-300 hover:bg-gray-50 px-3 py-1 h-auto text-sm"
              }
              onClick={() => setActiveFilter('following')}
            >
              Following
            </Button>
            <Button 
              size="sm"
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              className={activeFilter === 'all' 
                ? "bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 h-auto text-sm font-medium" 
                : "text-gray-600 border-gray-300 hover:bg-gray-50 px-3 py-1 h-auto text-sm"
              }
              onClick={() => setActiveFilter('all')}
            >
              Hot Postsys
            </Button>
            
            {/* Desktop refresh button */}
            <Button 
              size="sm"
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50 px-3 py-1 h-auto text-sm ml-auto"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Posts Feed */}
          <div className="bg-white">
            {postsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading posts...</p>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post, index) => (
                <div key={post.id} className={`px-6 py-4 ${index < posts.length - 1 ? 'border-b border-gray-200' : ''}`}>
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
                        {/* Show delete button only for user's own posts */}
                        {post.user_id === user?.id && (
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
                <p className="text-gray-500">
                  {activeFilter === 'following' 
                    ? "No posts from people you follow yet. Follow some users to see their posts!" 
                    : "No posts available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;