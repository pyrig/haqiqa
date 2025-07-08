import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userId: string;
  displayName?: string;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

const AvatarUpload = ({ currentAvatarUrl, userId, displayName, onAvatarUpdate }: AvatarUploadProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropCanvas, setCropCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsDialogOpen(true);
  };

  const cropImage = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return null;

    // Set canvas size to desired avatar size
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    // Calculate crop dimensions (square from center)
    const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
    const cropX = (img.naturalWidth - minDimension) / 2;
    const cropY = (img.naturalHeight - minDimension) / 2;

    // Draw cropped and resized image
    ctx.drawImage(
      img,
      cropX, cropY, minDimension, minDimension, // source
      0, 0, size, size // destination
    );

    setCropCanvas(canvas);
    return canvas;
  }, []);

  const handleImageLoad = () => {
    cropImage();
  };

  const uploadAvatar = async () => {
    if (!cropCanvas || !selectedImage) return;

    setIsUploading(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        cropCanvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.9);
      });

      const fileExt = 'jpg';
      const fileName = `${userId}/avatar.${fileExt}`;

      // Delete existing avatar if it exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`${userId}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onAvatarUpdate(data.publicUrl);
      setIsDialogOpen(false);
      setSelectedImage(null);
      setPreviewUrl(null);
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
    setPreviewUrl(null);
    setCropCanvas(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          {currentAvatarUrl ? (
            <AvatarImage src={currentAvatarUrl} />
          ) : null}
          <AvatarFallback className="bg-teal-100 text-teal-600 text-xl">
            {(displayName || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-teal-600 border-teal-200 hover:bg-teal-50"
          onClick={() => fileInputRef.current?.click()}
        >
          Change
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {previewUrl && (
              <>
                <div className="text-center">
                  <img
                    ref={imageRef}
                    src={previewUrl}
                    alt="Preview"
                    onLoad={handleImageLoad}
                    className="max-w-full max-h-64 mx-auto"
                  />
                </div>
                
                {cropCanvas && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="inline-block">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={cropCanvas.toDataURL()} />
                      </Avatar>
                    </div>
                  </div>
                )}
                
                <canvas
                  ref={canvasRef}
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button 
              onClick={uploadAvatar}
              disabled={!cropCanvas || isUploading}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              {isUploading ? 'Uploading...' : 'Update Avatar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvatarUpload;