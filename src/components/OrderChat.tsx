import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Send, MessageSquare } from 'lucide-react';

export default function OrderChat({ orderId }: { orderId: number }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
    // Rafraichissement auto toutes les 5s (polling simple)
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').eq('order_id', orderId).order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await supabase.from('messages').insert({
      order_id: orderId,
      sender_role: 'client',
      content: newMessage
    });
    setNewMessage('');
    fetchMessages();
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 h-[300px] flex flex-col border border-slate-200">
      <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-bold border-b pb-2">
        <MessageSquare size={16} /> Messagerie directe avec le pressing
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.length === 0 && <p className="text-center text-xs text-slate-400 mt-10">Aucun message. Posez une question.</p>}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_role === 'client' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender_role === 'client' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white border text-slate-700 rounded-bl-none'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1 p-2 border rounded-lg text-sm outline-none focus:border-teal-500"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
