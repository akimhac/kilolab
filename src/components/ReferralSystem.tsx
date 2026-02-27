// Système de Parrainage - Sans dépenser d'argent
// Récompenses: Priority access, badges, free express upgrade
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Gift, Copy, Share2, Users, Crown, Zap, Star, Check, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAnalytics } from '../hooks/useAnalytics';

interface ReferralStats {
  code: string;
  usesCount: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  rewards: string[];
  nextReward: string;
  usesToNextLevel: number;
}

const LEVELS = {
  bronze: { min: 0, name: 'Bronze', color: 'from-amber-600 to-amber-700', icon: '🥉', rewards: ['Badge Bronze'] },
  silver: { min: 3, name: 'Silver', color: 'from-slate-400 to-slate-500', icon: '🥈', rewards: ['Badge Silver', '1 Express gratuit'] },
  gold: { min: 10, name: 'Gold', color: 'from-yellow-400 to-amber-500', icon: '🥇', rewards: ['Badge Gold', '3 Express gratuits', 'Priorité matching'] },
  platinum: { min: 25, name: 'Platinum', color: 'from-purple-400 to-pink-500', icon: '💎', rewards: ['Badge Platinum', 'Express illimité', 'Priorité VIP', 'Accès bêta'] },
};

function getLevel(uses: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (uses >= 25) return 'platinum';
  if (uses >= 10) return 'gold';
  if (uses >= 3) return 'silver';
  return 'bronze';
}

function getNextLevel(current: 'bronze' | 'silver' | 'gold' | 'platinum'): 'silver' | 'gold' | 'platinum' | null {
  if (current === 'bronze') return 'silver';
  if (current === 'silver') return 'gold';
  if (current === 'gold') return 'platinum';
  return null;
}

export function ReferralSystem({ userId }: { userId: string }) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { trackReferralShared } = useAnalytics();

  useEffect(() => {
    fetchReferralStats();
  }, [userId]);

  const fetchReferralStats = async () => {
    try {
      const { data: codeData } = await supabase
        .from('referral_codes')
        .select('code, uses_count')
        .eq('user_id', userId)
        .single();

      if (codeData) {
        const level = getLevel(codeData.uses_count);
        const nextLevel = getNextLevel(level);
        
        setStats({
          code: codeData.code,
          usesCount: codeData.uses_count,
          level,
          rewards: LEVELS[level].rewards,
          nextReward: nextLevel ? LEVELS[nextLevel].rewards[0] : 'Maximum atteint!',
          usesToNextLevel: nextLevel ? LEVELS[nextLevel].min - codeData.uses_count : 0,
        });
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!stats) return;
    navigator.clipboard.writeText(stats.code);
    setCopied(true);
    toast.success('Code copié !');
    trackReferralShared('copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!stats) return;
    const text = `🧺 Rejoins Kilolab et profite de -20% sur ta 1ère commande ! Utilise mon code: ${stats.code}\n\n👉 https://kilolab.fr/?ref=${stats.code}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    trackReferralShared('whatsapp');
  };

  const shareSMS = () => {
    if (!stats) return;
    const text = `Teste Kilolab (laverie à domicile) avec mon code ${stats.code} et obtiens -20% ! 👉 kilolab.fr`;
    window.open(`sms:?body=${encodeURIComponent(text)}`, '_blank');
    trackReferralShared('sms');
  };

  const shareEmail = () => {
    if (!stats) return;
    const subject = 'Découvre Kilolab - Laverie à domicile';
    const body = `Salut !\n\nJe voulais te partager Kilolab, un super service de laverie à domicile. Tu envoies ton linge et il revient propre et plié en 48h !\n\nUtilise mon code ${stats.code} pour avoir -20% sur ta première commande.\n\n👉 https://kilolab.fr/?ref=${stats.code}\n\nÀ bientôt !`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    trackReferralShared('email');
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/2 mb-4" />
        <div className="h-10 bg-white/20 rounded w-full mb-4" />
        <div className="h-8 bg-white/20 rounded w-3/4" />
      </div>
    );
  }

  if (!stats) return null;

  const levelInfo = LEVELS[stats.level];
  const nextLevelInfo = getNextLevel(stats.level) ? LEVELS[getNextLevel(stats.level)!] : null;
  const progress = nextLevelInfo 
    ? ((stats.usesCount - LEVELS[stats.level].min) / (nextLevelInfo.min - LEVELS[stats.level].min)) * 100
    : 100;

  return (
    <div className={`bg-gradient-to-br ${levelInfo.color} rounded-3xl p-6 text-white shadow-xl overflow-hidden relative`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl">
              {levelInfo.icon}
            </div>
            <div>
              <h3 className="font-black text-lg">Parrainage</h3>
              <p className="text-white/70 text-sm">Niveau {levelInfo.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">{stats.usesCount}</p>
            <p className="text-white/70 text-xs">filleuls</p>
          </div>
        </div>

        {/* Progress bar */}
        {nextLevelInfo && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Prochain niveau: {nextLevelInfo.name}</span>
              <span>{stats.usesToNextLevel} restants</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Code */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
          <p className="text-xs text-white/70 mb-2">Ton code parrainage</p>
          <div className="flex items-center justify-between">
            <span className="font-mono font-black text-2xl tracking-widest">{stats.code}</span>
            <button 
              onClick={copyCode}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button 
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
          >
            <MessageCircle size={18} /> WhatsApp
          </button>
          <button 
            onClick={shareSMS}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
          >
            <Share2 size={18} /> SMS
          </button>
          <button 
            onClick={shareEmail}
            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
          >
            <Gift size={18} /> Email
          </button>
        </div>

        {/* Rewards */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <p className="text-xs text-white/70 mb-2 flex items-center gap-1">
            <Crown size={14} /> Tes récompenses actuelles
          </p>
          <div className="flex flex-wrap gap-2">
            {stats.rewards.map((reward, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                ✓ {reward}
              </span>
            ))}
          </div>
          {nextLevelInfo && (
            <p className="text-xs text-white/70 mt-3 flex items-center gap-1">
              <Zap size={14} /> Prochain: {stats.nextReward}
            </p>
          )}
        </div>

        {/* What friends get */}
        <div className="mt-4 p-3 bg-white/10 backdrop-blur rounded-xl">
          <p className="text-sm text-center">
            <span className="font-bold">Ton ami reçoit:</span> -20% sur sa 1ère commande
          </p>
        </div>
      </div>
    </div>
  );
}

// Widget compact pour les pages
export function ReferralWidget({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const { trackReferralShared } = useAnalytics();

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copié !');
    trackReferralShared('copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `🧺 -20% sur Kilolab avec mon code: ${code} 👉 kilolab.fr/?ref=${code}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    trackReferralShared('whatsapp');
  };

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 text-white">
      <Gift size={20} />
      <span className="font-bold text-sm flex-1">Code: {code}</span>
      <button onClick={copyCode} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all">
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <button onClick={shareWhatsApp} className="p-2 bg-[#25D366] hover:bg-[#20BD5A] rounded-lg transition-all">
        <MessageCircle size={16} />
      </button>
    </div>
  );
}

export default ReferralSystem;
