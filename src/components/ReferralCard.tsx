import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Copy, Share2, Gift, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReferralCard() {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Récupérer le code de parrainage
    const { data: code } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('user_id', user.id)
      .single();

    if (code) {
      setReferralCode(code.code);
    } else {
      // Créer un code si inexistant
      const newCode = `KILO${user.id.slice(0, 6).toUpperCase()}`;
      await supabase
        .from('referral_codes')
        .insert({ user_id: user.id, code: newCode, type: 'client' });
      setReferralCode(newCode);
    }

    // Calculer les gains
    const { data: referrals } = await supabase
      .from('referrals')
      .select('reward_amount')
      .eq('referrer_id', user.id)
      .eq('status', 'completed');

    if (referrals) {
      const total = referrals.reduce((sum, r) => sum + r.reward_amount, 0);
      setEarnings(total);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Code copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Kilolab - 10€ offerts',
        text: `Utilise mon code ${referralCode} et gagne 10€ sur ta première commande Kilolab !`,
        url: `https://kilolab.fr?ref=${referralCode}`
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-white/20 rounded-xl">
          <Gift size={24} />
        </div>
        <div>
          <h3 className="font-black text-xl">Parraine tes amis</h3>
          <p className="text-sm text-purple-100">10€ offerts pour chacun</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl mb-4">
        <p className="text-xs text-purple-100 mb-2">Ton code de parrainage</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white text-purple-600 font-black text-2xl px-4 py-3 rounded-lg text-center tracking-wider">
            {referralCode || '...'}
          </div>
          <button
            onClick={copyCode}
            className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
          <button
            onClick={shareCode}
            className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-sm text-purple-100">Gains total</span>
          <span className="text-3xl font-black">{earnings}€</span>
        </div>
      </div>
    </div>
  );
}
