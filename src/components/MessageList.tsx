import React, { useEffect, useMemo, useRef } from 'react';
import { Bot, CheckCheck, User as UserIcon, Paperclip } from 'lucide-react';

interface MessageItem {
  id: number;
  sender: 'me' | 'staff';
  text: string;
  timestamp: Date;
  file?: File;
}

interface MessageListProps {
  messages: MessageItem[];
  isTyping?: boolean;
}

const formatDay = (date: Date) => {
  const today = new Date();
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = (t.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString();
};

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const itemsWithSeparators = useMemo(() => {
    const result: Array<{ type: 'separator' | 'message'; key: string; payload?: MessageItem; label?: string }> = [];
    let lastDay: string | null = null;
    messages.forEach((m) => {
      const dayLabel = formatDay(m.timestamp);
      if (dayLabel !== lastDay) {
        result.push({ type: 'separator', key: `sep-${dayLabel}-${m.id}`, label: dayLabel });
        lastDay = dayLabel;
      }
      result.push({ type: 'message', key: `msg-${m.id}`, payload: m });
    });
    return result;
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="space-y-4">
      {itemsWithSeparators.map((item) => {
        if (item.type === 'separator') {
          return (
            <div key={item.key} className="flex items-center justify-center">
              <div className="px-3 py-1 text-xs text-gray-500 bg-white border border-gray-200 rounded-full shadow-sm">
                {item.label}
              </div>
            </div>
          );
        }

        const msg = item.payload!;
        const isMe = msg.sender === 'me';
        return (
          <div key={item.key} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
            {!isMe && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-geocasa-blue to-geocasa-orange flex items-center justify-center text-white shadow">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow ${isMe ? 'bg-geocasa-blue text-white rounded-br-sm' : 'bg-white text-gray-900 border border-gray-100 rounded-bl-sm'}`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              {msg.file && (
                <div className={`mt-2 inline-flex items-center gap-2 text-xs ${isMe ? 'text-blue-100' : 'text-gray-600'} bg-black/5 rounded px-2 py-1` }>
                  <Paperclip className="h-3 w-3" />
                  <span className="truncate max-w-[160px]">{msg.file.name}</span>
                </div>
              )}
              <div className={`text-[10px] mt-1 flex items-center gap-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {isMe && <CheckCheck className="h-3 w-3" />}
              </div>
            </div>
            {isMe && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
          </div>
        );
      })}

      {isTyping && (
        <div className="flex justify-start gap-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-geocasa-blue to-geocasa-orange flex items-center justify-center text-white shadow">
            <Bot className="h-4 w-4" />
          </div>
          <div className="bg-white border border-gray-100 text-gray-600 rounded-2xl rounded-bl-sm px-4 py-3 shadow inline-flex items-center gap-2">
            <span className="inline-flex gap-1">
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;


