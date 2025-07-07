
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Code, Link, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText;
    if (selectedText) {
      newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    } else {
      newText = value.substring(0, start) + before + after + value.substring(end);
    }
    
    onChange(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + (selectedText ? selectedText.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-teal-500 hover:underline" target="_blank">$1</a>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^1\. (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2 p-2 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('**', '**')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('*', '*')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('`', '`')}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('[Link Text](', ')')}
          title="Link"
        >
          <Link className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('- ', '')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('1. ', '')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <div className="ml-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>
      
      {showPreview ? (
        <div 
          className="min-h-[120px] p-3 border rounded-md bg-gray-50"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(value) }}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] resize-none border-0 focus:ring-0"
        />
      )}
    </div>
  );
};

export default RichTextEditor;
