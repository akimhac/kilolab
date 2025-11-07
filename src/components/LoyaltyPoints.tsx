import { Gift, Star } from 'lucide-react';

interface LoyaltyPointsProps {
  points: number;
  totalSpent: number;
}

export default function LoyaltyPoints({ points, totalSpent }: LoyaltyPointsProps) {
  const nextReward = 1000; // 10€ de réduction à 1000 points
  const progress = (points / nextReward) * 100;

  return (
    <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="w-8 h-8 text-yellow-400" />
        <div>
          <h3 className="text-xl font-bold text-white">Programme Fidélité</h3>
          <p className="text-white/60 text-sm">1€ dépensé = 10 points</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/80">{points} points</span>
            <span className="text-yellow-400">{nextReward - points} points pour une récompense</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-white">{points}</p>
            <p className="text-white/60 text-xs">Points totaux</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-white">{totalSpent.toFixed(0)}€</p>
            <p className="text-white/60 text-xs">Dépensés</p>
          </div>
        </div>

        {points >= nextReward && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center">
            <p className="text-green-300 font-semibold">🎉 10€ de réduction disponible !</p>
          </div>
        )}
      </div>
    </div>
  );
}
