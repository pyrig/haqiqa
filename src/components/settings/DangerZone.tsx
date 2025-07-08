import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface DangerZoneProps {
  user: User | null;
  onAccountDeleted: () => void;
}

const DangerZone = ({ user, onAccountDeleted }: DangerZoneProps) => {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const { toast } = useToast();

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

      onAccountDeleted();
      
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

  return (
    <>
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
    </>
  );
};

export default DangerZone;