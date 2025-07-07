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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="text-2xl font-bold" style={{ color: '#8B4B8C' }}>
          cohost
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-gray-700 hover:bg-gray-100">
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
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-800 hover:bg-gray-900 text-white px-6">
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

          <Button 
            variant="ghost" 
            className="text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            sign out
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-96 p-6 bg-white">
          {/* Profile Card */}
          <div className="rounded-lg p-6 text-white mb-4" style={{ backgroundColor: '#8B4B8C' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full mb-4 overflow-hidden">
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
              
              <div className="flex items-center gap-1 text-purple-200 text-sm mb-2">
                <span>👤</span>
                <span>he/him</span>
              </div>
              
              <p className="text-purple-200 text-sm mb-6">
                video game words
              </p>
              
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 rounded-full"
                onClick={() => navigate('/profile')}
              >
                Edit profile
              </Button>
            </div>
          </div>
          
          {/* Report Bug Button */}
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 text-pink-600 border-pink-200 hover:bg-pink-50 rounded-full"
            style={{ backgroundColor: '#FCE7F3', borderColor: '#F9A8D4' }}
          >
            <Bug className="w-4 h-4" />
            report a bug
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          {/* Header Image */}
          <div className="h-48 bg-gradient-to-r from-gray-300 to-gray-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600"></div>
          </div>

          {/* Filter Buttons */}
          <div className="p-4 flex gap-2 border-b">
            <Button 
              size="sm"
              className="text-white rounded-none px-4"
              style={{ backgroundColor: '#8B4B8C' }}
            >
              show shares
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300 rounded-none px-4"
            >
              hide shares
            </Button>
            <Button 
              size="sm"
              className="text-white rounded-none px-4"
              style={{ backgroundColor: '#8B4B8C' }}
            >
              show replies
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300 rounded-none px-4"
            >
              hide replies
            </Button>
          </div>

          {/* Posts */}
          <div>
            {/* First Post */}
            <div className="p-6 border-b">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/056ac43c-b047-494a-bad0-851616e96cd4.png"
                    alt="Jordan Minor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-black">Jordan Minor</span>
                    <span className="text-gray-500">@jordanwminor</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 text-sm">18 days ago</span>
                    <Repeat className="w-4 h-4 text-gray-500 ml-auto" />
                    <span className="font-bold text-black">Jordan Minor</span>
                    <span className="text-gray-500">@jordanwminor</span>
                    <MoreHorizontal className="w-4 h-4 text-gray-500 ml-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Second Post */}
            <div className="p-6 border-b">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/056ac43c-b047-494a-bad0-851616e96cd4.png"
                    alt="Jordan Minor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-black">Jordan Minor</span>
                    <span className="text-gray-500">@jordanwminor</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 text-sm">2 mo. ago</span>
                    <MoreHorizontal className="w-4 h-4 text-gray-500 ml-auto" />
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2 text-black">finally</h3>
                    <p className="text-gray-800 mb-4">a new place to post</p>
                    <p className="text-gray-500 text-sm">0 comments</p>
                  </div>

                  <div className="flex items-center gap-4 justify-end">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Post */}
            <div className="p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/056ac43c-b047-494a-bad0-851616e96cd4.png"
                    alt="Jordan Minor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-black">Jordan Minor</span>
                    <span className="text-gray-500">@jordanwminor</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 text-sm">2 mo. ago</span>
                    <MoreHorizontal className="w-4 h-4 text-gray-500 ml-auto" />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-800 mb-4">in all honesty, i just want another place to talk about my book</p>
                    <p className="text-gray-500 text-sm">0 comments</p>
                  </div>

                  <div className="flex items-center gap-4 justify-end">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <Repeat className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
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