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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="text-2xl font-bold text-purple-900">
          cohost
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 text-gray-700 hover:bg-gray-100 px-3 py-1 h-auto">
                jordanwminor
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
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-1 h-auto text-sm">
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
            <div className="rounded-lg overflow-hidden mb-4" style={{ backgroundColor: '#8B4B8C' }}>
              <div className="p-6 text-white text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white/20">
                  <img 
                    src="/lovable-uploads/056ac43c-b047-494a-bad0-851616e96cd4.png"
                    alt="Jordan Minor"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-xl font-bold mb-1">
                  Jordan Minor
                </h2>
                
                <p className="text-purple-200 text-sm mb-2">
                  @jordanwminor
                </p>
                
                <div className="flex items-center justify-center gap-1 text-purple-200 text-sm mb-2">
                  <span>👤</span>
                  <span>he/him</span>
                </div>
                
                <p className="text-purple-200 text-sm mb-6">
                  video game words
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 rounded-full font-medium"
                >
                  Edit profile
                </Button>
              </div>
            </div>
            
            {/* Report Bug Button */}
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 rounded-full font-medium py-2"
              style={{ 
                backgroundColor: '#FCE7F3', 
                borderColor: '#F9A8D4', 
                color: '#BE185D' 
              }}
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
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 50%, #374151 100%)'
              }}
            />
          </div>

          {/* Filter Bar */}
          <div className="p-4 flex gap-2 bg-white border-b border-gray-200">
            <Button 
              size="sm"
              className="text-white px-3 py-1 h-auto text-sm font-medium"
              style={{ backgroundColor: '#8B4B8C' }}
            >
              show shares
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300 px-3 py-1 h-auto text-sm"
            >
              hide shares
            </Button>
            <Button 
              size="sm"
              className="text-white px-3 py-1 h-auto text-sm font-medium"
              style={{ backgroundColor: '#8B4B8C' }}
            >
              show replies
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300 px-3 py-1 h-auto text-sm"
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
                  <img 
                    src="/lovable-uploads/056ac43c-b047-494a-bad0-851616e96cd4.png"
                    alt="Jordan Minor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-black">Jordan Minor</span>
                    <span className="text-gray-500">@jordanwminor</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">18 days ago</span>
                    <div className="flex items-center gap-2 ml-auto">
                      <Repeat className="w-4 h-4 text-gray-500" />
                      <span className="font-bold text-black">Jordan Minor</span>
                      <span className="text-gray-500">@jordanwminor</span>
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
                  <img 
                    src="/lovable-uploads/056ac43c-b047-494a-bad0-851616e96cd4.png"
                    alt="Jordan Minor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="font-bold text-black">Jordan Minor</span>
                    <span className="text-gray-500">@jordanwminor</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">2 mo. ago</span>
                    <MoreHorizontal className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2 text-black">finally</h3>
                    <p className="text-gray-800 mb-4 text-base">a new place to post</p>
                    <p className="text-gray-500 text-sm">0 comments</p>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
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
                  <img 
                    src="/lovable-uploads/056ac43c-b047-494a-bad0-851616e96cd4.png"
                    alt="Jordan Minor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="font-bold text-black">Jordan Minor</span>
                    <span className="text-gray-500">@jordanwminor</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">2 mo. ago</span>
                    <MoreHorizontal className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-800 mb-4 text-base">in all honesty, i just want another place to talk about my book</p>
                    <p className="text-gray-500 text-sm">0 comments</p>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
                      <Repeat className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
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