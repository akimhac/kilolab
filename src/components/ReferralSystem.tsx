import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Gift, Copy, Check, Users } from 'lucide-react';

export default function ReferralSystem({ userId }: { userId: string }) {
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState({ uses: 0, earned: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferralData();
  }, [userId]);

  const loadReferralData = async () => {
    try {
      const { data: code } = await supabase
        .from('referral_codes')
        .select('code, uses_count, bonus_earned_cents')
        .eq('user_id', userId)
        .single();

      if (code) {
        setReferralCode(code.code);
        setStats({ uses: code.uses_count, earned: code.bonus_earned_cents / 100 });
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = `https://kilolab.fr/signup?ref=${referralCode}`;

  return (
    <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="w-8 h-8 text-yellow-400" />
        <div>
          <h3 className="text-xl font-bold text-white">Parrainez vos amis</h3>
          <p className="text-white/60 text-sm">10€ offerts à vous deux !</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-white/80 text-sm mb-3">Votre code de parrainage :</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-bold text-lg text-center">
              {referralCode || 'Chargement...'}
            </div>
            <button
              onClick={copyCode}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 rounded-lg transition-all"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-white/80 text-sm mb-2">Lien de parrainage :</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 rounded-lg transition-all"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <Users className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{stats.uses}</p>
            <p className="text-white/60 text-xs">Parrainages</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <Gift className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{stats.earned}€</p>
            <p className="text-white/60 text-xs">Gagnés</p>
          </div>
        </div>

        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-center text-sm text-yellow-200">
          💡 Invitez vos amis et recevez 10€ de réduction à chaque inscription !
        </div>
      </div>
    </div>
  );
}
