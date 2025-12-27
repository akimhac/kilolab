import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Copy, Gift, Share2, Star, Users, TrendingUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function Referral() {
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    earnedCredits: 0
  });
  const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Vous devez être connecté');
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, referral_code')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserName(profile.full_name || 'Utilisateur');
        
        if (profile.referral_code) {
          setReferralCode(profile.referral_code);
        } else {
          const newCode = generateReferralCode(profile.full_name || user.email);
          await createReferralCode(user.id, newCode);
          setReferralCode(newCode);
        }
      } else {
        const newCode = generateReferralCode(user.email);
        await createReferralCode(user.id, newCode);
        setReferralCode(newCode);
      }

      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (referrals) {
        const completed = referrals.filter(r => r.status === 'completed');
        const pending = referrals.filter(r => r.status === 'pending');
        
        setStats({
          totalReferrals: referrals.length,
          pendingReferrals: pending.length,
          earnedCredits: completed.length * 10
        });

        setRecentReferrals(referrals.slice(0, 5));
      }

    } catch (error) {
      console.error('Erreur chargement parrainage:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = (name: string): string => {
    const cleanName = name
      .split('@')[0]
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase()
      .slice(0, 6);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `KILO-${cleanName}${randomNum}`;
  };

  const createReferralCode = async (userId: string, code: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ referral_code: code })
        .eq('id', userId);

      if (error) {
        console.error('Erreur création code:', error);
      }
    } catch (error) {
      console.error('Erreur création code:', error);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Code copié !');
  };

  const shareCode = async () => {
    const shareText = `Rejoins-moi sur Kilolab et économise 10€ sur ta première commande avec mon code : ${referralCode}`;
    const shareUrl = `https://kilolab.fr?ref=${referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kilolab - Parrainage',
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        copyCode();
      }
    } else {
      copyCode();
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <Loader2 className='animate-spin text-teal-600' size={48} />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-900 pb-20'>
      <Navbar />

      <div className='pt-32 px-4 max-w-4xl mx-auto'>
        <div className='text-center mb-12'>
          <div className='w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce'>
            <Gift size={40}/>
          </div>

          <h1 className='text-4xl font-black mb-4'>
            Invitez un ami,<br/>
            Gagnez du linge propre.
          </h1>

          <p className='text-slate-500 text-lg mb-6 max-w-md mx-auto'>
            Offrez <span className='font-bold text-slate-900'>10€</span> à vos amis sur leur première commande.
            Recevez <span className='font-bold text-slate-900'>10€</span> dès qu ils commandent.
          </p>

          <div className='grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10'>
            <div className='bg-white rounded-xl p-4 shadow-sm border border-slate-100'>
              <div className='text-2xl font-black text-teal-600'>{stats.totalReferrals}</div>
              <div className='text-xs text-slate-500 font-bold'>Filleuls</div>
            </div>
            <div className='bg-white rounded-xl p-4 shadow-sm border border-slate-100'>
              <div className='text-2xl font-black text-orange-600'>{stats.pendingReferrals}</div>
              <div className='text-xs text-slate-500 font-bold'>En attente</div>
            </div>
            <div className='bg-white rounded-xl p-4 shadow-sm border border-slate-100'>
              <div className='text-2xl font-black text-green-600'>{stats.earnedCredits}€</div>
              <div className='text-xs text-slate-500 font-bold'>Gagnés</div>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-8 mb-8 border-2 border-teal-200 shadow-xl'>
          <h2 className='text-center text-sm font-bold text-slate-600 uppercase tracking-wider mb-4'>
            Votre code de parrainage
          </h2>

          <div className='bg-white p-3 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-between max-w-lg mx-auto mb-6'>
            <div className='px-6 font-mono font-black text-2xl sm:text-3xl tracking-widest text-slate-900'>
              {referralCode || 'CHARGEMENT...'}
            </div>
            <button 
              onClick={copyCode} 
              className='bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex gap-2 items-center'
            >
              <Copy size={18}/> Copier
            </button>
          </div>

          <button
            onClick={shareCode}
            className='w-full max-w-lg mx-auto flex items-center justify-center gap-2 bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-500 transition shadow-lg'
          >
            <Share2 size={20} />
            Partager avec mes amis
          </button>
        </div>

        {recentReferrals.length > 0 && (
          <div className='bg-white rounded-3xl p-6 shadow-sm border border-slate-100'>
            <h3 className='font-bold text-xl mb-6 flex items-center gap-2'>
              <Users size={20} className='text-teal-600' />
              Vos filleuls récents
            </h3>

            <div className='space-y-3'>
              {recentReferrals.map((referral, idx) => (
                <div 
                  key={referral.id || idx} 
                  className='flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100'
                >
                  <div>
                    <div className='text-xs text-slate-400'>
                      {new Date(referral.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}