
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useFollows } from "@/hooks/useFollows";
import { useEffect, useState } from "react";
import EnhancedPostComposer from "@/components/EnhancedPostComposer";
import TabNavigation from "@/components/TabNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
  const { suggestedUsers, followUser, checkIfFollowing, isFollowing } = useFollows();
  const [followingStatus, setFollowingStatus] = useState<{[key: string]: boolean}>({});

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
          {/* Main Content */}
          <div className="flex-1 max-w-4xl p-6">
            <EnhancedPostComposer />
            <TabNavigation />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
