import React, { useState } from 'react';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { Bot , Users } from 'lucide-react';

interface MessageItem {
  id: number;
  sender: 'me' | 'staff';
  text: string;
  timestamp: Date;
  file?: File;
}

const MessagingPage: React.FC = () => {
  const { language } = useLanguage();
  const { userProfile } = useAuth();
  const [useChatbot, setUseChatbot] = useState(true);
  const [messages, setMessages] = useState<MessageItem[]>([
    { id: 1, sender: 'staff', text: language === 'en' ? 'Hello, how can I help you today?' : 'Bonjour, comment puis-je vous aider aujourd\'hui ?', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string, file?: File) => {
    const newMessage: MessageItem = {
      id: messages.length + 1,
      sender: 'me',
      text,
      file,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    // Simple chatbot responses
    if (useChatbot) {
      const replyId = messages.length + 2;
      const lower = text.toLowerCase();
      let reply = language === 'en' ? 'Thanks for your message! An agent will contact you shortly.' : 'Merci pour votre message ! Un agent vous contactera sous peu.';
      if (lower.includes('price') || lower.includes('prix')) {
        reply = language === 'en' ? 'Our properties start from 5M XAF. Which city are you interested in?' : 'Nos biens commencent à 5M XAF. Quelle ville vous intéresse ?';
      } else if (lower.includes('reserve') || lower.includes('réserver')) {
        reply = language === 'en' ? 'You can reserve directly from the property page. I can send you a link if you tell me which one.' : 'Vous pouvez réserver directement depuis la page du bien. Dites-moi lequel et je vous envoie le lien.';
      }
      setIsTyping(true);
      setTimeout(() => {
        const botMsg: MessageItem = { id: replyId, sender: 'staff', text: reply, timestamp: new Date() };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat header */}
      <div className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">{language === 'en' ? 'Messaging' : 'Messagerie'}</div>
            <div className="text-sm text-gray-500">{userProfile?.full_name ? `${language === 'en' ? 'Signed in as' : 'Connecté en tant que'} ${userProfile.full_name}` : (language === 'en' ? 'Guest' : 'Invité')}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setUseChatbot(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${useChatbot ? 'bg-geocasa-blue text-white border-geocasa-blue' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
            >
              <Bot className="h-4 w-4" />
              {language === 'en' ? 'Chatbot' : 'Chatbot'}
            </button>
            <button
              onClick={() => setUseChatbot(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${!useChatbot ? 'bg-geocasa-orange text-white border-geocasa-orange' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
            >
              <Users className="h-4 w-4" />
              {language === 'en' ? 'Human Agent' : 'Agent Humain'}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          <MessageList messages={messages} isTyping={isTyping} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white p-3">
        <div className="max-w-3xl mx-auto">
          <MessageInput onSend={handleSendMessage} language={language} />
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
