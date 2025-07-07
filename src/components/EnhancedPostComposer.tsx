
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import RichTextEditor from './RichTextEditor';
import MediaUpload from './MediaUpload';

const EnhancedPostComposer = () => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState<'public' | 'followers' | 'private'>('public');
  const [contentWarning, setContentWarning] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const { createPost, isCreating } = usePosts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPost({
      content: content.trim(),
      is_anonymous: isAnonymous,
      privacy_level: privacyLevel,
      content_warning: contentWarning.trim() || undefined,
      media_urls: mediaUrls,
    });

    // Reset form
    setContent('');
    setIsAnonymous(false);
    setPrivacyLevel('public');
    setContentWarning('');
    setMediaUrls([]);
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
      <h2 className="text-lg font-medium mb-4">What's on your mind?</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border rounded-md">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Share your thoughts... (No character limit!)"
            className="min-h-[150px]"
          />
        </div>

        <MediaUpload onMediaChange={setMediaUrls} />

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous-mode"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous-mode" className="text-sm text-gray-600">
              Post anonymously (won't link to your profile)
            </Label>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="privacy" className="text-sm text-gray-600">
                Privacy:
              </Label>
              <Select value={privacyLevel} onValueChange={(value: 'public' | 'followers' | 'private') => setPrivacyLevel(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-warning" className="text-sm text-gray-600 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Content Warning (optional)
            </Label>
            <Input
              id="content-warning"
              value={contentWarning}
              onChange={(e) => setContentWarning(e.target.value)}
              placeholder="e.g. Food, Politics, Spoilers..."
              className="text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {content.length} characters • Markdown supported
          </div>
          <Button 
            className="bg-teal-500 hover:bg-teal-600 text-white"
            disabled={!content.trim() || isCreating}
            type="submit"
          >
            {isCreating ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedPostComposer;
