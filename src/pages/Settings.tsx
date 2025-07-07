import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ChevronDown,
  Bug,
  Upload
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    password: '',
    pronouns: '',
    bio: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState('');

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
          setFormData({
            display_name: data.display_name || '',
            email: user?.email || '',
            password: '',
            pronouns: '', // Add pronouns field to profiles table if needed
            bio: data.bio || ''
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Update email if changed
      if (formData.email !== user.email) {
        if (!formData.password) {
          toast({
            title: "Password required",
            description: "Please enter your current password to change your email.",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }

        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
          password: formData.password
        });
        
        if (emailError) throw emailError;
        
        toast({
          title: "Email update initiated",
          description: "Please check your new email for confirmation.",
        });
      }

      // Update profile data
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = () => {
    setShowDeactivateDialog(true);
  };

  const confirmDeactivate = async () => {
    if (!user || !deactivatePassword) {
      toast({
        title: "Password required",
        description: "Please enter your password to confirm account deletion.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, verify the password by attempting to update user with current password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: deactivatePassword
      });

      if (passwordError) {
        toast({
          title: "Invalid password",
          description: "Please check your password and try again.",
          variant: "destructive",
        });
        return;
      }

      // Delete all user data from profiles table
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.from('posts').delete().eq('user_id', user.id);
      await supabase.from('replies').delete().eq('user_id', user.id);
      await supabase.from('bookmarks').delete().eq('user_id', user.id);
      await supabase.from('follows').delete().eq('follower_id', user.id);
      await supabase.from('follows').delete().eq('following_id', user.id);

      // Sign out and redirect
      await signOut();
      navigate("/");
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeactivateDialog(false);
      setDeactivatePassword('');
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
            className="h-8 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/dashboard')}
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
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1 h-auto text-sm">
            post
          </Button>

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
                      {(profile?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <h2 className="text-xl font-medium mb-1">
                  {profile?.display_name || user?.email?.split('@')[0] || 'User'}
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
                  onClick={() => navigate('/dashboard')}
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
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-medium text-gray-900 mb-2">Edit Profile</h1>
              <p className="text-gray-600">Update your profile information, avatar, and banner.</p>
            </div>

            {/* Profile Picture and Banner Section */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Profile Picture */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-3 block">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} />
                    ) : null}
                    <AvatarFallback className="bg-teal-100 text-teal-600 text-xl">
                      {(profile?.display_name || user?.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                    Change
                  </Button>
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-3 block">Banner Image</Label>
                <div className="relative">
                  <div className="w-full h-24 bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="outline" size="sm" className="bg-white/90 text-gray-700 hover:bg-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Change banner
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 mb-8">
              {/* Display Name */}
              <div>
                <Label htmlFor="display_name" className="text-sm font-medium text-gray-900 mb-2 block">
                  Display Name
                </Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="max-w-md"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="max-w-md"
                />
              </div>

              {/* Password (only show when email changed) */}
              {formData.email !== user?.email && (
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-900 mb-2 block">
                    Current Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="max-w-md"
                    placeholder="Enter your current password"
                  />
                  <p className="text-sm text-gray-500 mt-1">Required to confirm email change</p>
                </div>
              )}

              {/* Pronouns */}
              <div>
                <Label htmlFor="pronouns" className="text-sm font-medium text-gray-900 mb-2 block">
                  Pronouns
                </Label>
                <Input
                  id="pronouns"
                  value={formData.pronouns}
                  onChange={(e) => setFormData({ ...formData, pronouns: e.target.value })}
                  className="max-w-md"
                  placeholder="he/him"
                />
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-gray-900 mb-2 block">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="max-w-2xl resize-none"
                  placeholder="video game words"
                />
                <p className="text-sm text-gray-500 mt-2">A brief description of yourself. Markdown is supported.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-12">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
              <h3 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h3>
              <p className="text-red-600 text-sm mb-4">Be careful, these actions are not easily reversible.</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-800">Deactivate account</h4>
                  <p className="text-sm text-red-600">Your profile and posts will be hidden until you log back in.</p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleDeactivate}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Deactivate Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Account Dialog */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All your data, posts, and profile information will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="deactivate-password" className="text-sm font-medium text-gray-900 mb-2 block">
              Enter your password to confirm <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deactivate-password"
              type="password"
              value={deactivatePassword}
              onChange={(e) => setDeactivatePassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeactivateDialog(false);
                setDeactivatePassword('');
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeactivate}
              disabled={!deactivatePassword}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;