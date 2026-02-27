// Chat In-App Client ↔ Washer - Messages instantanés
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Send, Image, Paperclip, X, Check, CheckCheck, Phone, MoreVertical } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  read_at?: string;
  is_mine: boolean;
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar_url?: string;
  role: 'client' | 'washer';
  is_online?: boolean;
}

interface ChatProps {
  orderId: string;
  currentUserId: string;
  participant: ChatParticipant;
  onClose?: () => void;
}

export function Chat({ orderId, currentUserId, participant, onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMessages();
    markMessagesAsRead();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${orderId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${orderId}`,
      }, (payload) => {
        const newMsg = payload.new as Message;
        setMessages(prev => [...prev, {
          ...newMsg,
          is_mine: newMsg.sender_id === currentUserId
        }]);
        
        // Mark as read if it's not mine
        if (newMsg.sender_id !== currentUserId) {
          markMessageAsRead(newMsg.id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data?.map(m => ({
        ...m,
        is_mine: m.sender_id === currentUserId
      })) || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('order_id', orderId)
        .eq('recipient_id', currentUserId)
        .is('read_at', null);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase.from('messages').insert({
        order_id: orderId,
        sender_id: currentUserId,
        recipient_id: participant.id,
        content,
      });

      if (error) throw error;

      // Send push notification to recipient
      await supabase.functions.invoke('send-notification', {
        body: {
          user_id: participant.id,
          title: 'Nouveau message',
          body: content.substring(0, 100),
          data: { type: 'chat', order_id: orderId }
        }
      }).catch(() => {}); // Silently fail if function doesn't exist

    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
      setNewMessage(content);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const formatMessageTime = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) {
      return format(d, 'HH:mm');
    } else if (isYesterday(d)) {
      return `Hier ${format(d, 'HH:mm')}`;
    }
    return format(d, 'd MMM HH:mm', { locale: fr });
  };

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';

    messages.forEach(msg => {
      const msgDate = format(new Date(msg.created_at), 'yyyy-MM-dd');
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msgDate, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Aujourd'hui";
    if (isYesterday(date)) return 'Hier';
    return format(date, 'd MMMM yyyy', { locale: fr });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-3xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {participant.avatar_url ? (
              <img src={participant.avatar_url} alt={participant.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                {participant.name[0]}
              </div>
            )}
            {participant.is_online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900">{participant.name}</p>
            <p className="text-xs text-slate-500 capitalize">{participant.role === 'washer' ? 'Votre Washer' : 'Client'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <Phone size={20} className="text-slate-500" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <MoreVertical size={20} className="text-slate-500" />
          </button>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <X size={20} className="text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Send size={24} className="text-teal-500" />
            </div>
            <p className="text-slate-600 font-medium">Aucun message</p>
            <p className="text-sm text-slate-400">Envoyez un message pour commencer</p>
          </div>
        ) : (
          groupMessagesByDate().map(group => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 bg-slate-200 text-slate-500 text-xs font-medium rounded-full">
                  {formatDateHeader(group.date)}
                </span>
              </div>

              {/* Messages */}
              {group.messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div className={`max-w-[75%] ${msg.is_mine ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        msg.is_mine
                          ? 'bg-teal-500 text-white rounded-br-md'
                          : 'bg-white text-slate-900 rounded-bl-md shadow-sm'
                      }`}
                    >
                      {msg.image_url && (
                        <img src={msg.image_url} alt="" className="rounded-xl mb-2 max-w-full" />
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-slate-400">{formatMessageTime(msg.created_at)}</span>
                      {msg.is_mine && (
                        msg.read_at ? (
                          <CheckCheck size={14} className="text-teal-500" />
                        ) : (
                          <Check size={14} className="text-slate-400" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white px-4 py-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <Paperclip size={20} className="text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <Image size={20} className="text-slate-400" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Écrivez un message..."
            className="flex-1 px-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className={`p-3 rounded-xl transition-all ${
              newMessage.trim() && !sending
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Chat bubble for opening chat
export function ChatBubble({ 
  orderId, 
  participantName, 
  unreadCount = 0,
  onClick 
}: { 
  orderId: string; 
  participantName: string; 
  unreadCount?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-teal-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-teal-600 transition-all hover:scale-110 z-50"
    >
      <Send size={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

// Quick message templates
export function QuickMessages({ onSelect }: { onSelect: (message: string) => void }) {
  const templates = [
    "Je suis en route ! 🚗",
    "Je serai là dans 10 minutes",
    "Je suis arrivé(e) !",
    "Le linge est prêt !",
    "Parfait, merci !",
    "D'accord 👍",
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {templates.map((msg, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(msg)}
          className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-600 transition-all"
        >
          {msg}
        </button>
      ))}
    </div>
  );
}

export default Chat;
