
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { LogOut, Shield, Palette, Bell, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SettingsTab = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    isPrivate: false,
    themeColor: '#14b8a6',
    emailNotifications: true,
    showOnlineStatus: true,
    allowAnonymousReplies: true
  });
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    // In a real app, you'd save these settings to your database
    // For now, we'll just show a success message
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
      setLoading(false);
    }, 1000);
  };

  const themeColors = [
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Private Account</h4>
              <p className="text-sm text-gray-600">Only followers can see your posts</p>
            </div>
            <Switch
              checked={settings.isPrivate}
              onCheckedChange={(checked) => setSettings({ ...settings, isPrivate: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Allow Anonymous Replies</h4>
              <p className="text-sm text-gray-600">Let others reply to your posts anonymously</p>
            </div>
            <Switch
              checked={settings.allowAnonymousReplies}
              onCheckedChange={(checked) => setSettings({ ...settings, allowAnonymousReplies: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Theme Color</h4>
            <Select value={settings.themeColor} onValueChange={(value) => setSettings({ ...settings, themeColor: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select theme color" />
              </SelectTrigger>
              <SelectContent>
                {themeColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Show Online Status</h4>
              <p className="text-sm text-gray-600">Let others see when you're online</p>
            </div>
            <Switch
              checked={settings.showOnlineStatus}
              onCheckedChange={(checked) => setSettings({ ...settings, showOnlineStatus: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleSaveSettings} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
          
          <Separator />
          
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
