import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Gift, Users, Copy, Check, Euro } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReferralData {
  referral_code: string;
  referred_count: number;
  pending_reward: number;
  validated_reward: number;
  paid_reward: number;
}

export default function Referral() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUser(session.user);
    loadReferralData(session.user.id);
  };

  const loadReferralData = async (userId: string) => {
    try {
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', userId);

      if (error) throw error;

      const myReferral = referrals?.find(r => !r.referred_id) || null;
      const referredUsers = referrals?.filter(r => r.referred_id) || [];

      const data: ReferralData = {
        referral_code: myReferral?.referral_code || '',
        referred_count: referredUsers.length,
        pending_reward: referredUsers.filter(r => r.status === 'pending').reduce((sum, r) => sum + Number(r.reward_amount), 0),
        validated_reward: referredUsers.filter(r => r.status === 'validated').reduce((sum, r) => sum + Number(r.reward_amount), 0),
        paid_reward: referredUsers.filter(r => r.status === 'paid').reduce((sum, r) => sum + Number(r.reward_amount), 0)
      };

      setReferralData(data);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Erreur lors du chargement des données de parrainage');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `https://kilolab.fr/signup?ref=${referralData?.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 3000);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData?.referral_code || '');
    toast.success('Code copié !');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/client-dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Programme de parrainage
              </h1>
              <p className="text-slate-600">
                Parrainez vos amis et gagnez 10€ par filleul !
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 mb-8">
            <h3 className="font-bold text-lg text-slate-900 mb-3">
              🎁 Comment ça marche ?
            </h3>
            <ol className="space-y-2 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                <span>Partagez votre code ou lien de parrainage avec vos amis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                <span>Ils s'inscrivent sur Kilolab avec votre code</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                <span>Dès leur première commande terminée, vous recevez tous les deux 10€ !</span>
              </li>
            </ol>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center border-2 border-blue-200">
              <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-black text-blue-600 mb-1">
                {referralData?.referred_count || 0}
              </div>
              <div className="text-slate-600 font-semibold">Filleuls</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center border-2 border-green-200">
              <Euro className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-black text-green-600 mb-1">
                {referralData?.validated_reward.toFixed(2)}€
              </div>
              <div className="text-slate-600 font-semibold">À recevoir</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center border-2 border-purple-200">
              <Check className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-black text-purple-600 mb-1">
                {referralData?.paid_reward.toFixed(2)}€
              </div>
              <div className="text-slate-600 font-semibold">Reçu</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Votre code de parrainage
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={referralData?.referral_code || ''}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl bg-slate-50 font-mono text-xl font-bold text-center"
                />
                <button
                  onClick={copyReferralCode}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition flex items-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Copier
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Votre lien de parrainage
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={`https://kilolab.fr/signup?ref=${referralData?.referral_code}`}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl bg-slate-50 text-sm"
                />
                <button
                  onClick={copyReferralLink}
                  className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-xl'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Quand vais-je recevoir ma récompense ?',
                a: 'Dès que votre filleul a terminé sa première commande, vous recevez tous les deux 10€ de crédit utilisable sur votre prochaine commande.'
              },
              {
                q: 'Y a-t-il une limite au nombre de parrainages ?',
                a: 'Non ! Vous pouvez parrainer autant d\'amis que vous le souhaitez et cumuler les récompenses.'
              },
              {
                q: 'Comment utiliser mon crédit de parrainage ?',
                a: 'Le crédit est automatiquement appliqué lors de votre prochaine commande sur Kilolab.'
              }
            ].map((faq, index) => (
              <div key={index}>
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
