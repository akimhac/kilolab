import { useState } from 'react';
import { Heart, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface TipModalProps {
  washerName: string;
  orderId: string;
  onClose: () => void;
  onTipSent: (amount: number) => void;
}

const TIP_AMOUNTS = [2, 5, 10];

export default function TipModal({ washerName, orderId, onClose, onTipSent }: TipModalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const tipAmount = selected || (custom ? parseFloat(custom) : 0);

  const handleSend = async () => {
    if (!tipAmount || tipAmount <= 0) return;
    setSending(true);
    
    try {
      // For now, record the tip in the order metadata
      // In production, this would trigger a Stripe payment
      const { supabase } = await import('../lib/supabase');
      await supabase.from('orders').update({
        tip_amount: tipAmount,
        tip_at: new Date().toISOString()
      }).eq('id', orderId);

      setSent(true);
      onTipSent(tipAmount);
      toast.success(`Merci ! ${tipAmount}€ de pourboire envoyé à ${washerName}`);
      setTimeout(onClose, 2000);
    } catch {
      toast.error('Erreur lors de l\'envoi du pourboire');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Merci pour votre générosité !</h3>
          <p className="text-slate-500">{tipAmount}€ envoyé à {washerName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()} data-testid="tip-modal">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart size={28} className="text-pink-500 fill-pink-500" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Laisser un pourboire</h3>
          <p className="text-sm text-slate-500 mt-1">100% reversé à {washerName}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {TIP_AMOUNTS.map(amount => (
            <button
              key={amount}
              onClick={() => { setSelected(amount); setCustom(''); }}
              data-testid={`tip-${amount}`}
              className={`py-3 rounded-xl font-bold text-lg transition-all ${
                selected === amount 
                  ? 'bg-teal-500 text-white shadow-lg scale-105' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {amount}€
            </button>
          ))}
        </div>

        <div className="relative mb-5">
          <input
            type="number"
            placeholder="Autre montant"
            value={custom}
            onChange={e => { setCustom(e.target.value); setSelected(null); }}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            min="1"
            max="100"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
        </div>

        <button
          onClick={handleSend}
          disabled={!tipAmount || tipAmount <= 0 || sending}
          data-testid="send-tip-btn"
          className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {sending ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} />}
          {tipAmount > 0 ? `Envoyer ${tipAmount}€` : 'Choisir un montant'}
        </button>

        <button onClick={onClose} className="w-full mt-3 py-2 text-slate-400 text-sm font-medium hover:text-slate-600 transition">
          Non merci, passer
        </button>
      </div>
    </div>
  );
}
