// Component for washer to adjust weight at pickup
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Scale, Check, X, AlertTriangle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  orderId: string;
  currentWeight: number;
  clientId: string;
  onUpdate?: (newWeight: number) => void;
  onClose?: () => void;
};

export default function WeightAdjustment({ orderId, currentWeight, clientId, onUpdate, onClose }: Props) {
  const [newWeight, setNewWeight] = useState(currentWeight);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<'adjust' | 'confirm'>('adjust');

  const difference = newWeight - currentWeight;
  const priceDiff = difference * 3; // 3€/kg standard

  const handleSubmit = async () => {
    if (newWeight === currentWeight) {
      toast.info('Le poids n\'a pas changé');
      onClose?.();
      return;
    }

    if (!reason.trim() && Math.abs(difference) > 2) {
      toast.error('Veuillez indiquer une raison pour cet écart important');
      return;
    }

    setSaving(true);
    try {
      // Update order weight
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          weight: newWeight,
          original_weight: currentWeight,
          weight_adjusted_at: new Date().toISOString(),
          weight_adjustment_reason: reason || 'Ajustement à la collecte',
          total_price: newWeight * 3, // Recalculate price
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Send notification to client
      await supabase.from('notifications').insert({
        user_id: clientId,
        type: 'weight_adjusted',
        title: 'Poids ajusté',
        message: `Le poids de votre commande a été ajusté de ${currentWeight}kg à ${newWeight}kg. ${
          priceDiff > 0 ? `Différence: +${priceDiff.toFixed(2)}€` : priceDiff < 0 ? `Remboursement: ${Math.abs(priceDiff).toFixed(2)}€` : ''
        }`,
        data: { order_id: orderId, old_weight: currentWeight, new_weight: newWeight },
        created_at: new Date().toISOString(),
      });

      toast.success('Poids mis à jour et client notifié !');
      onUpdate?.(newWeight);
      onClose?.();
    } catch (error: any) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-md w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale size={24} />
            <div>
              <h3 className="font-bold">Ajuster le poids</h3>
              <p className="text-sm text-teal-100">Commande #{orderId.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {step === 'adjust' ? (
          <>
            {/* Current vs New Weight */}
            <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 rounded-xl">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Estimé client</p>
                <p className="text-2xl font-black text-slate-400">{currentWeight} kg</p>
              </div>
              <div className="text-slate-300">→</div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Poids réel</p>
                <p className="text-2xl font-black text-teal-600">{newWeight} kg</p>
              </div>
            </div>

            {/* Weight Slider */}
            <div className="mb-6">
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={newWeight}
                onChange={(e) => setNewWeight(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>1 kg</span>
                <span>15 kg</span>
                <span>30 kg</span>
              </div>
            </div>

            {/* Quick adjust buttons */}
            <div className="flex gap-2 mb-6">
              {[-2, -1, +1, +2].map((delta) => (
                <button
                  key={delta}
                  onClick={() => setNewWeight(Math.max(1, Math.min(30, newWeight + delta)))}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
                    delta < 0 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {delta > 0 ? '+' : ''}{delta} kg
                </button>
              ))}
            </div>

            {/* Difference indicator */}
            {difference !== 0 && (
              <div className={`p-4 rounded-xl mb-6 ${
                difference > 0 ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className={difference > 0 ? 'text-orange-500' : 'text-green-500'} />
                  <div>
                    <p className={`font-bold ${difference > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                      {difference > 0 ? `+${difference.toFixed(1)} kg` : `${difference.toFixed(1)} kg`}
                    </p>
                    <p className={`text-sm ${difference > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {difference > 0 
                        ? `Le client paiera ${priceDiff.toFixed(2)}€ de plus` 
                        : `Le client sera remboursé de ${Math.abs(priceDiff).toFixed(2)}€`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reason (required if big difference) */}
            {Math.abs(difference) > 2 && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Raison de l'écart (obligatoire)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Le client avait sous-estimé le volume..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-20"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => setStep('confirm')}
                disabled={newWeight === currentWeight}
                className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continuer
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation step */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={28} className="text-teal-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Confirmer l'ajustement</h4>
              <p className="text-slate-600">
                Le poids passera de <strong>{currentWeight} kg</strong> à <strong>{newWeight} kg</strong>
              </p>
              {priceDiff !== 0 && (
                <p className={`mt-2 font-bold ${priceDiff > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {priceDiff > 0 ? `+${priceDiff.toFixed(2)}€` : `-${Math.abs(priceDiff).toFixed(2)}€`}
                </p>
              )}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
              <p className="text-sm text-blue-700">
                <strong>Le client sera notifié</strong> de cet ajustement avec le détail du changement de prix.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('adjust')}
                disabled={saving}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                Confirmer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
