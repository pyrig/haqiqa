import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X } from 'lucide-react';

interface BannerUploadProps {
  currentBannerUrl?: string;
  userId: string;
  onBannerUpdate: (newBannerUrl: string) => void;
}

const BannerUpload = ({ currentBannerUrl, userId, onBannerUpdate }: BannerUploadProps) => {
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

    if (file.size > 10 * 1024 * 1024) { // 10MB limit for banners
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
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

    // Set canvas size to banner dimensions (3:1 aspect ratio)
    const width = 900;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // Calculate crop dimensions for banner aspect ratio
    const targetAspectRatio = width / height; // 3:1
    const imageAspectRatio = img.naturalWidth / img.naturalHeight;

    let cropWidth, cropHeight, cropX, cropY;

    if (imageAspectRatio > targetAspectRatio) {
      // Image is wider - crop from sides
      cropHeight = img.naturalHeight;
      cropWidth = cropHeight * targetAspectRatio;
      cropX = (img.naturalWidth - cropWidth) / 2;
      cropY = 0;
    } else {
      // Image is taller - crop from top/bottom
      cropWidth = img.naturalWidth;
      cropHeight = cropWidth / targetAspectRatio;
      cropX = 0;
      cropY = (img.naturalHeight - cropHeight) / 2;
    }

    // Draw cropped and resized image
    ctx.drawImage(
      img,
      cropX, cropY, cropWidth, cropHeight, // source
      0, 0, width, height // destination
    );

    setCropCanvas(canvas);
    return canvas;
  }, []);

  const handleImageLoad = () => {
    cropImage();
  };

  const uploadBanner = async () => {
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
      const fileName = `${userId}/banner.${fileExt}`;

      // Delete existing banner if it exists
      if (currentBannerUrl) {
        const oldPath = currentBannerUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`${userId}/${oldPath}`]);
        }
      }

      // Upload new banner
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new banner URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: data.publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onBannerUpdate(data.publicUrl);
      setIsDialogOpen(false);
      setSelectedImage(null);
      setPreviewUrl(null);
      
      toast({
        title: "Banner updated",
        description: "Your banner has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({
        title: "Upload failed",
        description: "Failed to update banner. Please try again.",
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
      <div className="relative">
        <div className="w-full h-24 bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400 rounded-lg overflow-hidden relative">
          {currentBannerUrl && (
            <img 
              src={currentBannerUrl} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/90 text-gray-700 hover:bg-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change banner
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Banner</DialogTitle>
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
                    <div className="inline-block border rounded-lg overflow-hidden">
                      <img 
                        src={cropCanvas.toDataURL()} 
                        alt="Banner preview"
                        className="w-60 h-20 object-cover"
                      />
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
              onClick={uploadBanner}
              disabled={!cropCanvas || isUploading}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              {isUploading ? 'Uploading...' : 'Update Banner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BannerUpload;