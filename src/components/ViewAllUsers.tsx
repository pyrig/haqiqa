import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Users, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
}

interface ViewAllUsersProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'following' | 'followers' | 'all';
  title: string;
}

const ViewAllUsers = ({ isOpen, onClose, type, title }: ViewAllUsersProps) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (user) {
        fetchFollowingIds();
      }
    }
  }, [isOpen, type, user]);

  const fetchFollowingIds = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);
      
      if (data) {
        setFollowingIds(new Set(data.map(f => f.following_id)));
      }
    } catch (error) {
      console.error('Error fetching following IDs:', error);
    }
  };

  const fetchUsers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let profiles: Profile[] = [];

      if (type === 'following') {
        // Get users the current user is following
        const { data: followsData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);

        if (followsData && followsData.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url, bio')
            .in('id', followsData.map(f => f.following_id));
          
          profiles = profilesData || [];
        }
      } else if (type === 'followers') {
        // Get users following the current user
        const { data: followsData } = await supabase
          .from('follows')
          .select('follower_id')
          .eq('following_id', user.id);

        if (followsData && followsData.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url, bio')
            .in('id', followsData.map(f => f.follower_id));
          
          profiles = profilesData || [];
        }
      } else {
        // Get all users except current user
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, bio')
          .neq('id', user.id)
          .limit(50);
        
        profiles = profilesData || [];
      }

      setUsers(profiles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!user) return;

    try {
      const isFollowing = followingIds.has(userId);
      
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
        
        setFollowingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
        
        setFollowingIds(prev => new Set(prev).add(userId));
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Users List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => {
                      navigate(`/profile/${profile.username || profile.id}`);
                      onClose();
                    }}
                  >
                    <Avatar className="w-12 h-12">
                      {profile.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} />
                      ) : null}
                      <AvatarFallback className="bg-teal-100 text-teal-600">
                        {(profile.display_name || profile.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {profile.display_name || profile.username || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        @{profile.username || 'user'}
                      </p>
                      {profile.bio && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {profile.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {type === 'all' && (
                    <Button
                      variant={followingIds.has(profile.id) ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleFollow(profile.id)}
                      className={followingIds.has(profile.id) 
                        ? "text-gray-600 border-gray-300 hover:bg-gray-50" 
                        : "bg-teal-500 hover:bg-teal-600 text-white"
                      }
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      {followingIds.has(profile.id) ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'No users found matching your search.' : 'No users found.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAllUsers;