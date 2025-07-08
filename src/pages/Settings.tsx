import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfileCard from "@/components/settings/ProfileCard";
import ProfileForm from "@/components/settings/ProfileForm";
import DangerZone from "@/components/settings/DangerZone";

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  pronouns: string;
  avatar_url: string;
  banner_url?: string;
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
            pronouns: data.pronouns || '',
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
          pronouns: formData.pronouns,
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

  const handleAccountDeleted = async () => {
    await signOut();
    navigate("/");
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
            src="/lovable-uploads/24441693-0248-4339-9e32-08a834c45d4e.png" 
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
              <DropdownMenuItem onClick={() => navigate(`/profile/${profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0]}`)}>
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
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <ProfileCard 
          profile={profile} 
          userEmail={user?.email} 
        />

        {/* Main Content */}
        <ProfileForm
          profile={profile}
          user={user}
          formData={formData}
          setFormData={setFormData}
          setProfile={setProfile}
          isSaving={isSaving}
          onSave={handleSave}
          onCancel={() => navigate('/dashboard')}
        />
      </div>

      {/* Danger Zone - Outside the main content area */}
      <div className="bg-white px-8 pb-8">
        <DangerZone 
          user={user} 
          onAccountDeleted={handleAccountDeleted}
        />
      </div>
    </div>
  );
};

export default Settings;