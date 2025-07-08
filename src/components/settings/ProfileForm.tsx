import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AvatarUpload from "@/components/AvatarUpload";
import BannerUpload from "@/components/BannerUpload";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  banner_url?: string;
}

interface FormData {
  display_name: string;
  email: string;
  password: string;
  bio: string;
}

interface ProfileFormProps {
  profile: Profile | null;
  user: User | null;
  formData: FormData;
  setFormData: (data: FormData) => void;
  setProfile: (updateFn: (prev: Profile | null) => Profile | null) => void;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileForm = ({
  profile,
  user,
  formData,
  setFormData,
  setProfile,
  isSaving,
  onSave,
  onCancel
}: ProfileFormProps) => {
  return (
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
            <AvatarUpload
              currentAvatarUrl={profile?.avatar_url}
              userId={user?.id || ''}
              displayName={profile?.display_name || user?.email?.split('@')[0]}
              onAvatarUpdate={(newAvatarUrl) => {
                setProfile(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : prev);
              }}
            />
          </div>

          {/* Banner Image */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-3 block">Banner Image</Label>
            <BannerUpload
              currentBannerUrl={profile?.banner_url}
              userId={user?.id || ''}
              onBannerUpdate={(newBannerUrl) => {
                setProfile(prev => prev ? { ...prev, banner_url: newBannerUrl } : prev);
              }}
            />
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
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onSave} 
            disabled={isSaving}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;