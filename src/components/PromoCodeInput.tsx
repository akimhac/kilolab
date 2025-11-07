import { useState } from 'react';
import { Tag, Check, X } from 'lucide-react';
import { validatePromoCode } from '../lib/promo';

interface PromoCodeInputProps {
  userId: string;
  onApply: (discount: number, promoId: string) => void;
}

export default function PromoCodeInput({ userId, onApply }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleApply = async () => {
    if (!code) return;
    
    setLoading(true);
    setMessage('');

    const result = await validatePromoCode(code, userId);

    if (result.valid) {
      const discount = result.discount || result.fixedAmount || 0;
      setSuccess(true);
      setMessage(`✅ Code applique ! -${discount}${result.discount ? '%' : '€'}`);
      onApply(discount, result.promoId);
    } else {
      setSuccess(false);
      setMessage(`❌ ${result.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-white/80 font-semibold flex items-center gap-2">
        <Tag className="w-5 h-5" />
        Code promo
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="BIENVENUE30"
          disabled={success}
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        />
        <button
          onClick={handleApply}
          disabled={loading || success || !code}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : success ? (
            <Check className="w-5 h-5" />
          ) : (
            'Appliquer'
          )}
        </button>
      </div>

      {message && (
        <div className={`text-sm ${success ? 'text-green-300' : 'text-red-300'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
