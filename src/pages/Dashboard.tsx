
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Home, 
  Compass, 
  Bookmark, 
  User, 
  Settings, 
  LogOut,
  UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useFollows } from "@/hooks/useFollows";
import EnhancedPostComposer from "@/components/EnhancedPostComposer";
import PostFeed from "@/components/PostFeed";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const { suggestedUsers, followUser, checkIfFollowing, isFollowing } = useFollows();
  const [followingStatus, setFollowingStatus] = useState<{[key: string]: boolean}>({});
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      const status: {[key: string]: boolean} = {};
      for (const user of suggestedUsers) {
        status[user.id] = await checkIfFollowing(user.id);
      }
      setFollowingStatus(status);
    };

    if (suggestedUsers.length > 0) {
      checkFollowingStatus();
    }
  }, [suggestedUsers, checkIfFollowing]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleFollowUser = (userId: string) => {
    followUser(userId);
    setFollowingStatus(prev => ({ ...prev, [userId]: true }));
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-teal-500 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/360ec68b-0e2d-45c9-a1e9-84aca66b0284.png" 
              alt="Postsy Logo" 
              className="h-8"
            />
          </div>
          <div className="flex-1 max-w-md mx-8">
            <SearchBar />
          </div>
          <div></div>
        </div>
      </header>

      <div className="flex justify-center">
        <div className="flex max-w-6xl w-full">
          {/* Left Sidebar */}
          <div className="w-64 bg-white h-screen p-6 border-r">
            <nav className="space-y-4">
              <div className="flex items-center gap-3 text-teal-500 font-medium">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                <Compass className="w-5 h-5" />
                <span>Discover</span>
              </div>
              <div 
                className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => navigate('/bookmarks')}
              >
                <Bookmark className="w-5 h-5" />
                <span>Bookmarks</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div 
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            <div className="mt-12">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Anonymous Mode</h3>
                <p className="text-sm text-gray-600 mb-3">Post without linking to your profile</p>
              </div>
              
              <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                    New Post
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
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl p-6">
            <PostFeed />
          </div>

          {/* Right Sidebar */}
          <div className="w-80 p-6">
            {/* Suggested Users */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
              <h3 className="font-medium text-gray-900 mb-4">Suggested Users</h3>
              <div className="space-y-3">
                {suggestedUsers.map((suggestedUser) => (
                  <div key={suggestedUser.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        {suggestedUser.avatar_url ? (
                          <AvatarImage src={suggestedUser.avatar_url} />
                        ) : null}
                        <AvatarFallback className="bg-teal-100 text-teal-600 text-xs">
                          {(suggestedUser.display_name || suggestedUser.username || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{suggestedUser.display_name || suggestedUser.username}</div>
                        {suggestedUser.username && (
                          <div className="text-xs text-gray-500">@{suggestedUser.username}</div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={followingStatus[suggestedUser.id] ? "outline" : "ghost"}
                      className="text-teal-500 hover:text-teal-600"
                      onClick={() => handleFollowUser(suggestedUser.id)}
                      disabled={isFollowing || followingStatus[suggestedUser.id]}
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h3 className="font-medium text-gray-900 mb-4">Trending Tags</h3>
              <div className="space-y-2">
                <Badge variant="secondary" className="text-blue-600 bg-blue-50 mr-2 mb-2 cursor-pointer hover:opacity-80">#photography</Badge>
                <Badge variant="secondary" className="text-purple-600 bg-purple-50 mr-2 mb-2 cursor-pointer hover:opacity-80">#design</Badge>
                <Badge variant="secondary" className="text-green-600 bg-green-50 mr-2 mb-2 cursor-pointer hover:opacity-80">#technology</Badge>
                <Badge variant="secondary" className="text-orange-600 bg-orange-50 mr-2 mb-2 cursor-pointer hover:opacity-80">#travel</Badge>
                <Badge variant="secondary" className="text-red-600 bg-red-50 mr-2 mb-2 cursor-pointer hover:opacity-80">#food</Badge>
                <Badge variant="secondary" className="text-teal-600 bg-teal-50 mr-2 mb-2 cursor-pointer hover:opacity-80">#music</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              </div>
              <span className="font-medium">Postsy</span>
              <span className="text-gray-500 text-sm ml-2">Posting, but better.</span>
            </div>
            
            <div className="flex gap-8 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Platform</h4>
                <div className="space-y-1 text-gray-600">
                  <div>About</div>
                  <div>Features</div>
                  <div>Guidelines</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Legal</h4>
                <div className="space-y-1 text-gray-600">
                  <div>Privacy</div>
                  <div>Terms</div>
                  <div>Cookies</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Connect</h4>
                <div className="space-y-1 text-gray-600">
                  <div>Contact</div>
                  <div>Twitter</div>
                  <div>GitHub</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm mt-8">
            © 2024 Postsy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
