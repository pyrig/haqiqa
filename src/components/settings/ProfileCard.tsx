import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  website?: string;
  avatar_url: string;
}

interface ProfileCardProps {
  profile: Profile | null;
  userEmail?: string;
}

const ProfileCard = ({ profile, userEmail }: ProfileCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:block lg:w-80 bg-white">
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
                  {(profile?.display_name || userEmail || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <h2 className="text-xl font-medium mb-1">
              {profile?.display_name || userEmail?.split('@')[0] || 'User'}
            </h2>
            
            <p className="text-teal-100 text-sm mb-2">
              @{profile?.username || userEmail?.split('@')[0] || 'user'}
            </p>
            
            <p className="text-teal-100 text-sm mb-2">
              {profile?.bio || 'sharing thoughts & creativity'}
            </p>
            
            {profile?.website && (
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-100 text-sm mb-4 inline-block hover:text-white underline"
              >
                🔗 {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            
            <div className="mb-6"></div>
            
            <Button 
              variant="outline" 
              className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 rounded-lg font-medium mt-4"
              onClick={() => navigate(`/profile/${profile?.username || userEmail?.split('@')[0]}`)}
            >
              View profile
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
  );
};

export default ProfileCard;