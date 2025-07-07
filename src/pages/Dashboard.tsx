
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
  Home, 
  Compass, 
  Bookmark, 
  User, 
  Settings, 
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PostComposer from "@/components/PostComposer";
import PostFeed from "@/components/PostFeed";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-teal-500 text-white px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/360ec68b-0e2d-45c9-a1e9-84aca66b0284.png" 
              alt="Postsy Logo" 
              className="h-8"
            />
          </div>
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
              <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                <Bookmark className="w-5 h-5" />
                <span>Bookmarks</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 cursor-pointer">
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
              <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                New Post
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl p-6">
            <PostComposer />
            <PostFeed />
          </div>

          {/* Right Sidebar */}
          <div className="w-80 p-6">
            {/* Suggested Users */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
              <h3 className="font-medium text-gray-900 mb-4">Suggested Users</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">TW</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">techwriter</div>
                      <div className="text-xs text-gray-500">@techwriter</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-teal-500 hover:text-teal-600">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-green-100 text-green-600 text-xs">TB</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">travelbug</div>
                      <div className="text-xs text-gray-500">@travelbug</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-teal-500 hover:text-teal-600">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-red-100 text-red-600 text-xs">ML</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">musiclover</div>
                      <div className="text-xs text-gray-500">@musiclover</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-teal-500 hover:text-teal-600">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
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
