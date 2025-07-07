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
    }
  }, [user]);

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
            src="/lovable-uploads/f11eefd3-0739-4f93-8e2b-3a50d356e52d.png" 
            alt="Postsy Logo" 
            className="h-8"
          />
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
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                sign out
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
          {/* Header Banner */}
          <div className="h-52 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-teal-100 rounded-full opacity-50"></div>
            <div className="absolute bottom-10 left-10 w-12 h-12 bg-teal-200 rounded-full opacity-60"></div>
            <div className="absolute top-20 left-0 w-8 h-8 bg-teal-300 rounded-full opacity-40"></div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 flex gap-2 bg-white border-b border-gray-200">
            <Button 
              size="sm"
              className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 h-auto text-sm font-medium"
            >
              show shares
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300 hover:bg-gray-50 px-3 py-1 h-auto text-sm"
            >
              hide shares
            </Button>
            <Button 
              size="sm"
              className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 h-auto text-sm font-medium"
            >
              show replies
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300 hover:bg-gray-50 px-3 py-1 h-auto text-sm"
            >
              hide replies
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