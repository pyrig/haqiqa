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
  Repeat
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import EnhancedPostComposer from "@/components/EnhancedPostComposer";
import { useFeedPosts } from "@/hooks/useFeedPosts";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const { posts, isLoading } = useFeedPosts();
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [showShares, setShowShares] = useState(true);
  const [showReplies, setShowReplies] = useState(true);

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
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="text-2xl font-bold text-purple-800">
          cohost
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-gray-700">
                {user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'user'}
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
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
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
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Left Sidebar - User Profile Card */}
        <div className="w-80 p-6">
          <div className="bg-purple-700 rounded-lg p-6 text-white mb-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-20 h-20 mb-4">
                {user?.user_metadata?.avatar_url ? (
                  <AvatarImage src={user.user_metadata.avatar_url} />
                ) : null}
                <AvatarFallback className="bg-purple-800 text-white text-2xl">
                  {(user?.user_metadata?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-bold mb-1">
                {user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User'}
              </h2>
              
              <p className="text-purple-200 text-sm mb-2">
                @{user?.email?.split('@')[0] || 'user'}
              </p>
              
              <div className="flex items-center gap-1 text-purple-200 text-sm mb-2">
                <span>👤</span>
                <span>they/them</span>
              </div>
              
              <p className="text-purple-200 text-sm mb-6">
                video game words
              </p>
              
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate('/profile')}
              >
                Edit profile
              </Button>
            </div>
          </div>
          
          {/* Report Bug Button */}
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 text-pink-600 border-pink-200 hover:bg-pink-50"
          >
            <Bug className="w-4 h-4" />
            report a bug
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl border-l border-r">
          {/* Filter Buttons */}
          <div className="p-4 border-b flex gap-2">
            <Button 
              variant={showShares ? "default" : "outline"}
              size="sm"
              className={showShares ? "bg-purple-600 hover:bg-purple-700" : ""}
              onClick={() => setShowShares(!showShares)}
            >
              {showShares ? 'show shares' : 'hide shares'}
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={() => setShowShares(!showShares)}
            >
              {showShares ? 'hide shares' : 'show shares'}
            </Button>
            <Button 
              variant={showReplies ? "default" : "outline"}
              size="sm"
              className={showReplies ? "bg-purple-600 hover:bg-purple-700" : ""}
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? 'show replies' : 'hide replies'}
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? 'hide replies' : 'show replies'}
            </Button>
          </div>

          {/* Posts */}
          <div className="divide-y">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No posts yet</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="p-6">
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10">
                      {!post.is_anonymous && post.profiles?.avatar_url ? (
                        <AvatarImage src={post.profiles.avatar_url} />
                      ) : null}
                      <AvatarFallback className={post.is_anonymous ? "bg-gray-100 text-gray-600" : "bg-purple-100 text-purple-600"}>
                        {post.is_anonymous ? 'A' : (post.profiles?.display_name || post.profiles?.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {post.is_anonymous ? 'Anonymous' : post.profiles?.display_name || post.profiles?.username || 'User'}
                        </span>
                        <span className="text-gray-500">
                          {!post.is_anonymous && `@${post.profiles?.username || 'user'}`}
                        </span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500 text-sm">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true }).replace('about ', '')}
                        </span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <Repeat className="w-4 h-4" />
                        </Button>
                        <span className="font-medium">
                          {post.is_anonymous ? 'Anonymous' : post.profiles?.display_name || post.profiles?.username || 'User'}
                        </span>
                        <span className="text-gray-500">
                          {!post.is_anonymous && `@${post.profiles?.username || 'user'}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">finally</h3>
                    <p className="text-gray-700 mb-4">a new place to post</p>
                    <p className="text-gray-500 text-sm">0 comments</p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 justify-end">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            
            {/* Sample Post */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    J
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Jordan Minor</span>
                    <span className="text-gray-500">@jordanwminor</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 text-sm">2 mo. ago</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-4">in all honesty, i just want another place to talk about my book</p>
                <p className="text-gray-500 text-sm">0 comments</p>
              </div>

              <div className="flex items-center gap-4 justify-end">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                  <Repeat className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - empty for now to match the design */}
        <div className="w-80 p-6">
          {/* This space intentionally left empty to match the cohost design */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;