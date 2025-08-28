import React, { useRef, useState } from 'react';
import { Paperclip, Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (text: string, file?: File) => void;
  language: 'en' | 'fr';
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, language }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | undefined>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    onSend(text.trim(), file);
    setText('');
    setFile(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {file && (
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <Paperclip className="h-3 w-3" />
          <span className="truncate max-w-[200px]">{file.name}</span>
          <button type="button" onClick={() => setFile(undefined)} className="ml-auto text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <label className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
          <Paperclip className="h-5 w-5 text-gray-500" />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || undefined)}
            className="hidden"
          />
        </label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
            }
          }}
          placeholder={language === 'en' ? 'Type your message...' : 'Écrivez votre message...'}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none resize-none max-h-32"
          rows={1}
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark"
        >
          <Send className="h-4 w-4" />
          {language === 'en' ? 'Send' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;


