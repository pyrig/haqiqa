
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Image, Code, Tag } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';

const PostComposer = () => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { createPost, isCreating } = usePosts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPost({
      content: content.trim(),
      is_anonymous: isAnonymous,
    });

    setContent('');
    setIsAnonymous(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
      <h2 className="text-lg font-medium mb-4">What's on your mind?</h2>
      <form onSubmit={handleSubmit}>
        <Textarea 
          className="w-full border-gray-200 resize-none mb-4 min-h-[120px]" 
          placeholder="Share your thoughts... (No character limit!)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="anonymous-mode"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
          <Label htmlFor="anonymous-mode" className="text-sm text-gray-600">
            Post anonymously (won't link to your profile)
          </Label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" type="button">
              <Image className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" type="button">
              <Code className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" type="button">
              <Tag className="w-4 h-4" />
            </Button>
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

export default PostComposer;
