import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Star, TrendingUp, Award, Clock, Check, X } from 'lucide-react';
import { loyaltyService, LoyaltyPoints, LoyaltyTransaction, LoyaltyReward, LoyaltyRedemption } from '../services/loyaltyService';
import { supabase } from '../lib/supabase';
import LoadingButton from '../components/LoadingButton';

export default function LoyaltyDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyPoints | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [coupons, setCoupons] = useState<LoyaltyRedemption[]>([]);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const [points, txs, rwds, cpns] = await Promise.all([
        loyaltyService.getUserPoints(user.id),
        loyaltyService.getUserTransactions(user.id),
        loyaltyService.getAvailableRewards(),
        loyaltyService.getUserActiveCoupons(user.id)
      ]);

      setLoyaltyData(points);
      setTransactions(txs);
      setRewards(rwds);
      setCoupons(cpns);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setRedeeming(rewardId);

    const result = await loyaltyService.redeemReward(user.id, rewardId);

    if (result.success) {
      alert('✅ Récompense échangée avec succès ! Votre coupon est disponible.');
      loadLoyaltyData();
    } else {
      alert('❌ ' + (result.error || 'Erreur lors de l\'échange'));
    }

    setRedeeming(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!loyaltyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Compte fidélité introuvable</p>
      </div>
    );
  }

  const nextTier = loyaltyService.getNextTierInfo(loyaltyData.tier, loyaltyData.lifetime_points);
  const tierIcon = loyaltyService.getTierIcon(loyaltyData.tier);
  const tierColor = loyaltyService.getTierColor(loyaltyData.tier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/client-dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au tableau de bord
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Points disponibles */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Points disponibles</p>
                <p className="text-3xl font-black text-slate-900">{loyaltyData.points}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Utilisez vos points pour des récompenses
            </p>
          </div>

          {/* Tier actuel */}
          <div className={`bg-gradient-to-br ${tierColor} rounded-2xl p-8 shadow-lg text-white`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">{tierIcon}</div>
              <div>
                <p className="text-sm text-white/80">Statut actuel</p>
                <p className="text-3xl font-black uppercase">{loyaltyData.tier}</p>
              </div>
            </div>
            {!nextTier.isMaxTier && (
              <p className="text-sm text-white/80">
                Encore {nextTier.pointsNeeded} points pour {nextTier.name}
              </p>
            )}
          </div>

          {/* Lifetime points */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Points à vie</p>
                <p className="text-3xl font-black text-slate-900">{loyaltyData.lifetime_points}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Total accumulé depuis le début
            </p>
          </div>
        </div>

        {/* Coupons actifs */}
        {coupons.length > 0 && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-12 text-white">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-3">
              <Gift className="w-7 h-7" />
              Vos coupons actifs
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {coupons.map((coupon: any) => (
                <div key={coupon.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <p className="font-bold text-lg mb-2">{coupon.loyalty_rewards.name}</p>
                  <p className="text-green-100 mb-3">{coupon.loyalty_rewards.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Expire le {new Date(coupon.expires_at).toLocaleDateString()}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      {coupon.discount_applied}€
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Récompenses disponibles */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            Récompenses disponibles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const canRedeem = loyaltyData.points >= reward.points_cost;
              
              return (
                <div
                  key={reward.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${
                    canRedeem ? 'border-green-500' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      canRedeem ? 'bg-green-100' : 'bg-slate-100'
                    }`}>
                      {canRedeem ? (
                        <Check className="w-6 h-6 text-green-600" />
                      ) : (
                        <X className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-600">
                        {reward.points_cost}
                      </p>
                      <p className="text-xs text-slate-500">points</p>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {reward.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {reward.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 uppercase">
                      {reward.min_tier}+
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {reward.discount_value}{reward.discount_type === 'percentage' ? '%' : '€'}
                    </span>
                  </div>

                  <LoadingButton
                    loading={redeeming === reward.id}
                    disabled={!canRedeem || redeeming !== null}
                    onClick={() => handleRedeemReward(reward.id)}
                    className={`w-full py-3 rounded-xl font-bold transition ${
                      canRedeem
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? 'Échanger' : 'Points insuffisants'}
                  </LoadingButton>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historique des transactions */}
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            Historique de vos points
          </h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Description</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-900">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {tx.description}
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${
                        tx.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.points > 0 ? '+' : ''}{tx.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
