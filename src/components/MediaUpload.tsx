
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Video, File, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaUploadProps {
  onMediaChange: (urls: string[]) => void;
  maxFiles?: number;
}

const MediaUpload = ({ onMediaChange, maxFiles = 4 }: MediaUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (uploadedFiles.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} files per post.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // For now, we'll create object URLs for preview
      // In a real app, you'd upload to Supabase Storage here
      const newUrls = files.map(file => URL.createObjectURL(file));
      const updatedFiles = [...uploadedFiles, ...newUrls];
      setUploadedFiles(updatedFiles);
      onMediaChange(updatedFiles);
      
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    onMediaChange(updatedFiles);
  };

  const getFileIcon = (url: string) => {
    if (url.includes('image')) return <Image className="w-4 h-4" />;
    if (url.includes('video')) return <Video className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || uploadedFiles.length >= maxFiles}
        >
          <Image className="w-4 h-4 mr-1" />
          {isUploading ? 'Uploading...' : 'Add Media'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {uploadedFiles.map((url, index) => (
            <div key={index} className="relative">
              {url.includes('image') ? (
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
              ) : (
                <div className="w-full h-24 bg-gray-100 rounded border flex items-center justify-center">
                  {getFileIcon(url)}
                  <span className="text-xs text-gray-600 ml-2">File {index + 1}</span>
                </div>
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => removeFile(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
