
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Camera, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePosts } from '@/hooks/usePosts';
import EnhancedPostCard from '@/components/EnhancedPostCard';

const ProfileTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { posts } = usePosts();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(false);

  // Filter posts by current user
  const userPosts = posts.filter(post => post.user_id === user?.id);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile({
        username: data.username || '',
        display_name: data.display_name || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || ''
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setIsEditing(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Profile</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} />
              ) : null}
              <AvatarFallback className="bg-teal-100 text-teal-600 text-lg">
                {(profile.display_name || profile.username || user?.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            )}
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Username
              </label>
              {isEditing ? (
                <Input
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Enter username"
                />
              ) : (
                <p className="text-gray-900">{profile.username || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Display Name
              </label>
              {isEditing ? (
                <Input
                  value={profile.display_name}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  placeholder="Enter display name"
                />
              ) : (
                <p className="text-gray-900">{profile.display_name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Bio
              </label>
              {isEditing ? (
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              ) : (
                <p className="text-gray-900">{profile.bio || 'No bio yet'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {isEditing && (
            <Button onClick={handleUpdateProfile} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* User Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Your Posts ({userPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {userPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">You haven't posted anything yet.</p>
              <p className="text-sm text-gray-500 mt-1">Share your first post to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <EnhancedPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
