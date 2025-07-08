import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ReplyList from './ReplyList';
import ReplyComposer from './ReplyComposer';
import { useReplies } from '@/hooks/useReplies';

interface RepliesProps {
  postId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const Replies = ({ postId, isOpen, onToggle }: RepliesProps) => {
  const [showComposer, setShowComposer] = useState(false);
  const { replies } = useReplies(postId);

  const handleReplyPosted = () => {
    setShowComposer(false);
  };

  if (!isOpen) return null;

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">
          Replies ({replies.length})
        </h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComposer(!showComposer)}
          >
            {showComposer ? 'Cancel' : 'Reply'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showComposer && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <ReplyComposer postId={postId} onReplyPosted={handleReplyPosted} />
        </div>
      )}

      <ReplyList postId={postId} />
    </div>
  );
};

export default Replies;