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
  MoreHorizontal
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [postsCount, setPostsCount] = useState(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
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
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
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
        <div className="flex-1 bg-white">

          {/* Filter Bar */}
          <div className="p-4 flex gap-2 bg-white border-b border-gray-200">
            <Button 
              size="sm"
              className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 h-auto text-sm font-medium"
            >
              following
            </Button>
            <Button 
              size="sm"
              className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 h-auto text-sm font-medium"
            >
              All Postsys
            </Button>
          </div>

          {/* Posts Feed */}
          <div className="bg-white">
            {/* First Post with Repost */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Avatar>
                    {user?.user_metadata?.avatar_url ? (
                      <AvatarImage src={user.user_metadata.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-teal-100 text-teal-600">
                      {(user?.user_metadata?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-900">{user?.user_metadata?.display_name || 'User'}</span>
                    <span className="text-gray-500">@{user?.email?.split('@')[0] || 'user'}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">18 days ago</span>
                    <div className="flex items-center gap-2 ml-auto">
                      <Repeat className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{user?.user_metadata?.display_name || 'User'}</span>
                      <span className="text-gray-500">@{user?.email?.split('@')[0] || 'user'}</span>
                      <MoreHorizontal className="w-5 h-5 text-gray-400 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Post */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Avatar>
                    {user?.user_metadata?.avatar_url ? (
                      <AvatarImage src={user.user_metadata.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-teal-100 text-teal-600">
                      {(user?.user_metadata?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="font-medium text-gray-900">{user?.user_metadata?.display_name || 'User'}</span>
                    <span className="text-gray-500">@{user?.email?.split('@')[0] || 'user'}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">2 mo. ago</span>
                    <MoreHorizontal className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-2xl font-medium mb-2 text-gray-900">finally</h3>
                    <p className="text-gray-800 mb-4 text-base">a new place to post</p>
                    <p className="text-gray-500 text-sm">0 comments</p>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-teal-500 p-1">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Post */}
            <div className="px-6 py-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Avatar>
                    {user?.user_metadata?.avatar_url ? (
                      <AvatarImage src={user.user_metadata.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-teal-100 text-teal-600">
                      {(user?.user_metadata?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="font-medium text-gray-900">{user?.user_metadata?.display_name || 'User'}</span>
                    <span className="text-gray-500">@{user?.email?.split('@')[0] || 'user'}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">2 mo. ago</span>
                    <MoreHorizontal className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-800 mb-4 text-base">in all honesty, i just want another place to talk about my book</p>
                    <p className="text-gray-500 text-sm">0 comments</p>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;